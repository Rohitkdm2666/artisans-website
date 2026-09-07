import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card, CardBody } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { useBusinessProfile } from '@/hooks/useBusinessProfile'
import { useBulkRequests } from '@/hooks/useBulkRequests'
import { useBulkOrderMessages } from '@/hooks/useBulkOrderMessages'
import { confirmBulkOrder } from '@/services/bulkOrders'
import { MessageThread } from '@/components/ui/MessageThread'
import { FileText, X, CheckCircle } from 'lucide-react'
import type { BulkOrderRequest } from '@/types'

export default function BusinessRequestsPage() {
  const { profile } = useAuth()
  const { profile: businessProfile } = useBusinessProfile(profile?.id)
  const businessProfileId = businessProfile?.id

  const { requests, isLoading, refresh } = useBulkRequests(businessProfileId, 'business')
  const [selected, setSelected] = useState<BulkOrderRequest | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [confirming, setConfirming] = useState(false)

  const { messages, sendMessage } = useBulkOrderMessages(selected?.id)

  const filtered = filterStatus === 'all' ? requests : requests.filter(r => r.status === filterStatus)

  const handleConfirmOrder = async () => {
    if (!selected) return
    try {
      setConfirming(true)
      await confirmBulkOrder(selected.id)
      await refresh()
      setSelected(null)
      alert('Order confirmed! You can view it in Business → Orders.')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to confirm order')
    } finally {
      setConfirming(false)
    }
  }

  return (
    <div className="bg-[#fdf8ed] min-h-screen py-16">
      <Container>
        <SectionHeading title="B2B Requests" subtitle="Track your bulk sourcing requests and negotiate with artisans." className="mb-8" align="left" ornament={false} />

        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'requested', 'under_review', 'accepted', 'confirmed', 'rejected'].map(s => (
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
            <FileText size={40} className="mx-auto mb-4 text-gray-300" />
            <h3 className="font-serif text-xl text-gray-700 mb-2">No Requests Yet</h3>
            <p className="text-gray-500 text-sm mb-6">Browse products and submit bulk sourcing requests to artisans.</p>
            <Link to="/business/products"><Button variant="outline">Browse Products</Button></Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* List */}
          <div className="lg:col-span-2 space-y-4">
            {!isLoading && filtered.map(req => (
              <Card
                key={req.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${selected?.id === req.id ? 'ring-2 ring-maroon-700' : ''}`}
                onClick={() => setSelected(req)}
              >
                <CardBody>
                  <StatusBadge status={req.status} />
                  <p className="font-medium text-gray-900 mt-1">{(req as any).product?.name || 'Custom Request'}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Artisan: {(req as any).artisan_profile?.display_name || '—'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Qty: <strong>{req.requested_quantity}</strong>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(req.requested_at).toLocaleDateString()}</p>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Detail panel */}
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
                  <div><span className="text-gray-500">Product</span><p className="font-medium">{(selected as any).product?.name || '—'}</p></div>
                  <div><span className="text-gray-500">Artisan</span><p className="font-medium">{(selected as any).artisan_profile?.display_name || '—'}</p></div>
                  <div><span className="text-gray-500">Requested Qty</span><p className="font-medium">{selected.requested_quantity}</p></div>
                  <div><span className="text-gray-500">Target Price</span><p className="font-medium">{selected.requested_unit_price ? `₹${selected.requested_unit_price}` : '—'}</p></div>
                  {selected.required_by_date && <div><span className="text-gray-500">Required By</span><p className="font-medium">{selected.required_by_date}</p></div>}
                  {selected.buyer_notes && <div className="col-span-2"><span className="text-gray-500">Your Notes</span><p className="text-gray-700 mt-1">{selected.buyer_notes}</p></div>}
                </div>

                {/* Artisan's accepted terms */}
                {selected.status === 'accepted' && (
                  <div className="p-4 border-t bg-green-50">
                    <p className="text-xs font-medium uppercase tracking-wider text-green-700 mb-3">✓ Artisan Has Accepted — Final Terms</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-gray-500">Final Qty</span><p className="font-semibold">{selected.final_quantity || '—'}</p></div>
                      <div><span className="text-gray-500">Final Price</span><p className="font-semibold">{selected.final_unit_price ? `₹${selected.final_unit_price}/unit` : '—'}</p></div>
                      {selected.final_requirements && <div className="col-span-2"><span className="text-gray-500">Final Specifications</span><p className="text-gray-700 mt-1">{selected.final_requirements}</p></div>}
                      {selected.artisan_notes && <div className="col-span-2"><span className="text-gray-500">Artisan Notes</span><p className="text-gray-700 mt-1">{selected.artisan_notes}</p></div>}
                    </div>
                    <Button
                      className="mt-4 flex items-center gap-2"
                      onClick={handleConfirmOrder}
                      disabled={confirming}
                    >
                      <CheckCircle size={16} />
                      {confirming ? 'Confirming…' : 'Confirm & Place Order'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Message Thread */}
              <MessageThread
                messages={messages}
                currentUserId={profile?.id || ''}
                onSendMessage={async (text) => { await sendMessage(profile?.id || '', text); }}
              />
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
