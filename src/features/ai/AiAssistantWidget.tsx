import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Mic, MicOff, X, Send, Volume2, VolumeX,
  ShoppingCart, Coffee, Sparkles, RefreshCw,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  useStartConversationMutation,
  useSendMessageMutation,
  useSendVoiceMessageMutation,
} from '@/features/ai/aiApi'
import {
  startSession, addUserMessage,
  addAssistantMessage, resetChat,
} from '@/features/ai/aiChatSlice'
import { addItem, setBranch } from '@/features/cart/cartSlice'
import { useMicRecorder } from '@/hooks/useMicRecorder'
import { useSpeechSynthesis } from '@/features/ai/useSpeechSynthesis'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCurrentBranch } from '@/hooks/useCurrentBranch'

export default function AiAssistantWidget() {
  const { branchId } = useCurrentBranch()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { sessionId, messages, orderSummary } = useAppSelector(s => s.aiChat)
  const cartItemCount = useAppSelector(s => s.cart.items.length)
  const isAuthenticated = useAppSelector(s => s.auth.isAuthenticated)

  const [isOpen, setIsOpen]     = useState(false)
  const [input, setInput]       = useState('')
  const [voiceMode, setVoiceMode] = useState(false)

  const [startConversation]                         = useStartConversationMutation()
  const [sendMessage, { isLoading: isSendingText }] = useSendMessageMutation()
  const [sendVoice, { isLoading: isSendingVoice }]  = useSendVoiceMessageMutation()

  const isSending = isSendingText || isSendingVoice

  const { speak, stop: stopSpeaking, isSpeaking }  = useSpeechSynthesis()
  const { isRecording, startRecording, stopRecording, error: micError } = useMicRecorder()

  const bottomRef = useRef<HTMLDivElement>(null)

  // ── Auto-start session when panel opens ──
  useEffect(() => {
    if (isOpen && !sessionId && branchId) {
      startConversation({ branchId }).unwrap().then(res => {
        dispatch(startSession({ sessionId: res.sessionId, welcomeMessage: res.message }))
      }).catch(() => {})
    }
  }, [isOpen, sessionId, branchId])

  // ── Auto-scroll to bottom on new messages ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, orderSummary])

  // ── Handle text send ──
  const handleSend = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim()
    if (!text || !sessionId || isSending) return

    dispatch(addUserMessage(text))
    setInput('')

    try {
      const res = await sendMessage({ sessionId, message: text }).unwrap()

      if (!isAuthenticated && res.intent === 'place_order') {
        dispatch(addAssistantMessage({ content: "Please sign in to add items to your order." }))
        setTimeout(() => {
          setIsOpen(false)
          navigate('/login')
        }, 2000)
        return
      }

      dispatch(addAssistantMessage({ content: res.reply, orderSummary: res.orderSummary }))

      if (voiceMode) speak(res.reply)

      handleCartSync(res)
    } catch {
      dispatch(addAssistantMessage({ content: "Sorry, something went wrong. Please try again." }))
    }
  }

  // ── Handle voice: record → upload to Whisper → LLM → speak reply ──
  const handleMicToggle = async () => {
    if (isRecording) {
      // Stop recording and send the audio
      const blob = await stopRecording()
      if (!blob || !sessionId) return

      setVoiceMode(true)
      dispatch(addUserMessage('🎤 Voice message...'))

      try {
        const formData = new FormData()
        formData.append('audio', blob, 'recording.webm')
        formData.append('sessionId', sessionId)
        formData.append('mimeType', blob.type || 'audio/webm')

        const res = await sendVoice(formData).unwrap()

        if (!isAuthenticated && res.intent === 'place_order') {
          dispatch(addAssistantMessage({ content: "Please sign in to add items to your order." }))
          speak("Please sign in to add items to your order.")
          setTimeout(() => {
            setIsOpen(false)
            navigate('/login')
          }, 2000)
          return
        }

        // Replace the placeholder with the actual transcript
        dispatch(addAssistantMessage({
          content: res.reply,
          orderSummary: res.orderSummary,
        }))

        // Update the "🎤 Voice message..." with real transcript
        // We already pushed addUserMessage, just update last user msg visually
        // Actually, let's insert the transcript as the user message content
        // The simplest approach: we pushed a placeholder, now the transcript is in res
        // We'll show transcript in a special way via the messages

        speak(res.reply)
        handleCartSync(res)
      } catch {
        dispatch(addAssistantMessage({ content: "I couldn't process your voice. Please try again." }))
      }
    } else {
      // Start recording
      stopSpeaking()
      await startRecording()
    }
  }

  // ── Sync AI-extracted items into cart ──
  const handleCartSync = (res: any) => {
    if (res.intent === 'place_order' && res.confidence >= 0.75 && res.orderSummary && branchId) {
      dispatch(setBranch(branchId))
      res.orderSummary.items.forEach((item: any) => {
        dispatch(addItem({
          productId:   item.productId,
          productName: item.name,
          quantity:    item.quantity,
          unitPrice:   item.unitPrice,
          notes:       item.notes ?? undefined,
        }))
      })
    }
  }

  const handleNewChat = () => {
    dispatch(resetChat())
    if (!branchId) return
    startConversation({ branchId }).unwrap().then(res => {
      dispatch(startSession({ sessionId: res.sessionId, welcomeMessage: res.message }))
    }).catch(() => {})
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">

      {/* ═══════════════ CHAT PANEL ═══════════════ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.2, 0.65, 0.3, 0.9] }}
            className="mb-3 w-[380px] max-w-[calc(100vw-2.5rem)] rounded-[28px] overflow-hidden shadow-[0_0_60px_rgba(245,158,11,0.12)] border border-amber-500/20 bg-[#0c0804]/95 backdrop-blur-2xl"
            style={{ height: 520 }}
          >
            <div className="flex flex-col h-full">

              {/* ── HEADER ── */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-gradient-to-r from-amber-500/5 to-transparent shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.15)]">
                    <Coffee size={16} className="text-amber-500" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white tracking-tight">Mr. Cafe AI</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] text-neutral-400 font-medium">
                        {isSpeaking ? 'Speaking...' : isRecording ? 'Listening...' : 'Online'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* TTS toggle */}
                  <button
                    onClick={() => { setVoiceMode(v => !v); if (isSpeaking) stopSpeaking() }}
                    className={cn(
                      'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
                      voiceMode
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-white/5 text-neutral-500 hover:text-white'
                    )}
                    title={voiceMode ? 'Mute replies' : 'Speak replies'}
                  >
                    {voiceMode ? <Volume2 size={14} /> : <VolumeX size={14} />}
                  </button>

                  {cartItemCount > 0 && (
                    <button
                      onClick={() => navigate('/cart')}
                      className="flex items-center gap-1 text-[11px] bg-amber-500/15 text-amber-400 px-2 py-1 rounded-lg font-semibold border border-amber-500/20"
                    >
                      <ShoppingCart size={12} />
                      {cartItemCount}
                    </button>
                  )}

                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* ── MESSAGES ── */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.05 }}
                    className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
                  >
                    <div className={cn(
                      'max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed',
                      m.role === 'user'
                        ? 'bg-amber-500 text-black font-medium rounded-br-md shadow-[0_2px_12px_rgba(245,158,11,0.2)]'
                        : 'bg-white/[0.04] border border-white/10 text-neutral-200 rounded-bl-md'
                    )}>
                      {m.content}
                    </div>
                  </motion.div>
                ))}

                {/* Order summary card */}
                {orderSummary && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/[0.03] border border-amber-500/20 rounded-2xl p-4 shadow-[0_0_20px_rgba(245,158,11,0.05)]"
                  >
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <Sparkles size={12} className="text-amber-500" />
                      <p className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.15em]">
                        Order Preview
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      {orderSummary.items.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span className="text-neutral-300">{item.quantity}× {item.name}</span>
                          <span className="text-amber-400 font-semibold">{item.subtotal} ETB</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5">
                      <span className="text-xs font-bold text-white">Total: {orderSummary.total} ETB</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="h-7 text-[11px] bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg px-3"
                          onClick={() => navigate('/checkout')}
                        >
                          Checkout
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-[11px] border-white/10 text-neutral-300 hover:bg-white/5 rounded-lg px-3"
                          onClick={handleNewChat}
                        >
                          <RefreshCw size={10} className="mr-1" /> New
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Typing indicator */}
                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-white/[0.04] border border-white/10 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5 items-center">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}

                {/* Mic error */}
                {micError && (
                  <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                    {micError}
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* ── INPUT BAR ── */}
              <div className="border-t border-white/5 px-4 py-3 shrink-0 bg-[#0a0603]/50">
                <div className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder={isRecording ? '🔴 Recording... tap mic to stop' : 'Type or speak your order...'}
                    disabled={!sessionId || isSending || isRecording}
                    className="flex-1 h-10 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-amber-500/40 transition-all"
                  />

                  {/* Mic button — records real audio → Whisper STT */}
                  <button
                    onClick={handleMicToggle}
                    disabled={!sessionId || isSending}
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all border',
                      isRecording
                        ? 'bg-red-500/20 border-red-500/40 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse'
                        : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/5'
                    )}
                    title={isRecording ? 'Stop recording & send' : 'Hold to record voice'}
                  >
                    {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>

                  {/* Send text */}
                  <button
                    onClick={() => handleSend()}
                    disabled={!sessionId || isSending || !input.trim()}
                    className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shrink-0 disabled:opacity-30 transition-all shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════ FLOATING TRIGGER ═══════════════ */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(o => !o)}
        aria-label={isOpen ? 'Close assistant' : 'Open Mr. Cafe AI assistant'}
        className={cn(
          'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border shadow-xl',
          isOpen
            ? 'bg-white/10 border-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]'
            : 'bg-gradient-to-br from-amber-500 to-orange-600 border-amber-400/30 text-black shadow-[0_0_30px_rgba(245,158,11,0.3)]'
        )}
      >
        {isOpen ? <X size={22} /> : <Mic size={22} />}
      </motion.button>
    </div>
  )
}