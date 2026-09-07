import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuth } from '@/hooks/useAuth'
import { useArtisanProfile } from '@/hooks/useArtisans'
import { useArtisanEnquiries } from '@/hooks/useArtisanEnquiries'
import { MessageCircle, ChevronLeft, Send, X } from 'lucide-react'
import type { CustomerEnquiry } from '@/types'

export default function ArtisanEnquiriesPage() {
  const { profile } = useAuth()
  const { profile: artisanProfile } = useArtisanProfile(profile?.id)
  const artisanProfileId = artisanProfile?.id

  const { enquiries, isLoading, respond } = useArtisanEnquiries(artisanProfileId)
  const [selected, setSelected] = useState<CustomerEnquiry | null>(null)
  const [responseText, setResponseText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filtered = filterStatus === 'all' ? enquiries : enquiries.filter(e => e.status === filterStatus)

  const handleRespond = async () => {
    if (!selected || !responseText.trim()) return
    try {
      setSubmitting(true)
      await respond(selected.id, responseText)
      setResponseText('')
      setSelected(null)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-[#fdf8ed] min-h-screen py-16">
      <Container>
        <Link to="/artisan" className="inline-flex items-center gap-2 mb-8 text-sm text-gray-500 hover:text-maroon-700 uppercase tracking-wider">
          <ChevronLeft size={14} /> Back to Dashboard
        </Link>
        <SectionHeading title="Customer Enquiries" subtitle="Review and respond to customer messages." className="mb-8" align="left" ornament={false} />

        <div className="flex gap-2 mb-6">
          {['all', 'open', 'responded', 'closed'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider rounded-full transition-colors ${filterStatus === s ? 'bg-maroon-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-maroon-700'}`}
            >
              {s}
            </button>
          ))}
        </div>

        {isLoading && <p className="text-gray-500 text-center py-12">Loading enquiries…</p>}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <MessageCircle size={40} className="mx-auto mb-4 text-gray-300" />
            <h3 className="font-serif text-xl text-gray-700 mb-2">No Enquiries</h3>
            <p className="text-gray-500 text-sm">Customer enquiries will appear here.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {!isLoading && filtered.map(enquiry => (
              <Card
                key={enquiry.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${selected?.id === enquiry.id ? 'ring-2 ring-maroon-700' : ''}`}
                onClick={() => { setSelected(enquiry); setResponseText('') }}
              >
                <CardBody>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={enquiry.status} />
                        <span className="text-xs text-gray-400">{new Date(enquiry.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="font-medium text-gray-900 truncate">{enquiry.subject || 'General Enquiry'}</p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{enquiry.message}</p>
                    </div>
                    <ChevronLeft size={16} className="text-gray-400 rotate-180 flex-shrink-0 mt-1" />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Response Panel */}
          {selected && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-fit sticky top-4">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="font-serif text-lg text-gray-900">Enquiry Detail</h3>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1">Subject</p>
                  <p className="text-gray-900">{selected.subject || 'General Enquiry'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1">Message</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{selected.message}</p>
                </div>
                {selected.artisan_response && (
                  <div className="bg-amber-50 border border-amber-200 rounded p-3">
                    <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-1">Your Response</p>
                    <p className="text-sm text-gray-700">{selected.artisan_response}</p>
                  </div>
                )}
                {selected.status !== 'closed' && (
                  <div className="border-t border-gray-100 pt-4">
                    <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">
                      {selected.artisan_response ? 'Update Response' : 'Write Response'}
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-maroon-700 focus:border-maroon-700"
                      placeholder="Type your response to the customer..."
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                    />
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        disabled={submitting || !responseText.trim()}
                        onClick={handleRespond}
                        className="flex items-center gap-1"
                      >
                        <Send size={12} /> Send Response
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
