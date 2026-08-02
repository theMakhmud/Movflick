import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { account } from '../lib/appwrite'
import { useAuth } from '../AuthContext'

const VerifyEmail = () => {
  const [status, setStatus] = useState('verifying')
  const [error, setError] = useState(null)

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { refreshUser } = useAuth()

  const userId = searchParams.get('userId')
  const secret = searchParams.get('secret')

  const started = useRef(false)

  useEffect(() => {
    if (!userId || !secret) return
    if (started.current) return
    started.current = true

    const verify = async () => {
      try {
        await account.updateVerification({ userId, secret })
        await refreshUser()
        setStatus('success')
      } catch (err) {
        console.error(err)
        if (err.code === 401) {
          setError('Ссылка недействительна или устарела. Запросите новую в профиле.')
        } else {
          setError(err.message)
        }
        setStatus('error')
      }
    }
    verify()
  }, [userId, secret])

  if (!userId || !secret) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center px-6 text-center'>
        <h1 className='text-2xl font-extrabold text-white mb-2'>Invalid link</h1>
        <p className='text-sm text-white/50 max-w-xs'>
          This verification link is invalid or incomplete. Please request a new one from your profile.
        </p>
        <button
          onClick={() => navigate('/')}
          className='mt-6 px-8 py-3 bg-primary rounded-full text-black font-bold cursor-pointer active:scale-[0.98] transition-transform'
        >
          Back to home
        </button>
      </div>
    )
  }

  if (status === 'verifying') {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center px-6 text-center'>
        <div className='w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-5' />
        <p className='text-sm text-white/50'>Verifying your email...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center px-6 text-center'>
        <div className='w-16 h-16 rounded-full bg-danger/15 flex items-center justify-center mb-5'>
          <svg className='w-8 h-8 text-danger' viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
        <h1 className='text-2xl font-extrabold text-white mb-2'>Verification failed</h1>
        <p className='text-sm text-white/50 max-w-xs'>{error}</p>
        <button
          onClick={() => navigate('/')}
          className='mt-6 px-8 py-3 bg-primary rounded-full text-black font-bold cursor-pointer active:scale-[0.98] transition-transform'
        >
          Back to home
        </button>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-6 text-center'>
      <div className='w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mb-5'>
        <svg className='w-8 h-8 text-primary' viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <h1 className='text-2xl font-extrabold text-white mb-2'>Email verified!</h1>
      <p className='text-sm text-white/50 max-w-xs'>
        Your email has been confirmed. Enjoy Movflick without limits.
      </p>
      <button
        onClick={() => navigate('/')}
        className='mt-6 px-8 py-3 bg-primary rounded-full text-black font-bold cursor-pointer active:scale-[0.98] transition-transform'
      >
        Back to home
      </button>
    </div>
  )
}

export default VerifyEmail
