import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { useStartConversationMutation, useSendMessageMutation } from '@/features/ai/aiApi'
import { startSession, addUserMessage, addAssistantMessage, resetChat } from '@/features/ai/aiChatSlice'
import { addItem, setBranch } from '@/features/cart/cartSlice'
import { useSpeechRecognition } from '@/features/ai/useSpeechRecognition'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const BRANCH_ID = '845d738e-f5ba-4b88-8eae-e9b829b45dba'

export default function AiChatPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { sessionId, messages, orderSummary } = useAppSelector(state => state.aiChat)
  const cartItemCount = useAppSelector(state => state.cart.items.length)

  const [startConversation, { isLoading: isStarting }] = useStartConversationMutation()
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation()

  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const { isListening, isSupported, startListening, stopListening } = useSpeechRecognition(
    (transcript) => {
      setInput(transcript)
    }
  )

  useEffect(() => {
    if (!sessionId) {
      startConversation({ branchId: BRANCH_ID }).unwrap().then((res) => {
        dispatch(startSession({ sessionId: res.sessionId, welcomeMessage: res.message }))
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, orderSummary])

  const handleSend = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim()
    if (!text || !sessionId || isSending) return

    dispatch(addUserMessage(text))
    setInput('')

    try {
      // NOTE: we intentionally never send a "confirm" message to the backend's
      // order-creation logic anymore — the AI still extracts items and returns
      // orderSummary, but WE decide what to do with it on the frontend
      const res = await sendMessage({ sessionId, message: text }).unwrap()

      dispatch(addAssistantMessage({
        content:      res.reply,
        orderSummary: res.orderSummary,
      }))

      // The moment the AI has confidently extracted items, add them to the
      // real cart immediately — no separate "AI order" path anymore
      if (res.intent === 'place_order' && res.confidence >= 0.75 && res.orderSummary) {
        dispatch(setBranch(BRANCH_ID))
        res.orderSummary.items.forEach((item: any) => {
          dispatch(addItem({
            productId:   item.productId ?? item.name, // fallback if backend omits id on summary
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
    if (isListening) stopListening()
    else startListening()
  }

  const handleNewChat = () => {
    dispatch(resetChat())
    startConversation({ branchId: BRANCH_ID }).unwrap().then((res) => {
      dispatch(startSession({ sessionId: res.sessionId, welcomeMessage: res.message }))
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <Link to="/menu" className="text-sm text-primary">← Back to menu</Link>
        <div className="flex items-center gap-3">
          {cartItemCount > 0 && (
            <button
              onClick={() => navigate('/cart')}
              className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full"
            >
              Cart ({cartItemCount})
            </button>
          )}
          <span className="text-xs" style={{ color: '#B58B67' }}>Mr. Cafe AI Assistant</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 max-w-lg mx-auto w-full">
        {isStarting && (
          <p className="text-center text-sm" style={{ color: '#B58B67' }}>Connecting...</p>
        )}

        {messages.map((m, i) => (
          <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={cn(
              'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm',
              m.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-br-sm'
                : 'bg-card border border-border text-foreground rounded-bl-sm'
            )}>
              {m.content}
            </div>
          </div>
        ))}

        {/* Order summary — now shows "Added to cart", not a fake order confirmation */}
        {orderSummary && (
          <div className="bg-card border border-primary/40 rounded-2xl p-4 max-w-[85%]">
            <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
              Added to your cart
            </p>
            <div className="space-y-1">
              {orderSummary.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-foreground">{item.quantity}x {item.name}</span>
                  <span style={{ color: '#B58B67' }}>{item.subtotal} ETB</span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-border flex justify-between font-medium text-sm">
              <span className="text-foreground">Total</span>
              <span className="text-primary">{orderSummary.total} ETB</span>
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" className="flex-1" onClick={() => navigate('/checkout')}>
                Go to checkout
              </Button>
              <Button size="sm" variant="outline" onClick={handleNewChat}>
                Keep chatting
              </Button>
            </div>
          </div>
        )}

        {isSending && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-2.5 flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? 'Listening...' : 'Type or speak your order...'}
            disabled={!sessionId || isSending}
          />
          {isSupported && (
            <Button
              type="button"
              variant={isListening ? 'default' : 'outline'}
              onClick={handleMicClick}
              disabled={!sessionId || isSending}
            >
              {isListening ? '● Stop' : '🎙'}
            </Button>
          )}
          <Button onClick={() => handleSend()} disabled={!sessionId || isSending || !input.trim()}>
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}