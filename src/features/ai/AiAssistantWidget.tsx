// import { useState, useRef, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import {
//   Mic, MicOff, X, Send, Volume2, VolumeX,
//   ShoppingCart, Coffee, Sparkles, RefreshCw,
// } from 'lucide-react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { useAppDispatch, useAppSelector } from '@/app/hooks'
// import {
//   useStartConversationMutation,
//   useSendMessageMutation,
//   useSendVoiceMessageMutation,
// } from '@/features/ai/aiApi'
// import {
//   startSession, addUserMessage,
//   addAssistantMessage, resetChat,
// } from '@/features/ai/aiChatSlice'
// import { addItem, setBranch } from '@/features/cart/cartSlice'
// import { useMicRecorder } from '@/hooks/useMicRecorder'
// import { useSpeechSynthesis } from '@/features/ai/useSpeechSynthesis'
// import { Button } from '@/components/ui/button'
// import { cn } from '@/lib/utils'
// import { useCurrentBranch } from '@/hooks/useCurrentBranch'

// export default function AiAssistantWidget() {
//   const { branchId } = useCurrentBranch()
//   const dispatch = useAppDispatch()
//   const navigate = useNavigate()
//   const { sessionId, messages, orderSummary } = useAppSelector(s => s.aiChat)
//   const cartItemCount = useAppSelector(s => s.cart.items.length)
//   const isAuthenticated = useAppSelector(s => s.auth.isAuthenticated)

//   const [isOpen, setIsOpen]     = useState(false)
//   const [input, setInput]       = useState('')
//   const [voiceMode, setVoiceMode] = useState(false)

//   const [startConversation]                         = useStartConversationMutation()
//   const [sendMessage, { isLoading: isSendingText }] = useSendMessageMutation()
//   const [sendVoice, { isLoading: isSendingVoice }]  = useSendVoiceMessageMutation()

//   const isSending = isSendingText || isSendingVoice

//   const { speak, stop: stopSpeaking, isSpeaking }  = useSpeechSynthesis()
//   const { isRecording, startRecording, stopRecording, error: micError } = useMicRecorder()

//   const bottomRef = useRef<HTMLDivElement>(null)

//   // ── Auto-start session when panel opens ──
//   useEffect(() => {
//     if (isOpen && !sessionId && branchId) {
//       startConversation({ branchId }).unwrap().then(res => {
//         dispatch(startSession({ sessionId: res.sessionId, welcomeMessage: res.message }))
//       }).catch(() => {})
//     }
//   }, [isOpen, sessionId, branchId])

//   // ── Auto-scroll to bottom on new messages ──
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages, orderSummary])

//   // ── Handle text send ──
//   const handleSend = async (overrideText?: string) => {
//     const text = (overrideText ?? input).trim()
//     if (!text || !sessionId || isSending) return

//     dispatch(addUserMessage(text))
//     setInput('')

//     try {
//       const res = await sendMessage({ sessionId, message: text }).unwrap()

//       if (!isAuthenticated && res.intent === 'place_order') {
//         dispatch(addAssistantMessage({ content: "Please sign in to add items to your order." }))
//         setTimeout(() => {
//           setIsOpen(false)
//           navigate('/login')
//         }, 2000)
//         return
//       }

//       dispatch(addAssistantMessage({ content: res.reply, orderSummary: res.orderSummary }))

//       if (voiceMode) speak(res.reply)

//       handleCartSync(res)
//     } catch {
//       dispatch(addAssistantMessage({ content: "Sorry, something went wrong. Please try again." }))
//     }
//   }

//   // ── Handle voice: record → upload to Whisper → LLM → speak reply ──
//   const handleMicToggle = async () => {
//     if (isRecording) {
//       // Stop recording and send the audio
//       const blob = await stopRecording()
//       if (!blob || !sessionId) return

//       setVoiceMode(true)
//       dispatch(addUserMessage('🎤 Voice message...'))

//       try {
//         const formData = new FormData()
//         formData.append('audio', blob, 'recording.webm')
//         formData.append('sessionId', sessionId)
//         formData.append('mimeType', blob.type || 'audio/webm')

//         const res = await sendVoice(formData).unwrap()

//         if (!isAuthenticated && res.intent === 'place_order') {
//           dispatch(addAssistantMessage({ content: "Please sign in to add items to your order." }))
//           speak("Please sign in to add items to your order.")
//           setTimeout(() => {
//             setIsOpen(false)
//             navigate('/login')
//           }, 2000)
//           return
//         }

//         // Replace the placeholder with the actual transcript
//         dispatch(addAssistantMessage({
//           content: res.reply,
//           orderSummary: res.orderSummary,
//         }))

//         // Update the "🎤 Voice message..." with real transcript
//         // We already pushed addUserMessage, just update last user msg visually
//         // Actually, let's insert the transcript as the user message content
//         // The simplest approach: we pushed a placeholder, now the transcript is in res
//         // We'll show transcript in a special way via the messages

//         speak(res.reply)
//         handleCartSync(res)
//       } catch {
//         dispatch(addAssistantMessage({ content: "I couldn't process your voice. Please try again." }))
//       }
//     } else {
//       // Start recording
//       stopSpeaking()
//       await startRecording()
//     }
//   }

//   // ── Sync AI-extracted items into cart ──
//   const handleCartSync = (res: any) => {
//     if (res.intent === 'place_order' && res.confidence >= 0.75 && res.orderSummary && branchId) {
//       dispatch(setBranch(branchId))
//       res.orderSummary.items.forEach((item: any) => {
//         dispatch(addItem({
//           productId:   item.productId,
//           productName: item.name,
//           quantity:    item.quantity,
//           unitPrice:   item.unitPrice,
//           notes:       item.notes ?? undefined,
//         }))
//       })
//     }
//   }

//   const handleNewChat = () => {
//     dispatch(resetChat())
//     if (!branchId) return
//     startConversation({ branchId }).unwrap().then(res => {
//       dispatch(startSession({ sessionId: res.sessionId, welcomeMessage: res.message }))
//     }).catch(() => {})
//   }

//   return (
//     <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">

//       {/* ═══════════════ CHAT PANEL ═══════════════ */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.9, y: 20 }}
//             transition={{ duration: 0.3, ease: [0.2, 0.65, 0.3, 0.9] }}
//             className="mb-3 w-[380px] max-w-[calc(100vw-2.5rem)] rounded-[28px] overflow-hidden shadow-[0_0_60px_rgba(245,158,11,0.12)] border border-amber-500/20 bg-[#0c0804]/95 backdrop-blur-2xl"
//             style={{ height: 520 }}
//           >
//             <div className="flex flex-col h-full">

//               {/* ── HEADER ── */}
//               <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-gradient-to-r from-amber-500/5 to-transparent shrink-0">
//                 <div className="flex items-center gap-2.5">
//                   <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.15)]">
//                     <Coffee size={16} className="text-amber-500" />
//                   </div>
//                   <div>
//                     <span className="text-sm font-bold text-white tracking-tight">Mr. Cafe AI</span>
//                     <div className="flex items-center gap-1.5">
//                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
//                       <span className="text-[10px] text-neutral-400 font-medium">
//                         {isSpeaking ? 'Speaking...' : isRecording ? 'Listening...' : 'Online'}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-1.5">
//                   {/* TTS toggle */}
//                   <button
//                     onClick={() => { setVoiceMode(v => !v); if (isSpeaking) stopSpeaking() }}
//                     className={cn(
//                       'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
//                       voiceMode
//                         ? 'bg-amber-500/20 text-amber-400'
//                         : 'bg-white/5 text-neutral-500 hover:text-white'
//                     )}
//                     title={voiceMode ? 'Mute replies' : 'Speak replies'}
//                   >
//                     {voiceMode ? <Volume2 size={14} /> : <VolumeX size={14} />}
//                   </button>

//                   {cartItemCount > 0 && (
//                     <button
//                       onClick={() => navigate('/cart')}
//                       className="flex items-center gap-1 text-[11px] bg-amber-500/15 text-amber-400 px-2 py-1 rounded-lg font-semibold border border-amber-500/20"
//                     >
//                       <ShoppingCart size={12} />
//                       {cartItemCount}
//                     </button>
//                   )}

//                   <button
//                     onClick={() => setIsOpen(false)}
//                     className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
//                   >
//                     <X size={14} />
//                   </button>
//                 </div>
//               </div>

//               {/* ── MESSAGES ── */}
//               <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
//                 {messages.map((m, i) => (
//                   <motion.div
//                     key={i}
//                     initial={{ opacity: 0, y: 8 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.25, delay: 0.05 }}
//                     className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
//                   >
//                     <div className={cn(
//                       'max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed',
//                       m.role === 'user'
//                         ? 'bg-amber-500 text-black font-medium rounded-br-md shadow-[0_2px_12px_rgba(245,158,11,0.2)]'
//                         : 'bg-white/[0.04] border border-white/10 text-neutral-200 rounded-bl-md'
//                     )}>
//                       {m.content}
//                     </div>
//                   </motion.div>
//                 ))}

//                 {/* Order summary card */}
//                 {orderSummary && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="bg-white/[0.03] border border-amber-500/20 rounded-2xl p-4 shadow-[0_0_20px_rgba(245,158,11,0.05)]"
//                   >
//                     <div className="flex items-center gap-1.5 mb-2.5">
//                       <Sparkles size={12} className="text-amber-500" />
//                       <p className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.15em]">
//                         Order Preview
//                       </p>
//                     </div>
//                     <div className="space-y-1.5">
//                       {orderSummary.items.map((item: any, i: number) => (
//                         <div key={i} className="flex justify-between text-xs">
//                           <span className="text-neutral-300">{item.quantity}× {item.name}</span>
//                           <span className="text-amber-400 font-semibold">{item.subtotal} ETB</span>
//                         </div>
//                       ))}
//                     </div>
//                     <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5">
//                       <span className="text-xs font-bold text-white">Total: {orderSummary.total} ETB</span>
//                       <div className="flex gap-2">
//                         <Button
//                           size="sm"
//                           className="h-7 text-[11px] bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg px-3"
//                           onClick={() => navigate('/checkout')}
//                         >
//                           Checkout
//                         </Button>
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           className="h-7 text-[11px] border-white/10 text-neutral-300 hover:bg-white/5 rounded-lg px-3"
//                           onClick={handleNewChat}
//                         >
//                           <RefreshCw size={10} className="mr-1" /> New
//                         </Button>
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}

//                 {/* Typing indicator */}
//                 {isSending && (
//                   <div className="flex justify-start">
//                     <div className="bg-white/[0.04] border border-white/10 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5 items-center">
//                       <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
//                       <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
//                       <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
//                     </div>
//                   </div>
//                 )}

//                 {/* Mic error */}
//                 {micError && (
//                   <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
//                     {micError}
//                   </div>
//                 )}

//                 <div ref={bottomRef} />
//               </div>

//               {/* ── INPUT BAR ── */}
//               <div className="border-t border-white/5 px-4 py-3 shrink-0 bg-[#0a0603]/50">
//                 <div className="flex items-center gap-2">
//                   <input
//                     value={input}
//                     onChange={e => setInput(e.target.value)}
//                     onKeyDown={e => e.key === 'Enter' && handleSend()}
//                     placeholder={isRecording ? '🔴 Recording... tap mic to stop' : 'Type or speak your order...'}
//                     disabled={!sessionId || isSending || isRecording}
//                     className="flex-1 h-10 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-amber-500/40 transition-all"
//                   />

//                   {/* Mic button — records real audio → Whisper STT */}
//                   <button
//                     onClick={handleMicToggle}
//                     disabled={!sessionId || isSending}
//                     className={cn(
//                       'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all border',
//                       isRecording
//                         ? 'bg-red-500/20 border-red-500/40 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse'
//                         : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/5'
//                     )}
//                     title={isRecording ? 'Stop recording & send' : 'Hold to record voice'}
//                   >
//                     {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
//                   </button>

//                   {/* Send text */}
//                   <button
//                     onClick={() => handleSend()}
//                     disabled={!sessionId || isSending || !input.trim()}
//                     className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shrink-0 disabled:opacity-30 transition-all shadow-[0_0_15px_rgba(245,158,11,0.15)]"
//                   >
//                     <Send size={15} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* ═══════════════ FLOATING TRIGGER ═══════════════ */}
//       <motion.button
//         whileHover={{ scale: 1.08 }}
//         whileTap={{ scale: 0.95 }}
//         onClick={() => setIsOpen(o => !o)}
//         aria-label={isOpen ? 'Close assistant' : 'Open Mr. Cafe AI assistant'}
//         className={cn(
//           'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border shadow-xl',
//           isOpen
//             ? 'bg-white/10 border-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]'
//             : 'bg-gradient-to-br from-amber-500 to-orange-600 border-amber-400/30 text-black shadow-[0_0_30px_rgba(245,158,11,0.3)]'
//         )}
//       >
//         {isOpen ? <X size={22} /> : <Mic size={22} />}
//       </motion.button>
//     </div>
//   )
// }


import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Sparkles, Headset, Languages, Wand2, 
  Rocket, Clock, BotMessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'

const upcomingFeatures = [
  {
    icon: <Wand2 size={18} className="text-amber-400" />,
    title: "Smart Voice Ordering",
    description: "Simply speak your cravings and let the AI instantly build your cart."
  },
  {
    icon: <Headset size={18} className="text-orange-400" />,
    title: "24/7 Customer Service",
    description: "Instant, intelligent assistance for your orders, tracking, and inquiries."
  },
  {
    icon: <Sparkles size={18} className="text-emerald-400" />,
    title: "Tailored Recommendations",
    description: "Personalized menu suggestions curated just for your taste profile."
  },
  {
    icon: <Languages size={18} className="text-blue-400" />,
    title: "Multi-lingual Support",
    description: "Chat and order seamlessly in your preferred native language."
  }
];

export default function AiAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 md:bottom-5 md:right-5 z-50 flex flex-col items-end">

      {/* ═══════════════ "COMING SOON" PANEL ═══════════════ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.2, 0.65, 0.3, 0.9] }}
            className="mb-3 w-[calc(100vw-2rem)] sm:w-[380px] max-h-[calc(100vh-100px)] flex flex-col rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-[0_0_60px_rgba(245,158,11,0.12)] border border-amber-500/20 bg-[#0c0804]/95 backdrop-blur-2xl relative"
          >
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
            <div className="absolute -right-10 top-20 w-40 h-40 bg-orange-500/10 rounded-full blur-[50px] pointer-events-none" />

            <div className="flex flex-col h-full relative z-10 overflow-hidden">

              {/* ── HEADER ── */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5 bg-white/[0.02] shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.15)] relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-transparent opacity-50" />
                    <BotMessageSquare size={16} className="text-amber-500 relative z-10 sm:w-[18px] sm:h-[18px]" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-2">
                      Mr. Cafe AI
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
                        Beta
                      </span>
                    </span>
                    <p className="text-[10px] sm:text-[11px] text-neutral-400 font-medium mt-0.5 flex items-center gap-1.5">
                      <Clock size={10} className="text-amber-500/70" /> In Development
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all hover:rotate-90 duration-300 shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              {/* ── BODY ── */}
              <div className="px-4 sm:px-6 py-5 sm:py-8 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="text-center mb-6 sm:mb-8">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 mb-3 sm:mb-4 shadow-lg shadow-amber-500/10"
                  >
                    <Rocket size={28} className="text-amber-400 sm:w-8 sm:h-8" />
                  </motion.div>
                  <h3 className="text-lg sm:text-xl font-black text-white mb-2 tracking-tight">
                    Something Amazing <br /> is <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Brewing</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed px-2">
                    We are building a next-generation AI assistant to completely transform your cafe experience.
                  </p>
                </div>

                {/* Feature List */}
                <div className="space-y-3 sm:space-y-4">
                  {upcomingFeatures.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + idx * 0.1, duration: 0.4 }}
                      className="flex gap-3 sm:gap-4 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/30 hover:bg-white/[0.05] transition-all group"
                    >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-neutral-200 mb-0.5 sm:mb-1">{feature.title}</h4>
                        <p className="text-[10px] sm:text-[11px] text-neutral-500 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ── FOOTER ── */}
              <div className="p-4 sm:p-6 pt-2 mt-auto shrink-0 bg-[#0c0804]">
                <button
                  disabled
                  className="w-full py-3 sm:py-3.5 rounded-xl bg-white/5 border border-white/10 text-neutral-400 font-semibold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <Sparkles size={14} />
                  Rolling Out Soon
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════ FLOATING TRIGGER ═══════════════ */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(o => !o)}
        aria-label={isOpen ? 'Close assistant preview' : 'Preview AI Assistant'}
        className={cn(
          'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border shadow-2xl relative overflow-hidden group',
          isOpen
            ? 'bg-white/10 border-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]'
            : 'bg-gradient-to-br from-[#120804] to-black border-amber-500/30 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.2)]'
        )}
      >
        {!isOpen && (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        )}
        
        {isOpen ? (
          <X size={20} className="relative z-10 sm:w-[22px] sm:h-[22px]" />
        ) : (
          <div className="relative z-10 flex items-center justify-center">
            <Sparkles size={20} className="animate-pulse sm:w-[22px] sm:h-[22px]" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-black" />
          </div>
        )}
      </motion.button>
    </div>
  )
}