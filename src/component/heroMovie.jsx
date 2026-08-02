import React from 'react'
import star from '../assets/Movflick-selection.png'
import playIcon from '../assets/Movflick-logo.png'
import { Link } from 'react-router-dom'

const formatVotes = (count) => {
  if (!count) return '0'
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${Math.round(count / 1000)}K`
  return count.toString()
}

const Hero = ({movie, genreList}) => {
    const oneMovie = movie?.[0]
    if (!oneMovie) return null

    const id = oneMovie.genre_ids
    const movieGenre = genreList.filter(genre => id.includes(genre.id))
    const genresLine = movieGenre.slice(0, 2).map(g => g.name).join(' / ')
  return (
    <Link to={`/movie/${oneMovie.id}`} className='block'>
        <div
        className='lg:hidden group w-full h-52 rounded-2xl gradient-banner px-4 py-4 flex flex-col justify-end bg-cover bg-center bg-no-repeat'
        style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/w780${oneMovie.backdrop_path})`
        }}
        >
            <div className='flex w-full flex-col h-28 justify-between'>
                <span className='w-32 border border-[#FFFFFF47] px-3 py-1 rounded-3xl flex gap-2 items-center'>
                    <img className='w-4 h-4' src={star} alt="" />
                    <p className='text-sm font-semibold'>FEATURED</p>
                </span>

                <div className='w-full flex justify-between items-end'>
                    <div className='flex flex-col gap-1'>
                        <h2 className='text-2xl font-extrabold'>{oneMovie.title}</h2>
                        <p className='text-sm text-[#FFFFFFBF] font-medium'> {oneMovie.release_date?.split('-')[0]} · {movieGenre[0]?.name} {movieGenre[1] && `/ ${movieGenre[1].name}`} · 2h 46m</p>
                    </div>

                    <button className='w-12 h-12 cursor-pointer rounded-3xl bg-primary flex justify-center items-center'>
                        <img className='w-6 h-6' src={playIcon} alt="" />
                    </button>
                </div>
            </div>
        </div>

        <div
        className='hidden lg:flex items-center justify-between gap-8 w-full rounded-2xl overflow-hidden px-10 py-10 xl:px-16 xl:py-8 transition-transform duration-300 hover:scale-[1.005]'
        style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 60%, #111827 100%)'
        }}
        >
            <div className='flex flex-col gap-5 max-w-xl'>
                <span className='w-fit border border-white/20 px-4 py-1.5 rounded-full flex gap-2 items-center'>
                    <img className='w-3.5 h-3.5' src={star} alt="" />
                    <p className='text-xs font-semibold uppercase tracking-wider text-white/80'>Featured Today</p>
                </span>

                <h2 className='text-5xl xl:text-6xl font-extrabold leading-[1.05]'>{oneMovie.title}</h2>

                <p className='text-base text-white/60 font-medium'>
                    {oneMovie.release_date?.split('-')[0]}
                    {genresLine && ` · ${genresLine}`} · 2h 46m
                </p>

                <div className='flex items-center gap-2 text-base'>
                    <img className='w-5 h-5' src={star} alt="" />
                    <span className='font-bold text-white'>{oneMovie.vote_average?.toFixed(1)} / 10</span>
                    <span className='text-white/50'>· {formatVotes(oneMovie.vote_count)} votes</span>
                </div>

                <p className='text-base text-white/60 leading-relaxed line-clamp-2 max-w-xl'>
                    {oneMovie.overview}
                </p>

                <div className='flex items-center gap-3 mt-2'>
                    <span className='flex items-center gap-2 bg-primary hover:bg-primary-hover transition-colors rounded-full px-6 py-3'>
                        <svg className='w-5 h-5 text-black' viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        <span className='text-black font-bold text-sm'>Watch Trailer</span>
                    </span>
                    <span className='flex items-center gap-2 border border-white/20 hover:bg-white/5 transition-colors rounded-full px-6 py-3'>
                        <svg className='w-5 h-5 text-white' viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        <span className='text-white font-semibold text-sm'>Add to Watchlist</span>
                    </span>
                </div>
            </div>

            <div className='shrink-0 w-56 xl:w-60 aspect-[2/3] rounded-2xl overflow-hidden bg-tabbar shadow-poster'>
                <img
                    className='w-full h-full object-cover'
                    src={`https://image.tmdb.org/t/p/w500${oneMovie.poster_path}`}
                    alt={oneMovie.title}
                />
            </div>
        </div>
    </Link>
  )
}

export default Hero
