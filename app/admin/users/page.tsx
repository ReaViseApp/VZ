'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import ConfirmationModal from '@/components/admin/ConfirmationModal'
import toast from 'react-hot-toast'

interface User {
  id: string
  username: string
  email: string | null
  phone: string | null
  role: 'USER' | 'MODERATOR' | 'ADMIN'
  isBanned: boolean
  isSuspended: boolean
  suspendedUntil: string | null
  emailVerified: boolean
  phoneVerified: boolean
  createdAt: string
  _count: {
    contents: number
    editorials: number
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [modalConfig, setModalConfig] = useState<any>(null)
  const [actionUserId, setActionUserId] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [search, roleFilter, statusFilter, page])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        perPage: '20',
        ...(search && { search }),
        ...(roleFilter !== 'ALL' && { role: roleFilter }),
        ...(statusFilter !== 'ALL' && { status: statusFilter }),
      })

      const response = await fetch(`/api/admin/users?${params}`)
      if (!response.ok) throw new Error('Failed to fetch users')
      
      const data = await response.json()
      setUsers(data.users)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) throw new Error('Failed to update role')
      
      toast.success('User role updated successfully')
      fetchUsers()
    } catch (error) {
      console.error('Error updating role:', error)
      toast.error('Failed to update user role')
    }
  }

  const handleBan = async (userId: string, ban: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/ban`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ban, reason: 'Banned by admin' }),
      })

      if (!response.ok) throw new Error('Failed to ban user')
      
      toast.success(ban ? 'User banned successfully' : 'User unbanned successfully')
      fetchUsers()
    } catch (error) {
      console.error('Error banning user:', error)
      toast.error('Failed to ban user')
    }
  }

  const handleSuspend = async (userId: string, suspend: boolean, days: number = 7) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suspend, days, reason: 'Suspended by admin' }),
      })

      if (!response.ok) throw new Error('Failed to suspend user')
      
      toast.success(suspend ? 'User suspended successfully' : 'User unsuspended successfully')
      fetchUsers()
    } catch (error) {
      console.error('Error suspending user:', error)
      toast.error('Failed to suspend user')
    }
  }

  const openConfirmationModal = (config: any) => {
    setModalConfig(config)
    setModalOpen(true)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-gray-600">Manage user accounts, roles, and permissions</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by username or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value)
                setPage(1)
              }}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Roles</option>
              <option value="USER">User</option>
              <option value="MODERATOR">Moderator</option>
              <option value="ADMIN">Admin</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="BANNED">Banned</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
            
            <button
              onClick={() => {
                setSearch('')
                setRoleFilter('ALL')
                setStatusFilter('ALL')
                setPage(1)
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="px-6 py-4">
                        <div className="animate-pulse flex space-x-4">
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                            {user.username[0].toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            <div className="text-sm text-gray-500">{user.email || user.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) => {
                            openConfirmationModal({
                              title: 'Change User Role',
                              message: `Are you sure you want to change ${user.username}'s role to ${e.target.value}?`,
                              onConfirm: () => handleRoleChange(user.id, e.target.value),
                              type: 'warning'
                            })
                          }}
                          className={`
                            px-2 py-1 text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-blue-500
                            ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : ''}
                            ${user.role === 'MODERATOR' ? 'bg-blue-100 text-blue-700' : ''}
                            ${user.role === 'USER' ? 'bg-gray-100 text-gray-700' : ''}
                          `}
                          disabled={user.role === 'ADMIN'}
                        >
                          <option value="USER">User</option>
                          <option value="MODERATOR">Moderator</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.isBanned ? (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                            Banned
                          </span>
                        ) : user.isSuspended ? (
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                            Suspended
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user._count.contents} / {user._count.editorials}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          {!user.isBanned && !user.isSuspended && user.role !== 'ADMIN' && (
                            <>
                              <button
                                onClick={() => {
                                  openConfirmationModal({
                                    title: 'Suspend User',
                                    message: `Are you sure you want to suspend ${user.username} for 7 days?`,
                                    onConfirm: () => handleSuspend(user.id, true, 7),
                                    confirmText: 'Suspend',
                                    type: 'warning'
                                  })
                                }}
                                className="text-yellow-600 hover:text-yellow-900"
                              >
                                Suspend
                              </button>
                              <button
                                onClick={() => {
                                  openConfirmationModal({
                                    title: 'Ban User',
                                    message: `Are you sure you want to permanently ban ${user.username}? This action will prevent them from logging in.`,
                                    onConfirm: () => handleBan(user.id, true),
                                    confirmText: 'Ban User',
                                    type: 'danger'
                                  })
                                }}
                                className="text-red-600 hover:text-red-900"
                              >
                                Ban
                              </button>
                            </>
                          )}
                          {user.isBanned && (
                            <button
                              onClick={() => handleBan(user.id, false)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Unban
                            </button>
                          )}
                          {user.isSuspended && (
                            <button
                              onClick={() => handleSuspend(user.id, false)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Unsuspend
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{page}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {modalConfig && (
        <ConfirmationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          {...modalConfig}
        />
      )}
    </AdminLayout>
  )
}
