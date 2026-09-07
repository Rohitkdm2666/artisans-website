import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { Card, CardBody } from '@/components/ui/Card'
import { useAuth } from '@/hooks/useAuth'
import { useArtisanProfile } from '@/hooks/useArtisans'
import { useArtisanEnquiries } from '@/hooks/useArtisanEnquiries'
import { useBulkRequests } from '@/hooks/useBulkRequests'
import { useOrders } from '@/hooks/useOrders'
import { MessageCircle, Package, ShoppingBag, ChevronRight, TrendingUp } from 'lucide-react'

export default function ArtisanDashboardPage() {
  const { profile } = useAuth()
  
  // Resolve artisan_profile.id from user_id
  const { profile: artisanProfile } = useArtisanProfile(profile?.id)
  const artisanProfileId = artisanProfile?.id
  
  const { enquiries } = useArtisanEnquiries(artisanProfileId)
  const { requests } = useBulkRequests(artisanProfileId, 'artisan')
  const { orders } = useOrders(artisanProfileId, 'artisan')

  const openEnquiries = enquiries.filter(e => e.status === 'open').length
  const activeRequests = requests.filter(r => ['requested', 'under_review'].includes(r.status)).length
  const confirmedOrders = orders.filter(o => o.status === 'confirmed').length

  const stats = [
    {
      label: 'New Enquiries',
      value: openEnquiries,
      icon: <MessageCircle className="w-8 h-8 text-blue-600" />,
      href: '/artisan/enquiries',
      description: 'Customer messages awaiting response',
      color: 'bg-blue-50 border-blue-100'
    },
    {
      label: 'Active Bulk Requests',
      value: activeRequests,
      icon: <Package className="w-8 h-8 text-amber-600" />,
      href: '/artisan/bulk-requests',
      description: 'B2B sourcing requests from businesses',
      color: 'bg-amber-50 border-amber-100'
    },
    {
      label: 'Confirmed Orders',
      value: confirmedOrders,
      icon: <ShoppingBag className="w-8 h-8 text-green-600" />,
      href: '/artisan/orders',
      description: 'Orders ready for production',
      color: 'bg-green-50 border-green-100'
    },
  ]

  return (
    <div className="bg-[#fdf8ed] min-h-screen py-16">
      <Container>
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-maroon-700" size={24} />
            <span className="text-sm font-medium uppercase tracking-widest text-maroon-700">Artisan Portal</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-gray-900">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Artisan'}
          </h1>
          <p className="text-gray-600 mt-2 font-sans">Here's an overview of your current enquiries and orders.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => (
            <Link key={stat.label} to={stat.href}>
              <Card className={`border ${stat.color} hover:shadow-md transition-shadow cursor-pointer`}>
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-1">{stat.label}</p>
                      <p className="text-4xl font-bold text-gray-900 font-serif">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
                    </div>
                    <div className="flex-shrink-0">{stat.icon}</div>
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-xs font-medium text-maroon-700 uppercase tracking-wider">
                    View All <ChevronRight size={12} />
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/artisan/enquiries" className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-maroon-700 transition-colors">
            <div className="flex items-center gap-3">
              <MessageCircle size={20} className="text-maroon-700" />
              <span className="font-medium text-gray-900">Customer Enquiries</span>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </Link>
          <Link to="/artisan/bulk-requests" className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-maroon-700 transition-colors">
            <div className="flex items-center gap-3">
              <Package size={20} className="text-maroon-700" />
              <span className="font-medium text-gray-900">Bulk Requests</span>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </Link>
          <Link to="/artisan/orders" className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-maroon-700 transition-colors">
            <div className="flex items-center gap-3">
              <ShoppingBag size={20} className="text-maroon-700" />
              <span className="font-medium text-gray-900">Confirmed Orders</span>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </Link>
        </div>
      </Container>
    </div>
  )
}
