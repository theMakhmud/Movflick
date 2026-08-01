import React, { useEffect, useState } from 'react'
import { useFavorites } from '../FavContext'
import star from '../assets/Movflick-selection.png'
import { Link } from 'react-router-dom'

const API_BASE_TMDB = "https://api.themoviedb.org/3"
const API_KEY = import.meta.env.VITE_TMDB_API

const API_OPTION = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const FavoriteCard = ({ movie, genre }) => {
  const { toggleFav, isFavorites } = useFavorites()
  const [isToggling, setIsToggling] = useState(false)

  const genreName = genre?.find(g => g.id === movie.genre_ids?.[0])?.name
  const year = movie.release_date?.split('-')[0]

  const handleToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()

    setIsToggling(true)
    setTimeout(() => {
      toggleFav(movie)
      setIsToggling(false)
    }, 500)
  }

  return (
    <Link to={`/movie/${movie.id}`}>
      <div className='flex flex-col bg-tabbar rounded-xl overflow-hidden'>
        <div
          className='relative aspect-[5/6] bg-primary bg-center bg-cover'
          style={{
            backgroundImage: movie.poster_path
              ? `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`
              : 'none'
          }}>
          <div className='absolute inset-x-0 top-0 flex items-start justify-between px-2 py-2'>
            <span className='bg-base flex items-center gap-1 rounded-2xl py-0.5 px-2'>
              <img className='size-3' src={star} alt="" />
              <p className='text-xs font-semibold'>{movie.vote_average?.toFixed(1)}</p>
            </span>
            <button onClick={handleToggle} className='size-7 flex items-center justify-center rounded-full bg-base'>
              {isToggling ? (
                <div className='size-4 rounded-full border-2 border-white/20 border-t-primary animate-spin' />
              ) : (
                <svg
                  className={`size-4 ${isFavorites(movie.id) ? 'text-primary-hover' : 'text-white'}`}
                  fill={isFavorites(movie.id) ? 'currentColor' : 'none'}
                  xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className='px-2 py-2'>
          <h2 className='text-sm font-semibold'>{movie.title}</h2>
          <div className="text-sm text-gray font-medium">{genreName} · {year}</div>
        </div>
      </div>
    </Link>
  )
}

const Favorites = () => {
  const [genre, setGenre] = useState()
  const { favorites } = useFavorites()

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreRes = await fetch(`${API_BASE_TMDB}/genre/movie/list`, API_OPTION)
        const genreData = await genreRes.json()
        setGenre(genreData.genres)
      } catch (error) {
        console.log('failed fetching genres')
      }
    }

    fetchGenres()
  }, [])

  return (
    <div className='px-4 py-4 mb-14'>
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center min-h-[70vh] w-full px-6">
          <div
            className="mb-8 flex h-40 w-40 items-center justify-center rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)' }}
          >
            <svg className="h-16 w-16 text-white/30" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>

          <h2 className="mb-3 text-3xl font-extrabold text-white">No favorites yet</h2>
          <p className="mb-8 max-w-xs text-base text-white/50 leading-relaxed">
            Tap the heart on any movie to save it here for later.
          </p>

          <Link to="/">
            <button className="flex items-center gap-2 bg-primary-hover rounded-full px-8 py-4 cursor-pointer active:scale-95 transition-transform">
              <svg className="w-5 h-5 text-base" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
              <span className="text-base font-bold">Browse movies</span>
            </button>
          </Link>
        </div>
      ) : (
        <>
          <h1 className='text-3xl font-extrabold'>Favorites</h1>
          <p className='text-sm py-1 font-medium text-[#FFFFFF73]'>{favorites.length} movies</p>

          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-5'>
            {favorites.map((movie) => (
              <FavoriteCard key={movie.id} movie={movie} genre={genre} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Favorites