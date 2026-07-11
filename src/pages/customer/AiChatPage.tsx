import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { useStartConversationMutation, useSendMessageMutation } from '@/features/ai/aiApi'
import { startSession, addUserMessage, addAssistantMessage, resetChat } from '@/features/ai/aiChatSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const BRANCH_ID = '845d738e-f5ba-4b88-8eae-e9b829b45dba'

export default function AiChatPage() {
  const dispatch = useAppDispatch()
  const { sessionId, messages, orderSummary, placedOrder } = useAppSelector(state => state.aiChat)

  const [startConversation, { isLoading: isStarting }] = useStartConversationMutation()
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation()

  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  // Start a fresh session the first time this page mounts
  useEffect(() => {
    if (!sessionId) {
      startConversation({ branchId: BRANCH_ID }).unwrap().then((res) => {
        dispatch(startSession({ sessionId: res.sessionId, welcomeMessage: res.message }))
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || !sessionId || isSending) return

    const text = input.trim()
    dispatch(addUserMessage(text))
    setInput('')

    try {
      const res = await sendMessage({ sessionId, message: text }).unwrap()

      dispatch(addAssistantMessage({
        content:       res.reply,
        orderSummary:  res.orderSummary,
        placedOrder:   res.order
          ? { orderNumber: res.order.orderNumber, totalAmount: res.order.totalAmount }
          : undefined,
      }))
    } catch {
      dispatch(addAssistantMessage({ content: "Sorry, something went wrong. Please try again." }))
    }
  }

  const handleNewOrder = () => {
    dispatch(resetChat())
    startConversation({ branchId: BRANCH_ID }).unwrap().then((res) => {
      dispatch(startSession({ sessionId: res.sessionId, welcomeMessage: res.message }))
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <Link to="/menu" className="text-sm text-primary">← Back to menu</Link>
        <span className="text-xs" style={{ color: '#B58B67' }}>Mr. Cafe AI Assistant</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 max-w-lg mx-auto w-full">
        {isStarting && (
          <p className="text-center text-sm" style={{ color: '#B58B67' }}>Connecting...</p>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm',
                m.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                  : 'bg-card border border-border text-foreground rounded-bl-sm'
              )}
            >
              {m.content}
            </div>
          </div>
        ))}

        {/* Order summary bubble */}
        {orderSummary && !placedOrder && (
          <div className="bg-card border border-primary/40 rounded-2xl p-4 max-w-[85%]">
            <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
              Order summary
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
          </div>
        )}

        {/* Order placed confirmation */}
        {placedOrder && (
          <div className="bg-primary/10 border border-primary rounded-2xl p-4 max-w-[85%] text-center">
            <p className="text-sm font-semibold text-primary">Order {placedOrder.orderNumber} placed!</p>
            <p className="text-xs mt-1" style={{ color: '#B58B67' }}>{placedOrder.totalAmount} ETB</p>
            <Button size="sm" className="mt-3" onClick={handleNewOrder}>
              Start a new order
            </Button>
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

      {/* Input bar */}
      {!placedOrder && (
        <div className="border-t border-border px-4 py-3">
          <div className="max-w-lg mx-auto flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your order..."
              disabled={!sessionId || isSending}
            />
            <Button onClick={handleSend} disabled={!sessionId || isSending || !input.trim()}>
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}