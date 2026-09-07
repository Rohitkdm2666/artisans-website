import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { MessageThread } from '@/components/ui/MessageThread'
import { useAuth } from '@/hooks/useAuth'
import { useArtisanProfile } from '@/hooks/useArtisans'
import { useBulkRequests } from '@/hooks/useBulkRequests'
import { useBulkOrderMessages } from '@/hooks/useBulkOrderMessages'
import { updateBulkRequest } from '@/services/bulkOrders'
import { Package, ChevronLeft, X } from 'lucide-react'
import type { BulkOrderRequest } from '@/types'

export default function ArtisanBulkRequestsPage() {
  const { profile: userProfile } = useAuth()
  const { profile: artisanProfile } = useArtisanProfile(userProfile?.id)
  const artisanProfileId = artisanProfile?.id

  const { requests, isLoading, refresh } = useBulkRequests(artisanProfileId, 'artisan')
  const [selected, setSelected] = useState<BulkOrderRequest | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [finalQty, setFinalQty] = useState('')
  const [finalPrice, setFinalPrice] = useState('')
  const [finalReqs, setFinalReqs] = useState('')
  const [artisanNotes, setArtisanNotes] = useState('')
  const [updating, setUpdating] = useState(false)

  const { messages, sendMessage } = useBulkOrderMessages(selected?.id)

  const filtered = filterStatus === 'all' ? requests : requests.filter(r => r.status === filterStatus)

  const handleUpdateStatus = async (status: BulkOrderRequest['status']) => {
    if (!selected) return
    try {
      setUpdating(true)
      await updateBulkRequest(selected.id, {
        status,
        final_quantity: finalQty ? Number(finalQty) : selected.final_quantity,
        final_unit_price: finalPrice ? Number(finalPrice) : selected.final_unit_price,
        final_requirements: finalReqs || selected.final_requirements,
        artisan_notes: artisanNotes || selected.artisan_notes
      })
      await refresh()
      setSelected(null)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="bg-[#fdf8ed] min-h-screen py-16">
      <Container>
        <Link to="/artisan" className="inline-flex items-center gap-2 mb-8 text-sm text-gray-500 hover:text-maroon-700 uppercase tracking-wider">
          <ChevronLeft size={14} /> Back to Dashboard
        </Link>
        <SectionHeading title="Bulk Order Requests" subtitle="Review, negotiate, and accept B2B sourcing requests." className="mb-8" align="left" ornament={false} />

        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'requested', 'under_review', 'accepted', 'rejected', 'confirmed'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider rounded-full transition-colors ${filterStatus === s ? 'bg-maroon-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-maroon-700'}`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {isLoading && <p className="text-gray-500 text-center py-12">Loading requests…</p>}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <Package size={40} className="mx-auto mb-4 text-gray-300" />
            <h3 className="font-serif text-xl text-gray-700 mb-2">No Bulk Requests</h3>
            <p className="text-gray-500 text-sm">Business bulk order requests will appear here.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Request list - left */}
          <div className="lg:col-span-2 space-y-4">
            {!isLoading && filtered.map(req => (
              <Card
                key={req.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${selected?.id === req.id ? 'ring-2 ring-maroon-700' : ''}`}
                onClick={() => { setSelected(req); setFinalQty(''); setFinalPrice(''); setFinalReqs(''); setArtisanNotes('') }}
              >
                <CardBody>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <StatusBadge status={req.status} />
                      <p className="font-medium text-gray-900 mt-1">{(req as any).product?.name || 'Custom Request'}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Qty: <strong>{req.requested_quantity}</strong>
                        {req.requested_unit_price ? ` · ₹${req.requested_unit_price}/unit` : ''}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">From: {(req as any).business_profile?.business_name || 'Business'}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Detail panel - right */}
          {selected && (
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <h3 className="font-serif text-lg text-gray-900">Request Details</h3>
                  <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                    <X size={18} />
                  </button>
                </div>
                <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">Requested Qty</span><p className="font-medium text-gray-900">{selected.requested_quantity}</p></div>
                  <div><span className="text-gray-500">Target Price</span><p className="font-medium text-gray-900">{selected.requested_unit_price ? `₹${selected.requested_unit_price}` : 'Not specified'}</p></div>
                  <div><span className="text-gray-500">Required By</span><p className="font-medium text-gray-900">{selected.required_by_date || 'Flexible'}</p></div>
                  <div><span className="text-gray-500">Status</span><StatusBadge status={selected.status} /></div>
                  {selected.buyer_notes && <div className="col-span-2"><span className="text-gray-500">Buyer Notes</span><p className="text-gray-700 mt-1">{selected.buyer_notes}</p></div>}
                </div>

                {/* Negotiation form */}
                {['requested', 'under_review'].includes(selected.status) && (
                  <div className="p-4 border-t border-gray-100 space-y-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Final Terms (fill to accept)</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Final Quantity</label>
                        <input type="number" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm" value={finalQty} onChange={e => setFinalQty(e.target.value)} placeholder={String(selected.requested_quantity)} />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Final Unit Price (₹)</label>
                        <input type="number" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm" value={finalPrice} onChange={e => setFinalPrice(e.target.value)} placeholder={selected.requested_unit_price ? String(selected.requested_unit_price) : 'Set price'} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Final Requirements</label>
                      <textarea rows={2} className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm" value={finalReqs} onChange={e => setFinalReqs(e.target.value)} placeholder="Any final specifications..." />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Your Notes</label>
                      <textarea rows={2} className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm" value={artisanNotes} onChange={e => setArtisanNotes(e.target.value)} placeholder="Notes for the business buyer..." />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button size="sm" onClick={() => handleUpdateStatus('under_review')} disabled={updating} variant="outline">Mark Under Review</Button>
                      <Button size="sm" onClick={() => handleUpdateStatus('accepted')} disabled={updating}>Accept Quote</Button>
                      <Button size="sm" onClick={() => handleUpdateStatus('rejected')} disabled={updating} variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">Reject</Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Thread */}
              <MessageThread
                messages={messages}
                currentUserId={userProfile?.id || ''}
                onSendMessage={async (text) => { await sendMessage(userProfile?.id || '', text); }}
              />
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
