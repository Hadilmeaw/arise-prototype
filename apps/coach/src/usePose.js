/* MediaPipe Pose Landmarker hook.
   Loads the model once, then on each animation frame runs inference on the
   given <video> element and returns the most recent landmarks + an auto rep
   count derived from hip Y motion. */

import { useEffect, useRef, useState } from 'react'
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision'

const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task'
const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'

/* MediaPipe Pose keypoint indices we care about. */
export const KP = {
  nose: 0,
  lShoulder: 11, rShoulder: 12,
  lElbow: 13,    rElbow: 14,
  lWrist: 15,    rWrist: 16,
  lHip: 23,      rHip: 24,
  lKnee: 25,     rKnee: 26,
  lAnkle: 27,    rAnkle: 28,
}

export const BONES = [
  [KP.lShoulder, KP.rShoulder],
  [KP.lShoulder, KP.lElbow], [KP.lElbow, KP.lWrist],
  [KP.rShoulder, KP.rElbow], [KP.rElbow, KP.rWrist],
  [KP.lShoulder, KP.lHip], [KP.rShoulder, KP.rHip],
  [KP.lHip, KP.rHip],
  [KP.lHip, KP.lKnee], [KP.lKnee, KP.lAnkle],
  [KP.rHip, KP.rKnee], [KP.rKnee, KP.rAnkle],
]

/* Hook: pose tracking + rep counting from a video element ref.
   - landmarks: array of {x, y, z, visibility} (normalized 0..1) or null
   - reps:      auto-counted sit-to-stand reps since session start
   - state:     'sitting' | 'rising' | 'standing' | 'descending'
   - ready:     true once the model has loaded
*/
export function usePose(videoRef, { enabled = true, onRep } = {}) {
  const [landmarks, setLandmarks] = useState(null)
  const [reps, setReps] = useState(0)
  const [state, setState] = useState('sitting')
  const [ready, setReady] = useState(false)

  const landmarkerRef = useRef(null)
  const rafRef = useRef(null)
  const stateRef = useRef('sitting')
  const hipMinRef = useRef(1)      // running min hip Y observed (standing)
  const hipMaxRef = useRef(0)      // running max hip Y observed (sitting)
  const lastTsRef = useRef(0)
  const onRepRef = useRef(onRep)
  useEffect(() => { onRepRef.current = onRep })

  // Load model once.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(WASM_URL)
        const lm = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
          runningMode: 'VIDEO',
          numPoses: 1,
        })
        if (cancelled) { lm.close(); return }
        landmarkerRef.current = lm
        setReady(true)
      } catch (e) {
        console.error('[usePose] failed to load model', e)
      }
    })()
    return () => {
      cancelled = true
      if (landmarkerRef.current) {
        try { landmarkerRef.current.close() } catch {}
        landmarkerRef.current = null
      }
    }
  }, [])

  // Inference loop.
  useEffect(() => {
    if (!enabled || !ready) return
    function loop() {
      const video = videoRef.current
      const lm = landmarkerRef.current
      if (video && lm && video.readyState >= 2 && !video.paused && !video.ended) {
        const ts = performance.now()
        if (ts - lastTsRef.current > 16) {
          lastTsRef.current = ts
          try {
            const result = lm.detectForVideo(video, ts)
            const points = result?.landmarks?.[0] || null
            setLandmarks(points)
            if (points) updateRepCount(points)
          } catch (e) {
            // Frame may not be ready yet — ignore single-frame failures.
          }
        }
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [enabled, ready, videoRef])

  function updateRepCount(points) {
    const lh = points[KP.lHip], rh = points[KP.rHip]
    if (!lh || !rh) return
    if ((lh.visibility ?? 1) < 0.5 || (rh.visibility ?? 1) < 0.5) return
    const hipY = (lh.y + rh.y) / 2          // 0 = top of frame, 1 = bottom

    // Track observed range with mild decay so the calibration adapts.
    if (hipY < hipMinRef.current) hipMinRef.current = hipY
    if (hipY > hipMaxRef.current) hipMaxRef.current = hipY
    const range = hipMaxRef.current - hipMinRef.current
    if (range < 0.05) return                 // person hasn't moved enough yet

    const norm = (hipY - hipMinRef.current) / range   // 0=standing, 1=sitting
    const STAND_T = 0.30
    const SIT_T   = 0.70

    const s = stateRef.current
    if (s === 'sitting' && norm < STAND_T) {
      stateRef.current = 'rising'; setState('rising')
    } else if (s === 'rising' && norm < STAND_T * 0.5) {
      stateRef.current = 'standing'; setState('standing')
    } else if (s === 'standing' && norm > 0.5) {
      stateRef.current = 'descending'; setState('descending')
    } else if (s === 'descending' && norm > SIT_T) {
      stateRef.current = 'sitting'; setState('sitting')
      setReps(r => {
        const next = r + 1
        onRepRef.current?.(next)
        return next
      })
    }
  }

  function reset() {
    setReps(0); setState('sitting')
    stateRef.current = 'sitting'
    hipMinRef.current = 1
    hipMaxRef.current = 0
  }

  return { landmarks, reps, state, ready, reset }
}
