import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '⚠️ Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  )
  console.error('The application will use mock data until Supabase is configured.')
}

// Create Supabase client with fallback empty strings if env vars are missing
// This allows the app to run even if Supabase isn't configured yet
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

// Database types
export interface Transaction {
  id: string
  reference_id: string
  sender_name: string
  sender_phone: string
  receiver_name: string
  receiver_phone: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  channel: string
  created_at: string
  updated_at: string
  notes?: string
}

export interface User {
  id: string
  email: string
  full_name?: string
  role: 'admin' | 'user'
  is_active: boolean
  created_at: string
}

export interface TransactionLog {
  id: string
  transaction_id: string
  action: string
  details: string
  created_at: string
  created_by: string
}

