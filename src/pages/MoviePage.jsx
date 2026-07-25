import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Loading from '../component/loading'
import star from '../assets/Movflick-selection.png'
import playIcon from '../assets/Movflick-logo.png'
import { useNavigate } from 'react-router-dom'

const API_BASE_TMDB = "https://api.themoviedb.org/3"
const API_KEY = import.meta.env.VITE_TMDB_API

const API_OPTION = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const MoviePage = () => {
  const { id } = useParams()
  console.log(id)
  const [movie, setMovie] = useState(null)
  const [errerMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [genre, setGenre] = useState([])
  const [similar, setSimilar] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setIsLoading(true)
        setErrorMessage('')

        let movieId = id

        if (!movieId) {
          const popRes = await fetch(
            `${API_BASE_TMDB}/discover/movie?sort_by=popularity.desc`,
            API_OPTION
          )
          const popData = await popRes.json()
          movieId = popData.results[1].id
        }

        const [detailsRes, similarRes, genreRes] = await Promise.all([
          fetch(`${API_BASE_TMDB}/movie/${movieId}`, API_OPTION),
          fetch(`${API_BASE_TMDB}/movie/${movieId}/similar`, API_OPTION),
          fetch(`${API_BASE_TMDB}/genre/movie/list`, API_OPTION)
        ])

        const detailsData = await detailsRes.json()
        const similarData = await similarRes.json()
        const genreData = await genreRes.json()

        setMovie(detailsData)
        setSimilar(similarData.results)
        // setSimilar([])
        setGenre(genreData.genres)

      } catch (error) {
        console.error(`Failed fetching movie ${error}`)
        setErrorMessage('Error fetching movie, please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovie()
  }, [id])

  const [isExpanded, setIsExpanded] = useState(false)

  if (isLoading) return <Loading />
  if (errerMessage) return <p className='text-danger'>{errorMessage}</p>
  if (!movie) return null

  console.log(movie)


  const formatRuntime = (min) => {
    if (!min) return ''
    return `${Math.floor(min / 60)}h ${min % 60}m`
  }

  const formatVotes = (count) => {
    if (!count) return '0'
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${Math.round(count / 1000)}K`
    return count.toString()
  }


  const overview = movie.overview || ''
  const LIMIT = 140
  const isLong = overview.length > LIMIT

  const handleBack = () => {
  if (window.history.length > 2) {
    navigate(-1)
  } else {
    navigate('/')
  }
}

  return (
    <div className='w-full flex flex-col mb-10'>
      <div
        className='w-full aspect-video bg-cover bg-center relative'
        kay={movie.id}
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w780${movie.backdrop_path})`
        }}>
        <span className='flex items-center justify-between py-3 px-3'>
          <button onClick={() => handleBack()} className='rounded-full border border-[#FFFFFF24] bg-[#121212] w-10 h-10 flex items-center justify-center'>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>

          <button kay={movie.id}
          className='rounded-full border border-[#FFFFFF24] bg-[#121212] w-10 h-10 flex items-center justify-center'>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-heart"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /></svg>
          </button>
        </span>
      </div>

      <div className='px-5 pt-3 z-10 flex flex-col gap-4 mb-10'>

        <h1 className='text-3xl font-extrabold leading-tight'>{movie.title}</h1>

        <div className='flex items-center gap-2 flex-wrap text-sm text-[#FFFFFFBF] font-medium'>
          <span>{movie.release_date?.split('-')[0]}</span>
          <span className='text-white/30'>·</span>

          {movie.genres?.slice(0, 2).map(genre => (
            <span
              key={genre.id}
              className='bg-[#FFFFFF14] rounded-full px-3 py-1.5 text-xs text-[#FFFFFFB3] whitespace-nowrap'
            >
              {genre.name}
            </span>
          ))}

          <span className='text-white/30'>·</span>
          <span>{formatRuntime(movie.runtime)}</span>
        </div>

        <div className='flex items-center gap-2 text-sm'>
          <img className='w-5' src={star} alt="" />
          <span className='font-bold text-base text-white'>{movie.vote_average?.toFixed(1)}</span>
          <span className='text-[#FFFFFF80]'>/ 10</span>
          <span className='text-white/30'>·</span>
          <span className='text-[#FFFFFF80]'>{formatVotes(movie.vote_count)} votes</span>
        </div>

        <div className='flex items-center gap-3 mt-1'>
          <button className='flex-1 h-12 bg-primary-hover rounded-full flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-transform'>
            <svg className='w-6 h-6 text-black bg-black' viewBox="0 0 24 24" fill="">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span className='text-black font-bold text-base'>Watch Trailer</span>
          </button>

          <button className='w-12 h-12 shrink-0 rounded-full border border-white/20 flex items-center justify-center cursor-pointer active:scale-95 transition-transform'>
            <svg className='w-6 h-6 text-white' viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>


        <div className='flex flex-col gap-2 '>
          <h2 className='text-lg font-bold'>Overview</h2>
          <p className='text-sm font-normal text-[#FFFFFF99] leading-relaxed'>
            {isExpanded || !isLong
              ? overview
              : `${overview.slice(0, LIMIT).trim()}...`}

            {isLong && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className='text-primary-hover font-semibold ml-1 cursor-pointer'
              >
                {isExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </p>
        </div>

        <div className='flex flex-col gap-2 pt-4'>
          <div className='flex justify-between py-1 items-center'>
              <h2 className='text-lg'>Similar Movies</h2>
          </div>
          
          <div>
            {similar?.length === 0 ? (
              <div className='px-5 py-5 text-[#FFFFFF66] rounded-2xl text-sm border border-dashed border-[#FFFFFF1F]'>
                <p>No similar movies yet — check back after release.</p>
              </div>
            ) : (
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
                {similar?.map( (movie) => {
                    const genreName = genre?.find(g => g.id === movie.genre_ids?.[0])?.name
                    const year = movie.release_date?.split('-')[0]

                    return (
                        <Link to={`/movie/${movie.id}`}>
                            <div 
                            key={movie.id}
                            className='flex flex-col bg-tabbar rounded-xl overflow-hidden'>
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
                                        <button className='size-7 flex items-center justify-center rounded-full bg-base'>
                                            <svg className='size-4' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-heart"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /></svg>
                                        </button>
                                    </div>
                                </div>

                                <div className=' px-2 py-2 '>
                                    <h2 className='text-sm font-semibold'>{movie.title}</h2>
                                    <div class="text-sm text-gray font-medium">{genreName} · {year}</div>
                                </div>
                            </div>
                        </Link>
                    )
                })}
              </div>
            )}
          </div>
        </div>

      </div>


    </div>
  )
   
}

export default MoviePage