import React, { useState } from 'react'
import { Button } from '../ui'

interface EnquiryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { subject: string; message: string }) => Promise<void>
  productName?: string
  artisanName: string
}

export function EnquiryModal({ isOpen, onClose, onSubmit, productName, artisanName }: EnquiryModalProps) {
  const [subject, setSubject] = useState(productName ? `Inquiry regarding ${productName}` : `Inquiry for ${artisanName}`)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      setError('Please enter a message.')
      return
    }
    try {
      setIsSubmitting(true)
      setError('')
      await onSubmit({ subject, message })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit enquiry')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 transition-opacity bg-gray-600 bg-opacity-75" aria-hidden="true" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-xl overflow-hidden text-left transition-all z-10 flex flex-col max-h-[90vh]">
        <div className="overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="w-full mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                    Contact Artisan
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Send a message directly to {artisanName}.
                  </p>
                  
                  {error && (
                    <div className="p-2 mt-4 text-sm text-red-700 bg-red-100 rounded-md">
                      {error}
                    </div>
                  )}

                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        id="subject"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="Write your inquiry here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:ml-3 sm:w-auto"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="w-full mt-3 sm:mt-0 sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
