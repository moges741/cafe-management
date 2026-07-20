/**
 * useSpeechRecognition
 * ──────────────────────────────────────────────────────────
 * A typed hook around the Web Speech API for recording audio.
 * Returns:
 *   - isRecording      : boolean
 *   - startRecording() : begins capturing mic → returns MediaRecorder
 *   - stopRecording()  : stops and resolves the returned Promise<Blob>
 *   - error            : string | null
 *
 * We record via MediaRecorder and collect chunks into a Blob,
 * then send that Blob to the backend Whisper endpoint.
 */

import { useState, useRef, useCallback } from 'react'

interface UseMicRecorderReturn {
  isRecording: boolean
  startRecording: () => Promise<void>
  stopRecording: () => Promise<Blob | null>
  error: string | null
}

export function useMicRecorder(): UseMicRecorderReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef        = useRef<Blob[]>([])
  const resolveRef       = useRef<((blob: Blob | null) => void) | null>(null)

  const startRecording = useCallback(async () => {
    setError(null)
    chunksRef.current = []

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Prefer webm/opus (Chromium) — fall back to default
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : ''

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        })
        // Stop all tracks so the mic indicator disappears
        stream.getTracks().forEach((t) => t.stop())
        resolveRef.current?.(blob)
        resolveRef.current = null
      }

      recorder.start(100) // collect in 100ms chunks
      setIsRecording(true)
    } catch (err: any) {
      const msg =
        err?.name === 'NotAllowedError'
          ? 'Microphone permission denied. Please allow access in your browser.'
          : `Could not access microphone: ${err?.message ?? err}`
      setError(msg)
      setIsRecording(false)
    }
  }, [])

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || !isRecording) {
        resolve(null)
        return
      }
      resolveRef.current = resolve
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    })
  }, [isRecording])

  return { isRecording, startRecording, stopRecording, error }
}
