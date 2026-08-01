import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { account } from '../lib/appwrite'
import { ID } from 'appwrite'
import { useAuth } from '../AuthContext'

const RegisterCard = ({ switchToLogin, name, setName, nameError, email, setEmail, emailError, password, setPassword, passError, onSubmit }) => {
  return (
    <div className='max-h-screen flex flex-col items-center justify-center px-6 py-16'>

      <div className='flex flex-col items-center mb-10'>
        <h1 className='text-3xl font-extrabold text-white'>Create Account</h1>
        <p className='text-sm text-white/50 mt-2'>Join Movflick to track your movies</p>
      </div>

      <div className='w-full max-w-sm flex flex-col gap-4'>

        <div className='flex flex-col gap-1.5'>
          <label className='text-sm font-medium items-end flex gap-4 text-white/70 pl-1'>
            Name
            {nameError && <p className='text-xs text-danger pl-1'>{nameError}</p>}
          </label>
          <input
            type='text'
            placeholder='Your name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-primary transition-colors ${nameError ? 'border-red-400' : 'border-white/10'}`}
          />
        </div>

        <div className='flex flex-col gap-1.5'>
          <label className='text-sm font-medium items-end flex gap-4 text-white/70 pl-1'>
            Email
            <p className='text-xs text-danger pl-1'>{emailError}</p>
          </label>
          <input
            type='email'
            placeholder='you@example.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-primary transition-colors'
          />
        </div>

        <div className='flex flex-col gap-1.5'>
          <label className='text-sm font-medium items-end flex gap-4 text-white/70 pl-1'>
            Password
            <p className='text-xs text-danger pl-1'>{passError}</p>
          </label>
          <input
            type='password'
            placeholder='Min 8 characters'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-primary transition-colors'
          />
        </div>

        <button
        onClick={onSubmit}
        className='w-full h-13 py-3.5 mt-2 bg-primary rounded-full text-black font-bold text-base cursor-pointer active:scale-[0.98] transition-transform'>
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

const LoginCard = ({ switchToRegister, email, setEmail, emailError, password, setPassword, passError, onSubmit}) => {
  return (
    <div className='max-h-screen flex flex-col items-center justify-center px-6 py-15'>

      <div className='flex flex-col items-center mb-10'>
        <h1 className='text-3xl font-extrabold text-white'>Welcome Back</h1>
        <p className='text-sm text-white/50 mt-2'>Log in to continue watching</p>
      </div>

      <div className='w-full max-w-sm flex flex-col gap-4'>

        <div className='flex flex-col gap-1.5'>
          <label className='text-sm font-medium items-end flex gap-4 text-white/70 pl-1'>
            Email
            <p className='text-xs text-danger pl-1'>{emailError}</p>
          </label>
          <input
            type='email'
            placeholder='you@example.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-primary transition-colors'
          />
        </div>

        <div className='flex flex-col gap-1.5'>
          <div className='flex items-center justify-between pl-1'>
            <label className='text-sm font-medium items-end flex gap-4 text-white/70 pl-1'>
              Password
              <p className='text-xs text-danger pl-1'>{passError}</p>
            </label>
            <span className='text-xs text-primary cursor-pointer hover:underline'>
              Forgot password?
            </span>
          </div>
          <input
            type='password'
            placeholder='Your password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-primary transition-colors'
          />
        </div>

        <button
        onClick={onSubmit}
        className='w-full py-3.5 mt-2 bg-primary rounded-full text-black font-bold text-base cursor-pointer active:scale-[0.98] transition-transform'>
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
  const [IsLoading, setIsLoading] = useState(false)

  const [nameError, setNameError] = useState(null)
  const [name, setName] = useState("")

  const [emailError, setEmailError] = useState(null)
  const [email, setEmail] = useState("")

  const [passError, setPassError] = useState(null)
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const {register, login} = useAuth()


  const handleSubmit = async (e) => {
    e.preventDefault()

    const nErr = isLogin ? null : validateName(name)
    const eErr = validateEmail(email)
    const pErr = validatePassword(password)

    setNameError(nErr)
    setEmailError(eErr)
    setPassError(pErr)

    if (nErr || eErr || pErr) return

    try {
      setIsLoading(true)



      if (isLogin) {
        await login(
          email.trim().toLowerCase(),
          password
        )
      } else {
        const trimmed = name.trim()
        const cleanName = trimmed.charAt(0).toUpperCase() + trimmed.slice(1)

        await register(
          email.trim().toLowerCase(),
          password,
          cleanName
        )
      }

      navigate('/')

    } catch (err) {
      console.error(err)
      if (err.code === 409) {
        setEmailError('Этот email уже используется.')
      } else if (err.code === 401) {
        setEmailError('Неверный email или пароль')
      } else if (err.code === 429) {
        setEmailError('Слишком много попыток. Подождите немного.')
      } else {
        setEmailError(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const validateName = (name) => {
    const trimmed = name.trim()

    if (trimmed.length === 0) {
      return 'Введите имя'
    }
    if (trimmed.length < 2) {
      return 'Имя слишком короткое (минимум 2 символа)'
    }
    if (trimmed.length > 40) {
      return 'Имя слишком длинное (максимум 50 символов)'
    }
    if (!/^[a-zA-Zа-яА-ЯёЁ\s'-]+$/.test(trimmed)) {
      return 'Имя может содержать только буквы, пробелы, дефис и апостроф'
    }

    return null
  }

  const validateEmail = (email) => {
    const trimmed = email.trim().toLowerCase()

    if (trimmed.length === 0) {
      return 'Введите email'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return 'Введите корректный email'
    }
    if (trimmed.length > 254) {
      return 'Email слишком длинный'
    }

    return null
  }

  const validatePassword = (password) => {
    if (password.length === 0) {
      return 'Введите пароль'
    }
    if (password.length < 8) {
      return 'минимум 8 символов'
    }
    if (password.length > 40) {
      return 'Пароль слишком длинный'
    }
    if (!/[a-zA-Z]/.test(password)) {
      return 'Пароль должен содержать хотя бы одну букву'
    }
    if (!/[0-9]/.test(password)) {
      return 'Пароль должен содержать хотя бы одну цифру'
    }

    return null
  }

  const handleBack = () => {
    if (window.history.length > 2) navigate(-1)
    else navigate('/')
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
          ? <LoginCard switchToRegister={() => setIsLogin(false)}  email={email} setEmail={setEmail} emailError={emailError} password={password} setPassword={setPassword} passError={passError} onSubmit={handleSubmit}/>
          : <RegisterCard switchToLogin={() => setIsLogin(true)}  name={name} setName={setName} nameError={nameError} email={email} setEmail={setEmail} emailError={emailError} password={password} setPassword={setPassword} passError={passError} onSubmit={handleSubmit} />}
      </div>
    </div>
  )
}

export default Register