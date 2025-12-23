import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: SupabaseUser | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any; requiresConfirmation?: boolean }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
  resendConfirmationEmail: (email: string) => Promise<{ error: any }>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      checkAdminRole(session?.user?.id)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      checkAdminRole(session?.user?.id)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAdminRole = async (userId: string | undefined) => {
    if (!userId) {
      setIsAdmin(false)
      return
    }

    try {
      // First try to get role from users table
      const { data, error } = await supabase
        .from('users')
        .select('role, email')
        .eq('id', userId)
        .single()

      if (!error && data) {
        // Check if role is admin OR email is admin@zeepay.com
        if (data.role === 'admin' || data.email === 'admin@zeepay.com') {
          setIsAdmin(true)
          return
        }
      }
      
      // Fallback: Check by email if user record doesn't exist
      const { data: userData } = await supabase.auth.getUser()
      if (userData?.user?.email === 'admin@zeepay.com') {
        setIsAdmin(true)
        return
      }
      
      setIsAdmin(false)
    } catch (error) {
      // Fallback: Check by email
      const { data: userData } = await supabase.auth.getUser()
      if (userData?.user?.email === 'admin@zeepay.com') {
        setIsAdmin(true)
      } else {
        setIsAdmin(false)
      }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        // Better error messages
        if (error.message.includes('Invalid API key') || error.message.includes('JWT')) {
          return { error: { message: 'Configuration error. Please contact support.' } }
        }
        if (error.message.includes('Invalid login credentials')) {
          return { error: { message: 'Invalid email or password. Please try again.' } }
        }
      }
      return { error }
    } catch (err: any) {
      return { error: { message: err.message || 'An unexpected error occurred. Please try again.' } }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // First, try to sign up without email confirmation (for development/testing)
      const { error: authError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/email-confirmation`,
          data: {
            full_name: fullName,
          },
        },
      })

      if (authError) {
        // Better error messages
        if (authError.message.includes('Invalid API key') || authError.message.includes('JWT')) {
          return { error: { message: 'Configuration error. Please contact support.' } }
        }
        if (authError.message.includes('already registered')) {
          return { error: { message: 'An account with this email already exists.' } }
        }
        return { error: authError }
      }

      // Create user record in users table if user was created
      if (data.user) {
        const { error: dbError } = await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          role: 'user',
          is_active: true,
        })
        if (dbError) {
          // If user table doesn't exist or RLS blocks, that's okay - user can still sign in
          console.warn('Could not create user record:', dbError)
        }
      }

      // Check if user needs email confirmation
      const requiresConfirmation = !data.session

      // If email confirmation is required, log helpful information
      if (requiresConfirmation) {
        console.log('Email confirmation may be required. Check SUPABASE_EMAIL_SETUP.md for configuration.')
        console.log('For development, you can disable email confirmation in Supabase Dashboard.')
      }

      // Return success with confirmation status
      return {
        error: null,
        requiresConfirmation
      }
    } catch (err: any) {
      return { error: { message: err.message || 'An unexpected error occurred. Please try again.' } }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  }

  const resendConfirmationEmail = async (email: string) => {
    try {
      // Use the resend method with proper parameters
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/email-confirmation`,
        },
      })
      
      if (error) {
        // Better error handling
        if (error.message.includes('rate limit')) {
          return { error: { message: 'Too many requests. Please wait a few minutes before trying again.' } }
        }
        return { error }
      }
      
      return { error: null }
    } catch (err: any) {
      return { error: { message: err.message || 'Failed to resend confirmation email. Please try again later.' } }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        resendConfirmationEmail,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

