'use client'

const MOCK_LISTINGS = [
  { id:'1', name:'Netflix Premium', type:'Subscription', by:'Aryan K.', date:'Mar 15, 2024', status:'active' },
  { id:'2', name:'Delhi → Manali Carpool', type:'Trip', by:'Sanya M.', date:'Mar 14, 2024', status:'active' },
  { id:'3', name:'ChatGPT Plus Share', type:'Subscription', by:'Rohan V.', date:'Mar 13, 2024', status:'flagged' },
  { id:'4', name:'Figma Professional', type:'Subscription', by:'Tanvi N.', date:'Mar 12, 2024', status:'active' },
  { id:'5', name:'Goa Hotel Share', type:'Trip', by:'Dev A.', date:'Mar 11, 2024', status:'active' },
]

const STATUS_STYLES: Record<string, string> = {
  active: 'badge-success',
  flagged: 'badge-danger',
  removed: 'bg-gray-100 text-gray-500',
}

export default function AdminListingsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Manage Listings</h1>
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Listing</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Posted by</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LISTINGS.map(listing => (
                <tr key={listing.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{listing.name}</td>
                  <td className="px-4 py-3"><span className="badge badge-brand">{listing.type}</span></td>
                  <td className="px-4 py-3 text-gray-500">{listing.by}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{listing.date}</td>
                  <td className="px-4 py-3"><span className={`badge ${STATUS_STYLES[listing.status]}`}>{listing.status}</span></td>
                  <td className="px-4 py-3">
                    <button className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}