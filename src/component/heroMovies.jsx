import React, { use, useEffect, useState } from 'react'
import star from '../assets/Movflick-selection.png'
import playIcon from '../assets/Movflick-logo.png'
import { useFavorites } from '../Context'




const HeroMovies = ({genreId, genreList, movieList}) => {

  const { toggleFav, isFavorites } = useFavorites()

  const [imgLoaded, setImgLoaded] = useState(false)
  const genre = genreList?.find(g => g.id === genreId)
  const selectMovie = genreId 
  ? movieList?.filter(movie => movie.genre_ids?.includes(genreId))
  : movieList

  return (
    <div className='flex flex-col gap-3'>
      <span>
        <h2 className='text-lg'>{genre?.name} Movies</h2>
      </span>

      <div className='grid  grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>

        {selectMovie?.length === 0 ? (
          <div className="col-span-2 flex flex-col items-center justify-center text-center min-h-[60vh] w-full px-4">
            <div className="mb-5 flex h-20 w-20 col-start-auto items-center justify-center rounded-full bg-white/5">
              <svg className="h-10 w-10 text-white/40" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.2 6 3 11l-.9-2.4c-.3-1 .3-2.1 1.3-2.4l13.2-4c1-.3 2.1.3 2.4 1.3Z" />
                <path d="m6.2 5.3 3.1 3.9M12.4 3.4l3.1 4M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
              </svg>
            </div>

            <h3 className="mb-1 text-lg font-bold text-white">Ничего не найдено</h3>
            <p className="max-w-xs text-sm text-white/50">
              Попробуйте изменить запрос или выбрать другой жанр
            </p>
          </div>
        ) : (
          selectMovie?.map( (movie) => {
          const genreName = genreList?.find(genre => genre.id === movie.genre_ids?.[0])?.name
          const date = movie.release_date?.split('-')[0]

          return (
            <div
            key={movie.id}
            className='flex flex-col bg-tabbar rounded-xl overflow-hidden'>
              <div 
              className='relative aspect-[5/6] bg-primary bg-center bg-cover'>
                {!imgLoaded && (
                  <div className='absolute inset-0 flex items-center justify-center bg-neutral-800 animate-pulse'>
                    <div className='w-8 h-8 rounded-full border-2 border-white/20 border-t-primary animate-spin' />
                  </div>
                )}

                {movie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    onLoad={() => setImgLoaded(true)}
                    className={`w-full h-full aspect-[5/6] object-cover transition-opacity duration-500 ${
                      imgLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                )}
                <div className='absolute inset-x-0 top-0 flex items-start justify-between px-2 py-2'>
                  <span className='bg-base flex items-center gap-1 rounded-2xl py-0.5 px-2'>
                    <img className='size-3' src={star} alt="" />
                    <p className='text-xs font-semibold'>{movie.vote_average.toFixed(1)}</p>
                  </span>
                  <button
                    onClick={(e) => {
                        e.preventDefault()      
                        e.stopPropagation()     
                        toggleFav(movie)
                    }}
                    className='size-7 flex items-center justify-center rounded-full bg-base'>
                    <svg className={`size-4 ${isFavorites(movie.id) ? 'text-primary' : 'text-white'}`} fill={isFavorites(movie.id) ? 'currentColor' : 'none'} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className=' px-2 py-2 '>
                <h2 className='text-sm font-semibold'>{movie.title}</h2>
                <div class="text-sm text-gray font-medium">{genreName} · {date}</div>
              </div>
            </div>
          )
        })
        )}
      </div>
    </div>
  )


}

export default HeroMovies