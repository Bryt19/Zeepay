import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function EmailConfirmationPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const confirmEmail = async () => {
      // Supabase sends confirmation links with hash fragments, not query params
      // The auth state change listener will handle the confirmation automatically
      // But we can also check for explicit tokens
      const token = searchParams.get('token')
      const type = searchParams.get('type')

      // Check if there's a hash fragment (Supabase's default method)
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')

      if (accessToken || token) {
        try {
          // If we have a token in query params, verify it
          if (token && type) {
            const { error } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: type as 'email' | 'signup',
            })

            if (error) {
              setStatus('error')
              setMessage(error.message || 'Failed to confirm email. The link may have expired.')
            } else {
              setStatus('success')
              setMessage('Email confirmed successfully! You can now sign in to your account.')
              setTimeout(() => {
                navigate('/login')
              }, 3000)
            }
          } else if (accessToken) {
            // Supabase handles hash-based confirmations automatically via onAuthStateChange
            // Just show success message
            setStatus('success')
            setMessage('Email confirmed successfully! You can now sign in to your account.')
            setTimeout(() => {
              navigate('/login')
            }, 3000)
          }
        } catch (err: any) {
          setStatus('error')
          setMessage(err.message || 'An error occurred while confirming your email.')
        }
      } else {
        // Wait a moment for Supabase to process the hash
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
              setStatus('success')
              setMessage('Email confirmed successfully! You can now sign in to your account.')
              setTimeout(() => {
                navigate('/login')
              }, 3000)
            } else {
              setStatus('error')
              setMessage('Invalid confirmation link. Please check your email and try again.')
            }
          })
        }, 1000)
      }
    }

    confirmEmail()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-black dark:via-black dark:to-black px-4">
      <div className="max-w-md w-full bg-white dark:bg-black rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Confirming Email</h1>
            <p className="text-gray-600 dark:text-gray-400">Please wait while we verify your email address...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Email Confirmed!</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Redirecting to login page...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-600 dark:text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Confirmation Failed</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  )
}

