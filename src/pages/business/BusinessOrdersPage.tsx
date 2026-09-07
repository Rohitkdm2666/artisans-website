import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card, CardBody } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuth } from '@/hooks/useAuth'
import { useBusinessProfile } from '@/hooks/useBusinessProfile'
import { useOrders } from '@/hooks/useOrders'
import { ShoppingBag, ChevronRight } from 'lucide-react'

export default function BusinessOrdersPage() {
  const { profile } = useAuth()
  const { profile: businessProfile } = useBusinessProfile(profile?.id)
  const businessProfileId = businessProfile?.id

  const { orders, isLoading } = useOrders(businessProfileId, 'business')

  return (
    <div className="bg-[#fdf8ed] min-h-screen py-16">
      <Container>
        <SectionHeading title="Confirmed Orders" subtitle="View all confirmed bulk orders in production." className="mb-8" align="left" ornament={false} />

        {isLoading && <p className="text-gray-500 text-center py-12">Loading orders…</p>}

        {!isLoading && orders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <ShoppingBag size={40} className="mx-auto mb-4 text-gray-300" />
            <h3 className="font-serif text-xl text-gray-700 mb-2">No Orders Yet</h3>
            <p className="text-gray-500 text-sm">Confirmed bulk orders will appear here once an artisan accepts and you confirm.</p>
          </div>
        )}

        <div className="space-y-4">
          {!isLoading && orders.map(order => (
            <Card key={order.id}>
              <CardBody>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <StatusBadge status={order.status} />
                      <span className="text-xs text-gray-400">
                        Confirmed {new Date(order.confirmed_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-medium text-gray-900">
                      {(order as any).bulk_order_request?.product?.name || 'Custom Order'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Artisan: {(order as any).artisan_profile?.display_name || '—'}
                    </p>
                    {(order as any).bulk_order_request && (
                      <p className="text-sm text-gray-600 mt-1">
                        Qty: <strong>{(order as any).bulk_order_request.final_quantity || '—'}</strong>
                        {(order as any).bulk_order_request.final_unit_price ? ` · ₹${(order as any).bulk_order_request.final_unit_price}/unit` : ''}
                      </p>
                    )}
                  </div>
                  <Link
                    to={`/business/requests/${order.bulk_order_request_id}`}
                    className="text-xs text-maroon-700 uppercase tracking-wider font-medium hover:underline flex items-center gap-1 flex-shrink-0"
                  >
                    View Request <ChevronRight size={12} />
                  </Link>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  )
}
