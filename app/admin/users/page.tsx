'use client'
const MOCK_USERS = [
  { id: '1', name: 'Aryan Kapoor', email: 'aryan@gmail.com', role: 'user', blocked: false, joined: 'Mar 1, 2025', listings: 4 },
  { id: '2', name: 'Sanya Mehta', email: 'sanya@gmail.com', role: 'user', blocked: false, joined: 'Mar 5, 2025', listings: 2 },
  { id: '3', name: 'Rohan Verma', email: 'rohan@gmail.com', role: 'user', blocked: true, joined: 'Feb 20, 2025', listings: 1 },
  { id: '4', name: 'Admin User', email: 'admin@gmail.com', role: 'admin', blocked: false, joined: 'Jan 10, 2025', listings: 6 },
]

export default function AdminUsersPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Manage Users</h1>
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">User</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Role</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Listings</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Joined</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_USERS.map(user => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${user.role === 'admin' ? 'bg-brand text-white' : 'badge-brand'}`}>{user.role}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.listings}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{user.joined}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${user.blocked ? 'badge-danger' : 'badge-success'}`}>{user.blocked ? 'Blocked' : 'Active'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${user.blocked ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50' : 'border-red-200 text-red-500 hover:bg-red-50'}`}>
                      {user.blocked ? 'Unblock' : 'Block'}
                    </button>
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
