import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


const RegisterCard = ({ switchToLogin }) => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-6 py-10'>

      <div className='flex flex-col items-center mb-10'>
        <h1 className='text-3xl font-extrabold text-white'>Create Account</h1>
        <p className='text-sm text-white/50 mt-2'>Join Movflick to track your movies</p>
      </div>

      <div className='w-full max-w-sm flex flex-col gap-4'>

        <div className='flex flex-col gap-1.5'>
          <label className='text-sm font-medium text-white/70 pl-1'>Name</label>
          <input
            type='text'
            placeholder='Your name'
            className='w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-primary transition-colors'
          />
        </div>

        <div className='flex flex-col gap-1.5'>
          <label className='text-sm font-medium text-white/70 pl-1'>Email</label>
          <input
            type='email'
            placeholder='you@example.com'
            className='w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-primary transition-colors'
          />
        </div>

        <div className='flex flex-col gap-1.5'>
          <label className='text-sm font-medium text-white/70 pl-1'>Password</label>
          <input
            type='password'
            placeholder='Min 8 characters'
            className='w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-primary transition-colors'
          />
        </div>

        <button className='w-full h-13 py-3.5 mt-2 bg-primary rounded-full text-black font-bold text-base cursor-pointer active:scale-[0.98] transition-transform'>
          Sign Up
        </button>

        <div className='flex items-center gap-3 my-2'>
          <div className='flex-1 h-px bg-white/10' />
          <span className='text-xs text-white/40'>or</span>
          <div className='flex-1 h-px bg-white/10' />
        </div>

        <p className='text-sm text-white/50 text-center'>
          Already have an account?{' '}
          <span
          onClick={switchToLogin}
          className='text-primary font-semibold hover:underline cursor-pointer'
        >
          Log in
        </span>
        </p>
      </div>
    </div>
  )
}

const LoginCard = ({ switchToRegister }) => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-6 py-10'>

      <div className='flex flex-col items-center mb-10'>
        <h1 className='text-3xl font-extrabold text-white'>Welcome Back</h1>
        <p className='text-sm text-white/50 mt-2'>Log in to continue watching</p>
      </div>

      <div className='w-full max-w-sm flex flex-col gap-4'>

        <div className='flex flex-col gap-1.5'>
          <label className='text-sm font-medium text-white/70 pl-1'>Email</label>
          <input
            type='email'
            placeholder='you@example.com'
            className='w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-primary transition-colors'
          />
        </div>

        <div className='flex flex-col gap-1.5'>
          <div className='flex items-center justify-between pl-1'>
            <label className='text-sm font-medium text-white/70'>Password</label>
            <span className='text-xs text-primary cursor-pointer hover:underline'>
              Forgot password?
            </span>
          </div>
          <input
            type='password'
            placeholder='Your password'
            className='w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-primary transition-colors'
          />
        </div>

        <button className='w-full py-3.5 mt-2 bg-primary rounded-full text-black font-bold text-base cursor-pointer active:scale-[0.98] transition-transform'>
          Log In
        </button>

        <div className='flex items-center gap-3 my-2'>
          <div className='flex-1 h-px bg-white/10' />
          <span className='text-xs text-white/40'>or</span>
          <div className='flex-1 h-px bg-white/10' />
        </div>

        <p className='text-sm text-white/50 text-center'>
          Don't have an account?{' '}
          <span
            onClick={switchToRegister}
            className='text-primary font-semibold hover:underline cursor-pointer'
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  )
}

const Register = () => {
  const [isLogin, setIsLogin] = useState(true)

  const navigate = useNavigate()

  const handleBack = () => {
  if (window.history.length > 2) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }
  
  return (
    <div>
      <div>
        <button
          onClick={handleBack}
          className='flex items-center gap-1.5 px-5 py-4 text-white/60 hover:text-white transition-colors cursor-pointer group'
        >
          <svg
            className='w-4 h-4 group-hover:-translate-x-0.5 transition-transform'
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span className='text-sm font-semibold'>Back</span>
        </button>
      {isLogin
          ? <LoginCard switchToRegister={() => setIsLogin(false)} />
          : <RegisterCard switchToLogin={() => setIsLogin(true)} />}
      </div>
    </div>
  )
}

export default Register