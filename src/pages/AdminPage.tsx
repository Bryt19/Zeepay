import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { User, Transaction } from '../lib/supabase'
import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Shield,
  BarChart3,
  Search,
  Download,
  Eye,
  Edit,
  X,
  Check,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  UserPlus,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  LogOut,
  AlertTriangle,
} from 'lucide-react'
import { format, subDays, startOfDay } from 'date-fns'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'transactions' | 'analytics'>('overview')
  const [users, setUsers] = useState<User[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [userStatusFilter, setUserStatusFilter] = useState<string>('all')
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [editRole, setEditRole] = useState<'admin' | 'user'>('user')
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)

  // Statistics
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    completedTransactions: 0,
    pendingTransactions: 0,
    failedTransactions: 0,
    todayTransactions: 0,
    todayRevenue: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      console.log('Loading admin data...')
      
      // Load users from database
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (usersError) {
        console.error('Error loading users:', usersError)
        console.error('Error details:', JSON.stringify(usersError, null, 2))
        alert(`Error loading users: ${usersError.message}. Check console for details.`)
        setUsers([])
      } else {
        console.log('Users loaded:', usersData?.length || 0)
        setUsers(usersData || [])
      }

      // Load transactions from database - fetch all transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })

      if (transactionsError) {
        console.error('Error loading transactions:', transactionsError)
        console.error('Error details:', JSON.stringify(transactionsError, null, 2))
        alert(`Error loading transactions: ${transactionsError.message}. Check console for details.`)
        setTransactions([])
      } else {
        console.log('Transactions loaded:', transactionsData?.length || 0)
        setTransactions(transactionsData || [])
      }

      // Calculate statistics from database data
      calculateStats(usersData || [], transactionsData || [])
    } catch (error) {
      console.error('Error loading data:', error)
      alert(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setUsers([])
      setTransactions([])
      calculateStats([], [])
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (usersList: User[], transactionsList: Transaction[]) => {
    const activeUsers = usersList.filter(u => u.is_active).length
    const completed = transactionsList.filter(t => t.status === 'completed').length
    const pending = transactionsList.filter(t => t.status === 'pending').length
    const failed = transactionsList.filter(t => t.status === 'failed').length
    const totalRevenue = transactionsList
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + (t.amount || 0), 0)
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayTransactions = transactionsList.filter(t => new Date(t.created_at) >= today)
    const todayRevenue = todayTransactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + (t.amount || 0), 0)

    setStats({
      totalUsers: usersList.length,
      activeUsers,
      totalTransactions: transactionsList.length,
      totalRevenue,
      completedTransactions: completed,
      pendingTransactions: pending,
      failedTransactions: failed,
      todayTransactions: todayTransactions.length,
      todayRevenue,
    })
  }

  // Prepare chart data
  const getDailyTransactionData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i)
      return {
        date: format(date, 'MMM dd'),
        fullDate: startOfDay(date),
        completed: 0,
        pending: 0,
        failed: 0,
        revenue: 0,
      }
    })

    transactions.forEach(tx => {
      const txDate = startOfDay(new Date(tx.created_at))
      const dayData = last7Days.find(d => d.fullDate.getTime() === txDate.getTime())
      if (dayData) {
        if (tx.status === 'completed') {
          dayData.completed++
          dayData.revenue += tx.amount || 0
        } else if (tx.status === 'pending') {
          dayData.pending++
        } else if (tx.status === 'failed') {
          dayData.failed++
        }
      }
    })

    return last7Days.map(({ fullDate, ...rest }) => rest)
  }

  const getChannelData = () => {
    const channelMap = new Map<string, { count: number; revenue: number }>()
    
    transactions.forEach(tx => {
      const channel = tx.channel || 'Unknown'
      if (!channelMap.has(channel)) {
        channelMap.set(channel, { count: 0, revenue: 0 })
      }
      const data = channelMap.get(channel)!
      data.count++
      if (tx.status === 'completed') {
        data.revenue += tx.amount || 0
      }
    })

    return Array.from(channelMap.entries()).map(([name, data]) => ({
      name,
      transactions: data.count,
      revenue: data.revenue,
    })).sort((a, b) => b.transactions - a.transactions)
  }

  const getStatusPieData = () => {
    return [
      { name: 'Completed', value: stats.completedTransactions, color: '#10b981' },
      { name: 'Pending', value: stats.pendingTransactions, color: '#f59e0b' },
      { name: 'Failed', value: stats.failedTransactions, color: '#ef4444' },
    ]
  }

  const COLORS = ['#10b981', '#f59e0b', '#ef4444']

  const updateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) {
        alert('Failed to update user role')
      } else {
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
        setEditingUser(null)
      }
    } catch (error) {
      alert('Failed to update user role')
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: !currentStatus })
        .eq('id', userId)

      if (error) {
        alert('Failed to update user status')
      } else {
        setUsers(users.map((u) => (u.id === userId ? { ...u, is_active: !currentStatus } : u)))
        calculateStats(users.map((u) => (u.id === userId ? { ...u, is_active: !currentStatus } : u)), transactions)
      }
    } catch (error) {
      alert('Failed to update user status')
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      // Don't allow deleting admin users
      const userToDelete = users.find(u => u.id === userId)
      if (userToDelete?.role === 'admin') {
        alert('Cannot delete admin users')
        return
      }

      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) {
        alert('Failed to delete user')
      } else {
        setUsers(users.filter((u) => u.id !== userId))
        calculateStats(users.filter((u) => u.id !== userId), transactions)
        setDeletingUser(null)
      }
    } catch (error) {
      alert('Failed to delete user')
    }
  }

  const deleteTransaction = async (transactionId: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId)

      if (error) {
        alert('Failed to delete transaction')
      } else {
        setTransactions(transactions.filter((t) => t.id !== transactionId))
        calculateStats(users, transactions.filter((t) => t.id !== transactionId))
        setDeletingTransaction(null)
      }
    } catch (error) {
      alert('Failed to delete transaction')
    }
  }


  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.full_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = userStatusFilter === 'all' ||
      (userStatusFilter === 'active' && user.is_active) ||
      (userStatusFilter === 'inactive' && !user.is_active)
    return matchesSearch && matchesStatus
  })

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchTerm === '' ||
      transaction.reference_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.sender_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.receiver_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return
    
    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header]
        return typeof value === 'string' ? `"${value}"` : value
      }).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const StatCard = ({ icon: Icon, title, value, change, changeType, color }: any) => (
    <div className="bg-white dark:bg-black rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-900 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 ${changeType === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {changeType === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span className="text-sm font-semibold">{change}%</span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
    </div>
  )

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
            <Shield className="w-10 h-10 mr-3 text-blue-600 dark:text-blue-400" />
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Manage users, transactions, and system settings</p>
          {loading && (
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">Loading data from database...</p>
          )}
          {!loading && users.length === 0 && transactions.length === 0 && (
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
              ⚠️ No data found. Check console for errors or verify database setup.
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
        <button
          onClick={loadData}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-900">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'transactions', label: 'Transactions', icon: DollarSign },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 flex items-center space-x-2 font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Users}
              title="Total Users"
              value={loading ? '...' : stats.totalUsers}
              change={stats.totalUsers > 0 ? undefined : undefined}
              changeType="up"
              color="bg-blue-500"
            />
            <StatCard
              icon={DollarSign}
              title="Total Revenue"
              value={loading ? '...' : `₵${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              change={stats.totalRevenue > 0 ? undefined : undefined}
              changeType="up"
              color="bg-green-500"
            />
            <StatCard
              icon={Activity}
              title="Total Transactions"
              value={loading ? '...' : stats.totalTransactions}
              change={stats.totalTransactions > 0 ? undefined : undefined}
              changeType="up"
              color="bg-purple-500"
            />
            <StatCard
              icon={TrendingUp}
              title="Today's Revenue"
              value={loading ? '...' : `₵${stats.todayRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              change={stats.todayRevenue > 0 ? undefined : undefined}
              changeType="up"
              color="bg-orange-500"
            />
          </div>
          
          {/* Debug Info (only show if no data) */}
          {!loading && stats.totalUsers === 0 && stats.totalTransactions === 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-2">⚠️ No Data Found</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                The database appears to be empty. Please:
              </p>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside space-y-1">
                <li>Run <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">database-schema.sql</code> to create tables</li>
                <li>Run <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">seed-data.sql</code> to populate data</li>
                <li>Check browser console for errors</li>
                <li>Verify RLS policies are set correctly (run <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">fix-rls-policies.sql</code> if needed)</li>
              </ul>
            </div>
          )}

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-black rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-900">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedTransactions}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed Transactions</p>
            </div>
            <div className="bg-white dark:bg-black rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-900">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingTransactions}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Transactions</p>
            </div>
            <div className="bg-white dark:bg-black rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-900">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.failedTransactions}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Failed Transactions</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-black rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-900">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button
                onClick={() => setActiveTab('users')}
                className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-left"
              >
                <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                <p className="font-semibold text-gray-900 dark:text-white">Manage Users</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">View and edit users</p>
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-left"
              >
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
                <p className="font-semibold text-gray-900 dark:text-white">View Transactions</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">All transaction records</p>
              </button>
              <button
                onClick={() => exportToCSV(users, 'users-export.csv')}
                className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-left"
              >
                <Download className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
                <p className="font-semibold text-gray-900 dark:text-white">Export Users</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Download CSV file</p>
              </button>
              <button
                onClick={() => exportToCSV(transactions, 'transactions-export.csv')}
                className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors text-left"
              >
                <Download className="w-6 h-6 text-orange-600 dark:text-orange-400 mb-2" />
                <p className="font-semibold text-gray-900 dark:text-white">Export Transactions</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Download CSV file</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
          {/* Search and Filters */}
          <div className="bg-white dark:bg-black rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-900">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button
                onClick={() => exportToCSV(filteredUsers, 'users-filtered.csv')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-black rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-900">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading users from database...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">No users found in database</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Make sure you've run the database setup scripts and created users.
                </p>
                <button
                  onClick={loadData}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                          {loading ? 'Loading users...' : 'No users found in the database'}
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-white" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.full_name || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingUser === user.id ? (
                            <select
                              value={editRole}
                              onChange={(e) => setEditRole(e.target.value as 'admin' | 'user')}
                              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'admin'
                                ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400'
                                : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300'
                            }`}>
                              {user.role}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.is_active
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                              : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                          }`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          {format(new Date(user.created_at), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center space-x-2">
                            {editingUser === user.id ? (
                              <>
                                <button
                                  onClick={() => updateUserRole(user.id, editRole)}
                                  className="text-green-600 dark:text-green-400 hover:text-green-700 transition-colors"
                                >
                                  <Check className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => setEditingUser(null)}
                                  className="text-red-600 dark:text-red-400 hover:text-red-700 transition-colors"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingUser(user.id)
                                    setEditRole(user.role)
                                  }}
                                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
                                  title="Edit Role"
                                >
                                  <Edit className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => toggleUserStatus(user.id, user.is_active)}
                                  className={`${
                                    user.is_active
                                      ? 'text-red-600 dark:text-red-400 hover:text-red-700'
                                      : 'text-green-600 dark:text-green-400 hover:text-green-700'
                                  } transition-colors`}
                                  title={user.is_active ? 'Deactivate' : 'Activate'}
                                >
                                  {user.is_active ? <X className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                                </button>
                                <button
                                  onClick={() => setDeletingUser(user)}
                                  className="text-red-600 dark:text-red-400 hover:text-red-700 ml-2"
                                  title="Delete User"
                                  disabled={user.role === 'admin'}
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
          {/* Search and Filters */}
          <div className="bg-white dark:bg-black rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-900">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by reference, sender, or receiver..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <button
                onClick={() => exportToCSV(filteredTransactions, 'transactions-filtered.csv')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white dark:bg-black rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-900">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading transactions from database...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">No transactions found in database</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Make sure you've run the seed-data.sql script to populate transactions.
                </p>
                <button
                  onClick={loadData}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reference</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sender</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Receiver</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Channel</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                          {loading ? 'Loading transactions...' : 'No transactions found in the database'}
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.reference_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          <div>{transaction.sender_name}</div>
                          <div className="text-xs text-gray-500">{transaction.sender_phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          <div>{transaction.receiver_name}</div>
                          <div className="text-xs text-gray-500">{transaction.receiver_phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                          ₵{transaction.amount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            transaction.status === 'completed'
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                              : transaction.status === 'pending'
                              ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
                              : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          {transaction.channel}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          {format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/transactions/${transaction.id}`}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors inline-flex items-center space-x-1"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View</span>
                            </Link>
                            <button
                              onClick={() => setDeletingTransaction(transaction)}
                              className="text-red-600 dark:text-red-400 hover:text-red-700"
                              title="Delete Transaction"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
          {/* Revenue Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg text-white">
              <p className="text-sm opacity-90 mb-2">Total Revenue</p>
              <p className="text-4xl font-bold">₵{stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-sm opacity-75 mt-2">From {stats.completedTransactions} completed transactions</p>
                  </div>
            <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg text-white">
              <p className="text-sm opacity-90 mb-2">Today's Revenue</p>
              <p className="text-4xl font-bold">₵{stats.todayRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-sm opacity-75 mt-2">{stats.todayTransactions} transactions today</p>
                  </div>
            <div className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg text-white">
              <p className="text-sm opacity-90 mb-2">Avg. Transaction</p>
              <p className="text-4xl font-bold">
                ₵{stats.completedTransactions > 0 ? (stats.totalRevenue / stats.completedTransactions).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
              </p>
              <p className="text-sm opacity-75 mt-2">Per completed transaction</p>
                </div>
                  </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Transactions Line Chart */}
            <div className="bg-white dark:bg-black rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-900">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Transactions (Last 7 Days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getDailyTransactionData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-800" />
                  <XAxis dataKey="date" stroke="#6b7280" className="dark:stroke-gray-400" />
                  <YAxis stroke="#6b7280" className="dark:stroke-gray-400" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                  <Legend />
                  <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} name="Completed" />
                  <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} name="Pending" />
                  <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} name="Failed" />
                </LineChart>
              </ResponsiveContainer>
                  </div>

            {/* Transaction Status Pie Chart */}
            <div className="bg-white dark:bg-black rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-900">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Transaction Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getStatusPieData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getStatusPieData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
                </div>

            {/* Daily Revenue Chart */}
            <div className="bg-white dark:bg-black rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-900">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Daily Revenue (Last 7 Days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getDailyTransactionData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-800" />
                  <XAxis dataKey="date" stroke="#6b7280" className="dark:stroke-gray-400" />
                  <YAxis stroke="#6b7280" className="dark:stroke-gray-400" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => `₵${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue (₵)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
                  </div>

            {/* Channel Distribution */}
            <div className="bg-white dark:bg-black rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-900">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Transactions by Channel</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getChannelData()} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-800" />
                  <XAxis type="number" stroke="#6b7280" className="dark:stroke-gray-400" />
                  <YAxis dataKey="name" type="category" stroke="#6b7280" className="dark:stroke-gray-400" width={120} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                  <Bar dataKey="transactions" fill="#3b82f6" name="Transactions" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
              </div>
            </div>

          {/* User Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-black rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-900">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">User Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Total Users</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Registered accounts</p>
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Active Users</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Currently active</p>
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activeUsers}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Admin Users</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Administrators</p>
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {users.filter(u => u.role === 'admin').length}
                  </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-black rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-900">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Transaction Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Completed</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Successful transactions</p>
              </div>
              </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{stats.completedTransactions}</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stats.totalTransactions > 0 ? Math.round((stats.completedTransactions / stats.totalTransactions) * 100) : 0}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Pending</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Awaiting processing</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pendingTransactions}</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stats.totalTransactions > 0 ? Math.round((stats.pendingTransactions / stats.totalTransactions) * 100) : 0}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Failed</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Unsuccessful transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{stats.failedTransactions}</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stats.totalTransactions > 0 ? Math.round((stats.failedTransactions / stats.totalTransactions) * 100) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-black rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete User</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to delete <strong>{deletingUser.email}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteUser(deletingUser.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Transaction Confirmation Modal */}
      {deletingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-black rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Transaction</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to delete transaction <strong>{deletingTransaction.reference_id}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeletingTransaction(null)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteTransaction(deletingTransaction.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

