import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { Card, CardBody } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { useBusinessProfile } from '@/hooks/useBusinessProfile'
import { useBulkRequests } from '@/hooks/useBulkRequests'
import { useBulkOrderMessages } from '@/hooks/useBulkOrderMessages'
import { confirmBulkOrder } from '@/services/bulkOrders'
import { MessageThread } from '@/components/ui/MessageThread'
import { FileText, X, CheckCircle, Package, ArrowRight, Clock, Box } from 'lucide-react'
import { getProductImageUrl } from '@/lib/storage'
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
    <div className="bg-[#fcfaf8] h-[calc(100vh-64px)] overflow-hidden flex flex-col py-6 lg:py-8">
      <Container className="flex flex-col h-full">
        <div className="mb-6 shrink-0">
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-sm text-gray-500 mr-2 font-medium uppercase tracking-wider hidden sm:block">Filter:</span>
            {['all', 'requested', 'under_review', 'accepted', 'confirmed', 'rejected'].map(s => (
              <button
                key={s}
                onClick={() => {
                  setFilterStatus(s)
                  setSelected(null)
                }}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all duration-200 ${
                  filterStatus === s 
                    ? 'bg-maroon-800 text-white shadow-sm' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-maroon-700 hover:text-maroon-800'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-maroon-800 opacity-60">
            <Package size={40} className="animate-pulse mb-4" />
            <p className="font-sans text-sm tracking-widest uppercase">Loading requests...</p>
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="flex flex-col justify-center h-full text-center py-10">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 max-w-2xl mx-auto w-full">
              <Box size={48} className="mx-auto mb-5 text-gray-300" strokeWidth={1} />
              <h3 className="font-serif text-2xl text-gray-800 mb-3">No requests found</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                {filterStatus === 'all' 
                  ? "You haven't submitted any bulk sourcing requests yet. Browse the artisan catalog to get started."
                  : `You don't have any requests with the status "${filterStatus.replace('_', ' ')}".`}
              </p>
              {filterStatus === 'all' && (
                <Link to="/business/products">
                  <Button className="px-8 shadow-md hover:shadow-lg transition-shadow">
                    Browse Products <ArrowRight size={16} className="ml-2 inline" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-grow min-h-0 overflow-hidden">
            
            {/* List Column */}
            <div className={`flex-col gap-4 overflow-y-auto pr-2 pb-6 h-full ${selected ? 'hidden lg:flex lg:col-span-5' : 'flex w-full lg:col-span-5'}`}>
              {filtered.map(req => (
                <Card
                  key={req.id}
                  className={`cursor-pointer transition-all duration-200 border-l-4 shrink-0 ${
                    selected?.id === req.id 
                      ? 'border-l-maroon-700 shadow-md translate-x-1 bg-maroon-50/30' 
                      : 'border-l-transparent hover:shadow-md hover:border-l-maroon-300 bg-white'
                  }`}
                  onClick={() => setSelected(req)}
                >
                  <CardBody className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <StatusBadge status={req.status} />
                      <span className="text-xs text-gray-400 font-sans tracking-wide flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(req.requested_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-start gap-3 mb-3">
                      {(() => {
                        const product = (req as any).product;
                        const images = product?.product_images || [];
                        const primaryImage = images.find((img: any) => img.is_primary) || images[0];
                        const imageUrl = primaryImage ? getProductImageUrl(primaryImage.thumbnail_path || primaryImage.original_path) : undefined;
                        
                        return imageUrl ? (
                          <img src={imageUrl} alt={product.name} className="w-12 h-12 rounded object-cover border border-gray-200 shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded bg-gray-50 border border-gray-100 shrink-0 flex items-center justify-center text-gray-400">
                            <Package size={20} />
                          </div>
                        );
                      })()}
                      <h4 className="font-serif text-lg text-gray-900 leading-tight">
                        {(req as any).product?.name || 'Custom Sourcing Request'}
                      </h4>
                    </div>
                    
                    <div className="bg-gray-50 rounded p-3 text-sm font-sans space-y-2 border border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs uppercase tracking-wider">Artisan</span>
                        <span className="font-medium text-gray-800 text-right">{(req as any).artisan_profile?.display_name || '—'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs uppercase tracking-wider">Requested Qty</span>
                        <span className="font-medium text-maroon-800">{req.requested_quantity} units</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            {/* Empty State / Detail Panel Column */}
            {selected ? (
              <div className="lg:col-span-7 space-y-6 overflow-y-auto h-full pr-2 pb-10">
                {/* Back button for mobile */}
                <button 
                  className="lg:hidden flex items-center gap-2 text-maroon-700 mb-2 font-medium text-sm transition-colors hover:text-maroon-800"
                  onClick={() => setSelected(null)}
                >
                  <ArrowRight size={16} className="rotate-180" /> Back to Requests
                </button>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden shrink-0">
                  <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-xl text-gray-900">Request Details</h3>
                      <p className="text-xs text-gray-500 font-mono mt-1">ID: {selected.id.split('-')[0]}</p>
                    </div>
                    <button 
                      onClick={() => setSelected(null)} 
                      className="hidden lg:flex text-gray-400 hover:text-gray-700 hover:bg-gray-200 p-2 rounded-full transition-colors"
                      aria-label="Close details"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="col-span-2 md:col-span-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">Product</span>
                      <p className="font-serif text-xl text-gray-800">{(selected as any).product?.name || 'Custom Request'}</p>
                    </div>
                    
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">Artisan</span>
                      <p className="font-medium text-gray-800">{(selected as any).artisan_profile?.display_name || '—'}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">Requested Qty</span>
                      <p className="font-medium text-gray-800">{selected.requested_quantity} units</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">Target Price</span>
                      <p className="font-medium text-gray-800">{selected.requested_unit_price ? `₹${selected.requested_unit_price}` : '—'}</p>
                    </div>
                    
                    {selected.required_by_date && (
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">Required By</span>
                        <p className="font-medium text-gray-800">{new Date(selected.required_by_date).toLocaleDateString()}</p>
                      </div>
                    )}
                    
                    {selected.buyer_notes && (
                      <div className="col-span-2 md:col-span-3 bg-gray-50 p-4 rounded-md border border-gray-100">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 block mb-2">Your Notes</span>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{selected.buyer_notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Artisan's accepted terms */}
                  {selected.status === 'accepted' && (
                    <div className="p-6 border-t border-green-100 bg-green-50/50">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle size={20} className="text-green-600" />
                        <h4 className="font-serif text-lg text-green-900">Artisan Accepted Terms</h4>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-6 bg-white p-4 rounded-md border border-green-100 shadow-sm">
                        <div>
                          <span className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Final Quantity</span>
                          <p className="font-semibold text-gray-900">{selected.final_quantity || '—'} units</p>
                        </div>
                        <div>
                          <span className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Final Unit Price</span>
                          <p className="font-semibold text-green-700">{selected.final_unit_price ? `₹${selected.final_unit_price}` : '—'}</p>
                        </div>
                        {selected.final_requirements && (
                          <div className="col-span-2 pt-2 border-t border-gray-100 mt-2">
                            <span className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Final Specifications</span>
                            <p className="text-gray-700">{selected.final_requirements}</p>
                          </div>
                        )}
                        {selected.artisan_notes && (
                          <div className="col-span-2 pt-2 border-t border-gray-100 mt-2">
                            <span className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Artisan Notes</span>
                            <p className="text-gray-700 italic">"{selected.artisan_notes}"</p>
                          </div>
                        )}
                      </div>
                      
                      <Button
                        className="w-full flex justify-center items-center gap-2 shadow-md hover:shadow-lg"
                        onClick={handleConfirmOrder}
                        disabled={confirming}
                      >
                        <CheckCircle size={18} />
                        {confirming ? 'Confirming Order...' : 'Confirm & Place Order'}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Message Thread */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden shrink-0">
                  <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                    <h3 className="font-serif text-lg text-gray-900">Negotiation Chat</h3>
                  </div>
                  <div className="p-2">
                    <MessageThread
                      messages={messages}
                      currentUserId={profile?.id || ''}
                      onSendMessage={async (text) => { await sendMessage(profile?.id || '', text); }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex lg:col-span-7 flex-col items-center justify-center h-full px-10 text-center bg-white/60 rounded-xl border-2 border-dashed border-gray-200">
                <FileText size={56} className="text-gray-300 mb-6" strokeWidth={1} />
                <h3 className="text-2xl font-serif text-gray-700 mb-3">Select a Request</h3>
                <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                  Choose a bulk sourcing request from the list to view its details, negotiate terms with the artisan, or confirm your final order.
                </p>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  )
}
