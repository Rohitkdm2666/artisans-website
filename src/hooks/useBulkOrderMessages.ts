import { useState, useEffect, useCallback } from 'react'
import { getBulkOrderMessages, sendBulkOrderMessage } from '../services/bulkOrders'
import type { BulkOrderMessage } from '../types'

export function useBulkOrderMessages(bulkRequestId: string | undefined) {
  const [messages, setMessages] = useState<BulkOrderMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchMessages = useCallback(async () => {
    if (!bulkRequestId) {
      setMessages([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const data = await getBulkOrderMessages(bulkRequestId)
      setMessages(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch messages'))
    } finally {
      setIsLoading(false)
    }
  }, [bulkRequestId])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const sendMessage = async (senderUserId: string, messageText: string) => {
    if (!bulkRequestId) throw new Error('No bulk request ID')
    const newMsg = await sendBulkOrderMessage(bulkRequestId, senderUserId, messageText)
    await fetchMessages() // refresh to get relationships if any
    return newMsg
  }

  return {
    messages,
    isLoading,
    error,
    refresh: fetchMessages,
    sendMessage
  }
}
