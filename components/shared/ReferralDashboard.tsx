'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Earning {
  id: string
  earning_type: string
  amount: number
  status: string
  created_at: string
}

interface Withdrawal {
  id: string
  amount: number
  upi_id: string
  status: string
  created_at: string
}

interface Summary {
  totalPending: number
  totalApproved: number
  totalWithdrawn: number
  availableBalance: number
}

export default function ReferralDashboard() {
  const { data: session } = useSession()
  const [refCode, setRefCode] = useState('')
  const [earnings, setEarnings] = useState<Earning[]>([])
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [summary, setSummary] = useState<Summary>({ totalPending: 0, totalApproved: 0, totalWithdrawn: 0, availableBalance: 0 })
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showWithdrawForm, setShowWithdrawForm] = useState(false)
  const [upiId, setUpiId] = useState('')
  const [withdrawing, setWithdrawing] = useState(false)
  const [withdrawMsg, setWithdrawMsg] = useState('')

  useEffect(() => {
    if (session) {
      fetchRefCode()
      fetchEarnings()
    }
  }, [session])

  const fetchRefCode = async () => {
    const res = await fetch('/api/referral/generate')
    const data = await res.json()
    setRefCode(data.ref_code || '')
  }

  const fetchEarnings = async () => {
    setLoading(true)
    const res = await fetch('/api/referral/earnings')
    const data = await res.json()
    setEarnings(data.earnings || [])
    setWithdrawals(data.withdrawals || [])
    setSummary(data.summary || {})
    setLoading(false)
  }

  const copyLink = () => {
    const link = `https://subsharepool.com/?ref=${refCode}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWithdraw = async () => {
    if (!upiId) return
    setWithdrawing(true)
    const res = await fetch('/api/referral/earnings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ upi_id: upiId }),
    })
    const data = await res.json()
    if (res.ok) {
      setWithdrawMsg(`✅ Withdrawal request of ₹${data.amount} submitted! We'll pay within 48 hours.`)
      setShowWithdrawForm(false)
      fetchEarnings()
    } else {
      setWithdrawMsg(`❌ ${data.error}`)
    }
    setWithdrawing(false)
  }

  const referralLink = `https://subsharepool.com/?ref=${refCode}`

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-brand/10 to-brand/5 border border-brand/20 rounded-2xl p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-1">💰 Referral Program</h2>
        <p className="text-sm text-gray-500">
          Earn ₹1 when someone signs up with your link.<br />
          Earn ₹1 more when they post their first listing.
        </p>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <p className="text-xs text-yellow-800 font-medium mb-1">⚠️ Fair Use Policy</p>
        <ul className="text-xs text-yellow-700 space-y-1">
          <li>• India only — international referrals not eligible</li>
          <li>• Genuine listings only — fake posts earn nothing</li>
          <li>• Maximum 10 referrals per month</li>
          <li>• Self-referrals are blocked automatically</li>
          <li>• Fake activity = immediate account suspension + earnings cancelled</li>
          <li>• We manually verify before approving payments</li>
        </ul>
      </div>

      {/* Your referral link */}
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <p className="text-sm font-semibold text-gray-900 mb-3">Your referral link</p>
        <div className="flex gap-2">
          <input
            readOnly
            value={refCode ? referralLink : 'Loading...'}
            className="input flex-1 text-sm bg-gray-50 text-gray-600"
          />
          <button
            onClick={copyLink}
            disabled={!refCode}
            className="btn-primary px-4 text-sm shrink-0"
          >
            {copied ? '✅ Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Share this link on WhatsApp, YouTube, blogs, Instagram — anywhere!
        </p>
      </div>

      {/* Earnings summary */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse h-20" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-yellow-500">₹{summary.totalPending}</p>
            <p className="text-xs text-gray-400 mt-1">Pending</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-500">₹{summary.totalApproved}</p>
            <p className="text-xs text-gray-400 mt-1">Approved</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-brand">₹{summary.availableBalance}</p>
            <p className="text-xs text-gray-400 mt-1">Available</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-700">₹{summary.totalWithdrawn}</p>
            <p className="text-xs text-gray-400 mt-1">Withdrawn</p>
          </div>
        </div>
      )}

      {/* Withdraw button */}
      {summary.availableBalance >= 20 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm font-medium text-green-800 mb-2">
            🎉 You have ₹{summary.availableBalance} available to withdraw!
          </p>
          {!showWithdrawForm ? (
            <button onClick={() => setShowWithdrawForm(true)} className="btn-primary text-sm">
              Request Withdrawal
            </button>
          ) : (
            <div className="flex gap-2 mt-2">
              <input
                className="input flex-1 text-sm"
                placeholder="Enter your UPI ID (e.g. name@upi)"
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
              />
              <button onClick={handleWithdraw} disabled={withdrawing} className="btn-primary text-sm shrink-0">
                {withdrawing ? 'Submitting...' : 'Submit'}
              </button>
              <button onClick={() => setShowWithdrawForm(false)} className="btn-outline text-sm shrink-0">
                Cancel
              </button>
            </div>
          )}
          {withdrawMsg && <p className="text-xs mt-2 text-green-700">{withdrawMsg}</p>}
        </div>
      )}

      {summary.availableBalance > 0 && summary.availableBalance < 20 && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-sm text-gray-600">
            💡 You need ₹{(20 - summary.availableBalance).toFixed(0)} more to withdraw.
            Minimum withdrawal is ₹20.
          </p>
        </div>
      )}

      {/* Earnings history */}
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <p className="text-sm font-semibold text-gray-900 mb-4">Earnings History</p>
        {earnings.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-3xl mb-2">🔗</p>
            <p className="text-sm">No earnings yet</p>
            <p className="text-xs mt-1">Share your referral link to start earning!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {earnings.map(e => (
              <div key={e.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {e.earning_type === 'signup' ? '👤 New signup' : '📦 First listing posted'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(e.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-brand">+₹{e.amount}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    e.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    e.status === 'approved' ? 'bg-green-100 text-green-700' :
                    e.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {e.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Withdrawal history */}
      {withdrawals.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-sm font-semibold text-gray-900 mb-4">Withdrawal History</p>
          <div className="space-y-2">
            {withdrawals.map(w => (
              <div key={w.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">₹{w.amount} → {w.upi_id}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(w.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  w.status === 'requested' ? 'bg-yellow-100 text-yellow-700' :
                  w.status === 'paid' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {w.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <p className="text-sm font-semibold text-gray-900 mb-3">How it works</p>
        <div className="space-y-3">
          {[
            { step: '1', text: 'Copy your referral link above', icon: '🔗' },
            { step: '2', text: 'Share it on WhatsApp, YouTube, blog, Instagram', icon: '📢' },
            { step: '3', text: 'Someone signs up → you earn ₹1', icon: '👤' },
            { step: '4', text: 'They post a listing → you earn ₹1 more', icon: '📦' },
            { step: '5', text: 'Reach ₹20 → request UPI withdrawal', icon: '💸' },
          ].map(item => (
            <div key={item.step} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center shrink-0">
                {item.step}
              </div>
              <span className="text-sm text-gray-600">{item.icon} {item.text}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
