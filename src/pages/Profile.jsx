import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { useFavorites } from '../FavContext'
import Trend from '../component/movieCol'

const API_BASE_TMDB = "https://api.themoviedb.org/3"
const API_KEY = import.meta.env.VITE_TMDB_API

const API_OPTION = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const EmptySection = ({ icon, title, hint }) => (
  <div className='w-full bg-white/[0.03] rounded-2xl flex flex-col items-center justify-center py-8 px-6'>
    <div className='w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4'>
      {icon}
    </div>
    <p className='text-base font-bold text-white/80'>{title}</p>
    <p className='text-sm text-white/40 mt-1 text-center'>{hint}</p>
  </div>
)

const Profile = () => {
  const { logout, user, needsVerification, verifyDeadline, resendVerification } = useAuth()
  const { watched, planned } = useFavorites()
  const navigate = useNavigate()

  const [genre, setGenre] = useState([])

  const [timeLeft, setTimeLeft] = useState('')
  const [resent, setResent] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  useEffect(() => {
    if (!needsVerification || !verifyDeadline) return

    const update = () => {
      const ms = Math.max(0, verifyDeadline - Date.now())
      const h = Math.floor(ms / 3600000)
      const m = Math.floor((ms % 3600000) / 60000)
      setTimeLeft(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
    update()
    const interval = setInterval(update, 30000)
    return () => clearInterval(interval)
  }, [needsVerification, verifyDeadline])

  const handleResend = async () => {
    try {
      setResendLoading(true)
      await resendVerification()
      setResent(true)
    } catch (err) {
      console.error(err)
    } finally {
      setResendLoading(false)
    }
  }

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(`${API_BASE_TMDB}/genre/movie/list`, API_OPTION)
        const data = await res.json()
        setGenre(data.genres)
      } catch (err) {
        console.error('Failed fetching genres:', err)
      }
    }
    fetchGenres()
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className='px-4 py-8 pb-25 lg:pb-12 lg:max-w-4xl lg:mx-auto'>

      {needsVerification && (
        <div className='mb-6 rounded-2xl border border-danger/40 bg-danger/10 p-4 flex items-start gap-3'>
          <svg className='w-5 h-5 text-danger shrink-0 mt-0.5' viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <p className='text-sm font-bold text-danger'>Verify your email</p>
            <p className='text-xs text-white/60 mt-1 leading-relaxed'>
              We sent a confirmation link to <span className='text-white/90'>{user?.email}</span>.
              You will be logged out in <span className='text-danger font-semibold'>{timeLeft}</span> unless you verify it.
            </p>
            {resent ? (
              <p className='text-xs text-primary font-semibold mt-2'>Email sent again — check your inbox</p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className='text-xs font-semibold text-danger underline mt-2 cursor-pointer disabled:opacity-50'
              >
                {resendLoading ? 'Sending...' : 'Resend email'}
              </button>
            )}
          </div>
        </div>
      )}

      <div className='flex flex-col items-center'>
        <div
          className='w-24 h-24 rounded-full flex items-center justify-center mb-5'
          style={{
            background: 'radial-gradient(circle at 30% 30%, #4ade80, #2B7F36 60%, #16a34a)',
            boxShadow: '0 0 40px rgba(34, 197, 94, 0.35), 0 8px 24px rgba(34, 197, 94, 0.25)'
          }}
        >
          <p className='text-3xl font-extrabold text-black uppercase'>
            {user?.name?.slice(0, 2) || 'U'}
          </p>
        </div>

        <h1 className='text-2xl font-extrabold text-white text-center max-w-xs truncate px-4'>
          {user?.name}
        </h1>

        <p className='text-sm text-white/50 mt-2 font-medium'>
          {watched.length} watched · {planned.length} to watch
        </p>
      </div>

      <div className='flex gap-6 flex-col mt-8'>

        {watched.length > 0 ? (
          <Trend movieList={watched} genreList={genre} title={"Watched"} />
        ) : (
          <div>
            <div className='flex items-center gap-2 mb-3'>
              <h2 className='text-lg font-bold text-white'>Watched</h2>
            </div>
            <EmptySection
              icon={
                <svg className='w-6 h-6 text-white/40' viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              }
              title='No watched movies yet'
              hint='Movies you mark as watched will appear here'
            />
          </div>
        )}

        {planned.length > 0 ? (
          <Trend movieList={planned} genreList={genre} title={"Watch Later"} />
        ) : (
          <div>
            <div className='flex items-center gap-2 mb-3'>
              <h2 className='text-lg font-bold text-white'>Watch Later</h2>
            </div>
            <EmptySection
              icon={
                <svg className='w-6 h-6 text-white/40' viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
              title='Nothing saved for later'
              hint='Movies you save will appear here'
            />
          </div>
        )}

      </div>

      {user && (
        <>
          <div className='w-full h-px bg-white/10 my-8' />

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className='w-full flex items-center justify-center gap-2 py-4 rounded-full border border-danger text-danger font-semibold cursor-pointer hover:bg-red-400/10 active:scale-[0.98] transition-all'
          >
            <svg className='w-5 h-5' viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Log out
          </button>
        </>
      )}

      {showLogoutConfirm && (
        <div
          className='fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-6'
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className='relative w-full max-w-sm bg-tabbar rounded-2xl p-6'
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className='text-xl font-bold text-white'>Log out?</h3>
            <p className='text-sm text-white/60 mt-2 leading-relaxed'>
              Are you sure you want to log out of your account?
            </p>

            <div className='flex flex-col gap-2 mt-6'>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className='w-full py-3.5 rounded-full border border-white/20 text-white font-semibold cursor-pointer hover:bg-white/5 active:scale-[0.98] transition-all'
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className='w-full py-3.5 rounded-full bg-red-500 text-white font-bold cursor-pointer active:scale-[0.98] transition-transform'
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Profile