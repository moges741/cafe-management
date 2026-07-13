import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, MicOff, X, MessageCircle, Send, Volume2, ShoppingCart } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { useStartConversationMutation, useSendMessageMutation } from '@/features/ai/aiApi'
import { startSession, addUserMessage, addAssistantMessage, resetChat } from '@/features/ai/aiChatSlice'
import { addItem, setBranch } from '@/features/cart/cartSlice'
import { useSpeechRecognition } from '@/features/ai/useSpeechRecognition'
import { useSpeechSynthesis } from '@/features/ai/useSpeechSynthesis'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const BRANCH_ID = '845d738e-f5ba-4b88-8eae-e9b829b45dba'

export default function AiAssistantWidget() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { sessionId, messages, orderSummary } = useAppSelector(state => state.aiChat)
  const cartItemCount = useAppSelector(state => state.cart.items.length)

  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [voiceMode, setVoiceMode] = useState(false) // true = speak replies aloud

  const [startConversation] = useStartConversationMutation()
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation()
  const { speak, stop: stopSpeaking, isSpeaking } = useSpeechSynthesis()

  const bottomRef = useRef<HTMLDivElement>(null)

  const { isListening, isSupported, startListening, stopListening } = useSpeechRecognition(
    (transcript) => {
      setVoiceMode(true)      // if they spoke, assume they want spoken replies too
      handleSend(transcript)  // auto-send once transcription completes
    }
  )

  useEffect(() => {
    if (isOpen && !sessionId) {
      startConversation({ branchId: BRANCH_ID }).unwrap().then((res) => {
        dispatch(startSession({ sessionId: res.sessionId, welcomeMessage: res.message }))
      })
    }
  }, [isOpen, sessionId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, orderSummary])

  const handleSend = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim()
    if (!text || !sessionId || isSending) return

    dispatch(addUserMessage(text))
    setInput('')

    try {
      const res = await sendMessage({ sessionId, message: text }).unwrap()

      dispatch(addAssistantMessage({ content: res.reply, orderSummary: res.orderSummary }))

      if (voiceMode) speak(res.reply)

      if (res.intent === 'place_order' && res.confidence >= 0.75 && res.orderSummary) {
        dispatch(setBranch(BRANCH_ID))
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
    } catch {
      dispatch(addAssistantMessage({ content: "Sorry, something went wrong. Please try again." }))
    }
  }

  const handleMicClick = () => {
    if (isListening) {
      stopListening()
    } else {
      stopSpeaking() // don't let it hear itself
      startListening()
    }
  }

  const handleNewChat = () => {
    dispatch(resetChat())
    startConversation({ branchId: BRANCH_ID }).unwrap().then((res) => {
      dispatch(startSession({ sessionId: res.sessionId, welcomeMessage: res.message }))
    })
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* ── Expanded panel ── */}
      <div
        className={cn(
          'mb-3 w-[360px] max-w-[calc(100vw-2.5rem)] bg-card border border-border rounded-2xl shadow-lg overflow-hidden transition-all duration-200 origin-bottom-right',
          isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-95 opacity-0 pointer-events-none absolute'
        )}
        style={{ height: isOpen ? 480 : 0 }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                <MessageCircle size={14} className="text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">Mr. Cafe Assistant</span>
              {isSpeaking && <Volume2 size={14} className="text-primary animate-pulse" />}
            </div>
            <div className="flex items-center gap-1">
              {cartItemCount > 0 && (
                <button
                  onClick={() => navigate('/cart')}
                  className="flex items-center gap-1 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full"
                >
                  <ShoppingCart size={12} />
                  {cartItemCount}
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-secondary text-muted-foreground"
                aria-label="Close assistant"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={cn(
                  'max-w-[80%] rounded-2xl px-3 py-2 text-sm',
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-secondary text-foreground rounded-bl-sm'
                )}>
                  {m.content}
                </div>
              </div>
            ))}

            {orderSummary && (
              <div className="bg-secondary border border-primary/40 rounded-xl p-3">
                <p className="text-[11px] font-semibold text-primary mb-1.5 uppercase tracking-wide">
                  Added to your cart
                </p>
                <div className="space-y-1">
                  {orderSummary.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-foreground">{item.quantity}x {item.name}</span>
                      <span style={{ color: '#B58B67' }}>{item.subtotal} ETB</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" className="flex-1 h-7 text-xs" onClick={() => navigate('/checkout')}>
                    Checkout
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={handleNewChat}>
                    New order
                  </Button>
                </div>
              </div>
            )}

            {isSending && (
              <div className="flex justify-start">
                <div className="bg-secondary rounded-2xl rounded-bl-sm px-3 py-2 flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div className="border-t border-border px-3 py-2.5 shrink-0">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? 'Listening...' : 'Type or speak your order...'}
                disabled={!sessionId || isSending}
                className="flex-1 h-9 rounded-full border border-input bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />

              {isSupported && (
                <button
                  onClick={handleMicClick}
                  disabled={!sessionId || isSending}
                  aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors',
                    isListening
                      ? 'bg-destructive text-destructive-foreground'
                      : 'bg-secondary text-foreground hover:bg-secondary/70'
                  )}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
              )}

              <button
                onClick={() => handleSend()}
                disabled={!sessionId || isSending || !input.trim()}
                aria-label="Send message"
                className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 disabled:opacity-40"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Floating trigger button ── */}
      <button
        onClick={() => setIsOpen(o => !o)}
        aria-label={isOpen ? 'Close assistant' : 'Open Mr. Cafe assistant'}
        className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105',
          isOpen ? 'bg-secondary text-foreground' : 'bg-primary text-primary-foreground'
        )}
      >
        {isOpen ? <X size={22} /> : <Mic size={22} />}
      </button>
    </div>
  )
}