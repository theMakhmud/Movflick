import React from 'react'

const Genre = ({movieList, genreList,selectedGenre, setSelectedGenre}) => {
    const genre = movieList.flatMap(movie => movie.genre_ids)
    const id = [...new Set(genre)]

    const genreFilter = genreList.filter(genre => id.includes(genre.id))

    
  return (
    
    <div className='px-4 py-4  overflow-x-auto scrollbar-hide'>
        <ul className='flex gap-3 items-center text-[#9E9E9E] text-sm font-semibold'>
            <li
            onClick={() => setSelectedGenre(null)} className={`px-4 py-2 cursor-pointer hover:text-white rounded-3xl whitespace-nowrap ${
            selectedGenre === null ? 'bg-primary text-white'  : 'bg-card'
            }`}>All</li>
            {genreFilter.map(genre => (
                <li key={genre.id}
                    onClick={() => setSelectedGenre(genre.id)} 
                    className={`px-4 py-2 cursor-pointer rounded-3xl whitespace-nowrap hover:text-white ${
                    selectedGenre === genre.id ? 'bg-primary text-white' : 'bg-card'
            }  `}>{genre.name}</li>
            ))}
        </ul>
    </div>
  )
}

export default Genre