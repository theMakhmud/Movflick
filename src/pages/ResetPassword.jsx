import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { account } from '../lib/appwrite'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const userId = searchParams.get('userId')
  const secret = searchParams.get('secret')

  const validatePassword = (password) => {
    if (password.length === 0) return 'Введите пароль'
    if (password.length < 8) return 'Пароль слишком короткий (минимум 8 символов)'
    if (password.length > 128) return 'Пароль слишком длинный'
    if (!/[a-zA-Z]/.test(password)) return 'Пароль должен содержать хотя бы одну букву'
    if (!/[0-9]/.test(password)) return 'Пароль должен содержать хотя бы одну цифру'
    return null
  }

  const handleReset = async (e) => {
    e.preventDefault()

    const pErr = validatePassword(password)
    if (pErr) {
      setError(pErr)
      return
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают')
      return
    }
    setError(null)

    try {
      setIsLoading(true)

      await account.updateRecovery(userId, secret, password)

      setSuccess(true)
    } catch (err) {
      console.error(err)
      if (err.code === 401) {
        setError('Ссылка недействительна или устарела. Запросите новую.')
      } else {
        setError(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!userId || !secret) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center px-6 text-center'>
        <h1 className='text-2xl font-extrabold text-white mb-2'>Invalid link</h1>
        <p className='text-sm text-white/50 max-w-xs'>
          This password reset link is invalid or incomplete. Please request a new one.
        </p>
        <button
          onClick={() => navigate('/auth')}
          className='mt-6 px-8 py-3 bg-primary rounded-full text-black font-bold cursor-pointer active:scale-[0.98] transition-transform'
        >
          Back to login
        </button>
      </div>
    )
  }

  if (success) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center px-6 text-center'>
        <div className='w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mb-5'>
          <svg className='w-8 h-8 text-primary' viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 className='text-2xl font-extrabold text-white mb-2'>Password changed!</h1>
        <p className='text-sm text-white/50 max-w-xs'>
          Your password has been reset. You can now log in with your new password.
        </p>
        <button
          onClick={() => navigate('/auth')}
          className='mt-6 px-8 py-3 bg-primary rounded-full text-black font-bold cursor-pointer active:scale-[0.98] transition-transform'
        >
          Log in
        </button>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-6 py-10'>
      <div className='flex flex-col items-center mb-10'>
        <div className='w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mb-4'>
          <svg className='w-8 h-8 text-primary' viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
          </svg>
        </div>
        <h1 className='text-3xl font-extrabold text-white'>New Password</h1>
        <p className='text-sm text-white/50 mt-2'>Create a strong new password</p>
      </div>

      <div className='w-full max-w-sm flex flex-col gap-4'>
        <div className='flex flex-col gap-1.5'>
          <label className='text-sm font-medium text-white/70 pl-1'>New password</label>
          <input
            type='password'
            placeholder='Min 8 characters'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-primary transition-colors'
          />
        </div>

        <div className='flex flex-col gap-1.5'>
          <label className='text-sm font-medium text-white/70 pl-1'>Repeat password</label>
          <input
            type='password'
            placeholder='Repeat your password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-4 py-3.5 rounded-xl bg-white/5 border text-white placeholder-white/30 outline-none focus:border-primary transition-colors ${
              error ? 'border-red-400' : 'border-white/10'
            }`}
          />
          {error && <p className='text-xs text-danger pl-1'>{error}</p>}
        </div>

        <button
          onClick={handleReset}
          disabled={isLoading}
          className='w-full py-3.5 mt-2 bg-primary rounded-full text-black font-bold text-base cursor-pointer active:scale-[0.98] transition-transform disabled:opacity-50'
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>
    </div>
  )
}

export default ResetPassword