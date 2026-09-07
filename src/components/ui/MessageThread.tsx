import React, { useState } from 'react'
import { Button } from './Button'

export interface Message {
  id: string
  sender_user_id: string
  message: string
  created_at: string
  sender?: {
    id: string
    full_name: string | null
    role: string
  }
}

interface MessageThreadProps {
  messages: Message[]
  currentUserId: string
  onSendMessage: (text: string) => Promise<void>
}

export function MessageThread({ messages, currentUserId, onSendMessage }: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      setIsSending(true)
      await onSendMessage(newMessage)
      setNewMessage('')
    } catch (err) {
      console.error('Failed to send message', err)
      // error handling could go here
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900">Clarification Thread</h3>
        <p className="text-sm text-gray-500">Discuss requirements and finalize terms</p>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto min-h-[300px] max-h-[500px]">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_user_id === currentUserId
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${isMe ? 'bg-maroon-700 text-white' : 'bg-gray-100 text-gray-900'}`}>
                  {!isMe && (
                    <div className="text-xs font-semibold text-gray-500 mb-1">
                      {msg.sender?.full_name || 'User'} ({msg.sender?.role || 'Unknown'})
                    </div>
                  )}
                  <div className="text-sm whitespace-pre-wrap">{msg.message}</div>
                  <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-maroon-200' : 'text-gray-400'}`}>
                    {new Date(msg.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSend} className="flex space-x-2">
          <input
            type="text"
            className="flex-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button type="submit" disabled={isSending || !newMessage.trim()}>
            {isSending ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </div>
    </div>
  )
}
