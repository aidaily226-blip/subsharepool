'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface WithdrawalRequest {
  id: string
  amount: number
  upi_id: string
  status: string
  created_at: string
  user_id: string
  users: {
    name: string
    email: string
    country: string
  }
}

interface PendingEarning {
  id: string
  amount: number
  earning_type: string
  status: string
  created_at: string
  referrer_id: string
  users: {
    name: string
    email: string
  }
}

export default function AdminReferralsPage() {
  const { data: session } = useSession()
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([])
  const [earnings, setEarnings] = useState<PendingEarning[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'withdrawals' | 'earnings'>('withdrawals')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/referrals')
    const data = await res.json()
    setWithdrawals(data.withdrawals || [])
    setEarnings(data.earnings || [])
    setLoading(false)
  }

  const handleApproveEarning = async (id: string) => {
    setProcessing(id)
    await fetch('/api/admin/referrals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve_earning', id }),
    })
    fetchData()
    setProcessing(null)
  }

  const handleRejectEarning = async (id: string) => {
    if (!confirm('Reject this earning?')) return
    setProcessing(id)
    await fetch('/api/admin/referrals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject_earning', id }),
    })
    fetchData()
    setProcessing(null)
  }

  const handleMarkPaid = async (id: string, userId: string) => {
    if (!confirm('Mark as paid? Only do this after sending UPI payment!')) return
    setProcessing(id)
    await fetch('/api/admin/referrals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'mark_paid', id, userId }),
    })
    fetchData()
    setProcessing(null)
  }

  const handleRejectWithdrawal = async (id: string) => {
    if (!confirm('Reject this withdrawal request?')) return
    setProcessing(id)
    await fetch('/api/admin/referrals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject_withdrawal', id }),
    })
    fetchData()
    setProcessing(null)
  }

  const userRole = (session?.user as any)?.role
  if (userRole !== 'admin') {
    return <div className="text-center py-16 text-gray-400">Access denied</div>
  }

  const pendingWithdrawals = withdrawals.filter(w => w.status === 'requested')
  const pendingEarnings = earnings.filter(e => e.status === 'pending')

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-2">Referral Admin Panel</h1>
      <p className="text-sm text-gray-400 mb-6">Manage earnings and withdrawal requests</p>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{pendingEarnings.length}</p>
          <p className="text-xs text-gray-500 mt-1">Pending Earnings</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{pendingWithdrawals.length}</p>
          <p className="text-xs text-gray-500 mt-1">Withdrawal Requests</p>
        </div>
        <div className="bg-brand/5 border border-brand/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-brand">
            ₹{pendingWithdrawals.reduce((s, w) => s + w.amount, 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total to Pay</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {withdrawals.filter(w => w.status === 'paid').length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Paid Out</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-100">
        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'withdrawals'
              ? 'border-brand text-brand'
              : 'border-transparent text-gray-400'
          }`}
        >
          💸 Withdrawal Requests
          {pendingWithdrawals.length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {pendingWithdrawals.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('earnings')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'earnings'
              ? 'border-brand text-brand'
              : 'border-transparent text-gray-400'
          }`}
        >
          💰 Pending Earnings
          {pendingEarnings.length > 0 && (
            <span className="ml-2 bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {pendingEarnings.length}
            </span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : activeTab === 'withdrawals' ? (
        <div className="space-y-3">
          {withdrawals.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">💸</p>
              <p>No withdrawal requests yet</p>
            </div>
          ) : (
            withdrawals.map(w => (
              <div key={w.id} className={`bg-white border rounded-xl p-4 ${
                w.status === 'requested' ? 'border-red-200' :
                w.status === 'paid' ? 'border-green-200' :
                'border-gray-100'
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{w.users?.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        w.status === 'requested' ? 'bg-red-100 text-red-700' :
                        w.status === 'paid' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {w.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{w.users?.email}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="bg-gray-50 rounded-lg px-3 py-1.5">
                        <p className="text-xs text-gray-400">UPI ID</p>
                        <p className="text-sm font-mono font-medium text-gray-900">{w.upi_id}</p>
                      </div>
                      <div className="bg-brand/5 rounded-lg px-3 py-1.5">
                        <p className="text-xs text-gray-400">Amount</p>
                        <p className="text-sm font-bold text-brand">₹{w.amount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Requested</p>
                        <p className="text-xs text-gray-600">
                          {new Date(w.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {w.status === 'requested' && (
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => handleMarkPaid(w.id, w.user_id)}
                        disabled={processing === w.id}
                        className="btn-primary text-xs px-4 py-2"
                      >
                        {processing === w.id ? '...' : '✅ Mark Paid'}
                      </button>
                      <button
                        onClick={() => handleRejectWithdrawal(w.id)}
                        disabled={processing === w.id}
                        className="text-xs px-4 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {earnings.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">💰</p>
              <p>No earnings to review</p>
            </div>
          ) : (
            earnings.map(e => (
              <div key={e.id} className={`bg-white border rounded-xl p-4 ${
                e.status === 'pending' ? 'border-yellow-200' :
                e.status === 'approved' ? 'border-green-200' :
                'border-gray-100'
              }`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{e.users?.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        e.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        e.status === 'approved' ? 'bg-green-100 text-green-700' :
                        e.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-500'
                      }`}>
                        {e.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{e.users?.email}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                        {e.earning_type === 'signup' ? '👤 Signup referral' : '📦 First listing'}
                      </span>
                      <span className="text-sm font-bold text-brand">₹{e.amount}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(e.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short'
                        })}
                      </span>
                    </div>
                  </div>

                  {e.status === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleApproveEarning(e.id)}
                        disabled={processing === e.id}
                        className="btn-primary text-xs px-3 py-1.5"
                      >
                        {processing === e.id ? '...' : '✅ Approve'}
                      </button>
                      <button
                        onClick={() => handleRejectEarning(e.id)}
                        disabled={processing === e.id}
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
