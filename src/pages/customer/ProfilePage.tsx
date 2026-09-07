import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { useCustomerEnquiries } from '@/hooks/useCustomerEnquiries'
import { MessageCircle, Package } from 'lucide-react'
import type { CustomerEnquiry } from '@/types'

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth()
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [activeTab, setActiveTab] = useState<'profile' | 'enquiries'>('profile')
  const { enquiries, isLoading: enquiriesLoading } = useCustomerEnquiries(
    profile?.role === 'customer' ? user?.id : undefined
  )

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setMessage(null)

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      await refreshProfile()
      setMessage({ type: 'success', text: 'Profile updated successfully.' })
    }
    
    setLoading(false)
  }

  if (!profile) return null

  return (
    <div className="bg-[#fdf8ed] min-h-screen py-16">
      <Container>
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600 mb-8 font-sans">Manage your personal information and account settings.</p>

          {/* Role-based Tabs */}
          {profile.role === 'customer' && (
            <div className="flex gap-1 mb-8 border-b border-gray-200">
              <button
                className={`px-4 py-2 text-sm font-medium uppercase tracking-wider transition-colors ${activeTab === 'profile' ? 'border-b-2 border-maroon-700 text-maroon-700' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('profile')}
              >
                Account
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium uppercase tracking-wider transition-colors flex items-center gap-1 ${activeTab === 'enquiries' ? 'border-b-2 border-maroon-700 text-maroon-700' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('enquiries')}
              >
                <MessageCircle size={14} />
                My Enquiries
                {enquiries.length > 0 && (
                  <span className="ml-1 bg-maroon-700 text-white text-xs rounded-full px-1.5 py-0.5">
                    {enquiries.length}
                  </span>
                )}
              </button>
            </div>
          )}

          {activeTab === 'profile' && (
            <>
              {message && (
                <div
                  className={`p-4 mb-6 rounded text-sm ${
                    message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <Card elevated>
                <CardBody>
                  <form onSubmit={handleSave} className="flex flex-col gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <div className="capitalize text-gray-900 bg-gray-50 border border-gray-200 px-3 py-2 rounded-md font-sans">
                        {profile.role}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Your role determines your access permissions.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <div className="text-gray-900 bg-gray-50 border border-gray-200 px-3 py-2 rounded-md font-sans">
                        {user?.email}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Email addresses cannot be changed here.</p>
                    </div>

                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-maroon-700 focus:border-maroon-700 font-sans"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                      <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </CardBody>
              </Card>
            </>
          )}

          {activeTab === 'enquiries' && profile.role === 'customer' && (
            <div className="space-y-4">
              {enquiriesLoading && (
                <div className="text-center py-12 text-gray-500">Loading your enquiries...</div>
              )}

              {!enquiriesLoading && enquiries.length === 0 && (
                <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                  <MessageCircle size={40} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="font-serif text-xl text-gray-700 mb-2">Your conversations with artisans will appear here.</h3>
                  <p className="text-gray-500 text-sm mb-6">Browse products and contact artisans to get started.</p>
                  <Link to="/products">
                    <Button variant="outline">Browse Products</Button>
                  </Link>
                </div>
              )}

              {!enquiriesLoading && enquiries.map((enquiry: CustomerEnquiry & { artisan_profile?: { display_name: string }; product?: { name: string } }) => (
                <Card key={enquiry.id}>
                  <CardBody>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <StatusBadge status={enquiry.status} />
                          <span className="text-xs text-gray-400">{new Date(enquiry.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="font-medium text-gray-900 truncate">{enquiry.subject || 'General Enquiry'}</p>
                        {(enquiry as any).artisan_profile && (
                          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                            <Package size={12} />
                            {(enquiry as any).artisan_profile.display_name}
                            {(enquiry as any).product && ` · ${(enquiry as any).product.name}`}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{enquiry.message}</p>
                        {enquiry.artisan_response && (
                          <div className="mt-3 bg-amber-50 border border-amber-200 rounded p-3">
                            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Artisan Response</p>
                            <p className="text-sm text-gray-700">{enquiry.artisan_response}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
