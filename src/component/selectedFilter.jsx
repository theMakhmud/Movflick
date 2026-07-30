import React, { use, useEffect, useState } from 'react'
import star from '../assets/Movflick-selection.png'
import playIcon from '../assets/Movflick-logo.png'
import { useFavorites } from '../FavContext'
import MovieRow from './movieRow'




const Filtered = ({genreId, genreList, movieList}) => {

  const { toggleFav, isFavorites } = useFavorites()

  const [imgLoaded, setImgLoaded] = useState(false)
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