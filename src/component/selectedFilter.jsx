import React from 'react'
import MovieRow from './movieRow'

const Filtered = ({genreId, genreList, movieList}) => {
  const genre = genreList?.find(g => g.id === genreId)
  const selectMovie = genreId
  ? movieList?.filter(movie => movie.genre_ids?.includes(genreId))
  : movieList

  return (
    <div className='flex flex-col gap-3'>
      <MovieRow title={genre ? `${genre?.name} Movies` : null} movieList={selectMovie} genreList={genreList} />
    </div>
  )
}

export default Filtered
