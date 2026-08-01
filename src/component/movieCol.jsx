import React from 'react'
import star from '../assets/Movflick-selection.png'
import playIcon from '../assets/Movflick-logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { useFavorites } from '../FavContext'
import { useAuth } from '../AuthContext'

const Trend = ({title,movieList, genreList}) => {
  const { toggleFav, isFavorites } = useFavorites()

    const navigate = useNavigate()
    const { user, authLoading } = useAuth()

    const handleFav = (e, movie) => {
        e.preventDefault()
        e.stopPropagation()

        const ok = toggleFav(movie)
        if (!ok) navigate('/auth')
    }
  return (
    <div className='flex flex-col gap-2'>
        <div className='flex justify-between items-center'>
            <h2 className='text-lg'>{title}</h2>
            {/* <a className='text-primary text-sm font-semibold' href="#">See all</a> */}
        </div>
        <div className='flex flex-1 gap-2  overflow-x-auto scrollbar-hide'>
             {movieList?.map( (movie) => {

                const genreName = genreList?.find(g => g.id === movie.genre_ids?.[0])?.name || movie.genres?.[0]?.name
                const year = movie.release_date?.split('-')[0]

                return (
                    <Link to={`/movie/${movie.id}`}>
                        <div 
                        key={movie.id}
                        className='flex flex-col bg-tabbar rounded-xl h-60 w-40 shrink-0 overflow-hidden'>
                            <div 
                            className='relative flex-1 bg-primary bg-center bg-cover'
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
                                    <button
                                        onClick={(e) => handleFav(e, movie)}
                                        className='size-7 flex items-center justify-center rounded-full bg-base'>
                                        <svg className={`size-4 ${isFavorites(movie.id) && user ? 'text-primary' : 'text-white'}`} fill={isFavorites(movie.id) && user ? 'currentColor' : 'none'} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className=' px-2 py-2 '>
                                <h2 className='text-sm font-semibold'>{movie.title}</h2>
                                <div className="text-sm text-gray font-medium">{genreName ? genreName : movie.genre_ids} · {year}</div>
                            </div>
                        </div>
                    </Link>
                )
             })}
        </div>
    </div>
  )
}

export default Trend