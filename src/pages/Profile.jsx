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
  const { logout, user } = useAuth()
  const { watched, planned } = useFavorites()
  const navigate = useNavigate()

  const [genre, setGenre] = useState([])

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
    <div className='px-4 py-8 pb-25'>

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

      <div className='w-full h-px bg-white/10 my-8' />

      <button
        onClick={handleLogout}
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

    </div>
  )
}

export default Profile