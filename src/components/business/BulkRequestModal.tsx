import React, { useState } from 'react'
import { Button } from '../ui'

interface BulkRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { requested_quantity: number; requested_unit_price?: number; required_by_date?: string; buyer_notes?: string }) => Promise<void>
  productName?: string
  artisanName: string
}

export function BulkRequestModal({ isOpen, onClose, onSubmit, productName, artisanName }: BulkRequestModalProps) {
  const [quantity, setQuantity] = useState<number>(50)
  const [targetPrice, setTargetPrice] = useState<number | ''>('')
  const [requiredDate, setRequiredDate] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (quantity < 10) {
      setError('Minimum bulk order quantity is 10 units.')
      return
    }
    try {
      setIsSubmitting(true)
      setError('')
      await onSubmit({
        requested_quantity: quantity,
        requested_unit_price: targetPrice === '' ? undefined : Number(targetPrice),
        required_by_date: requiredDate || undefined,
        buyer_notes: notes || undefined
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit bulk request')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="w-full mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                    Request Bulk Order Quote
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {productName ? `Requesting quote for ${productName} from ${artisanName}` : `Requesting custom bulk order from ${artisanName}`}
                  </p>
                  
                  {error && (
                    <div className="p-2 mt-4 text-sm text-red-700 bg-red-100 rounded-md">
                      {error}
                    </div>
                  )}

                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Requested Quantity *</label>
                      <input
                        type="number"
                        id="quantity"
                        min="10"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="targetPrice" className="block text-sm font-medium text-gray-700">Target Unit Price (Optional)</label>
                      <input
                        type="number"
                        id="targetPrice"
                        min="1"
                        step="0.01"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(e.target.value ? Number(e.target.value) : '')}
                        placeholder="Expected price per unit"
                      />
                    </div>

                    <div>
                      <label htmlFor="requiredDate" className="block text-sm font-medium text-gray-700">Required By Date (Optional)</label>
                      <input
                        type="date"
                        id="requiredDate"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={requiredDate}
                        onChange={(e) => setRequiredDate(e.target.value)}
                      />
                    </div>

                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Requirements & Notes</label>
                      <textarea
                        id="notes"
                        rows={3}
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="Any specific customizations or packaging requirements?"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
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
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
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
