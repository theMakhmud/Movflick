import React from 'react'
import star from '../assets/Movflick-selection.png'
import playIcon from '../assets/Movflick-logo.png'
import { Link } from 'react-router-dom'

const Hero = ({movie, genreList}) => {
    const oneMovie = movie?.[0]
    if (!oneMovie) return null

    const id = oneMovie.genre_ids
    const movieGenre = genreList.filter(genre => id.includes(genre.id))
  return (
    <Link to={`/movie/${oneMovie.id}`}>
        <div 
        key={oneMovie.id}
        className='w-full h-52 rounded-2xl gradient-banner px-4 py-4 flex flex-col justify-end bg-contain bg-center bg-no-repeat'
        style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/w780${oneMovie.backdrop_path})`
        }}
        >
            <div className='flex w-full flex-col h-28 justify-between'>
                <span className='w-32 border border-[#FFFFFF47] px-3 py-1 rounded-3xl flex gap-2 items-center'>
                    <img className='w-4 h-4' src={star} alt="" />
                    <p className='text-sm font-semibold'>FEATURED</p>
                </span>

                <div className='w-full flex justify-between'>
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
    </Link>
  )
}

export default Hero