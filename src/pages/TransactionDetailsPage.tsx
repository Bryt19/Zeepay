import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Transaction, TransactionLog } from '../lib/supabase'
import { ArrowLeft, User, Phone, DollarSign, Calendar, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { useAuth } from '../contexts/AuthContext'

export default function TransactionDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [logs, setLogs] = useState<TransactionLog[]>([])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id) {
      loadTransaction()
      loadLogs()
    }
  }, [id])

  const loadTransaction = async () => {
    setLoading(true)
    try {
      // Fetch transaction from database
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error loading transaction:', error)
        setTransaction(null)
      } else {
        setTransaction(data)
        setNotes(data?.notes || '')
      }
    } catch (error) {
      console.error('Error loading transaction:', error)
      setTransaction(null)
    } finally {
      setLoading(false)
    }
  }

  const loadLogs = async () => {
    try {
      // Fetch transaction logs from database
      const { data, error } = await supabase
        .from('transaction_logs')
        .select('*')
        .eq('transaction_id', id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading transaction logs:', error)
        setLogs([])
      } else {
        setLogs(data || [])
      }
    } catch (error) {
      console.error('Error loading transaction logs:', error)
      setLogs([])
    }
  }

  const saveNotes = async () => {
    if (!transaction || !isAdmin) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ notes })
        .eq('id', transaction.id)

      if (error) {
        alert('Failed to save notes')
      }
    } catch (error) {
      alert('Failed to save notes')
    } finally {
      setSaving(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
      case 'failed':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Transaction not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Dashboard
      </button>

      <div className="bg-white dark:bg-black rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Transaction Details
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Reference: {transaction.reference_id}</p>
          </div>
          <span className={`px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
            {transaction.status}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Sender Info */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Sender Information
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
              <p className="text-gray-900 dark:text-white font-medium">{transaction.sender_name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">Phone</p>
              <p className="text-gray-900 dark:text-white font-medium flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                {transaction.sender_phone}
              </p>
            </div>
          </div>

          {/* Receiver Info */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Receiver Information
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
              <p className="text-gray-900 dark:text-white font-medium">{transaction.receiver_name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">Phone</p>
              <p className="text-gray-900 dark:text-white font-medium flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                {transaction.receiver_phone}
              </p>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              Amount
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              GHS {transaction.amount.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Channel
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {transaction.channel}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Date
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm')}
            </p>
          </div>
        </div>

        {/* Admin Notes */}
        {isAdmin && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Internal Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add internal notes..."
            />
            <button
              onClick={saveNotes}
              disabled={saving}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        )}
      </div>

      {/* Transaction Logs */}
      <div className="bg-white dark:bg-black rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Transaction Logs</h2>
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 dark:bg-gray-900/50 rounded-r-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{log.action}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{log.details}</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

