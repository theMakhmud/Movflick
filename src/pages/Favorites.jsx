import React, { useEffect } from 'react'
import { useState } from 'react'

const API_BASE_TMDB = "https://api.themoviedb.org/3"
const API_KEY = import.meta.env.VITE_TMDB_API

const API_OPTION = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}


const Favorites = () => {
  const [movieList, setMovieList] = useState(null)
  const [genre, setGenre] = useState()
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMovie = async () => {
      try {

        setIsLoading(true)
        setErrorMessage("")

        const [movieRes, genreRes] = await Promise.all([
          fetch(`${API_BASE_TMDB}/discover/movie?sort_by=popularity.desc`, API_OPTION),
          fetch(`${API_BASE_TMDB}/genre/movie/list`, API_OPTION)
        ])

        const movieDate = await movieRes.json()
        const genreDate = await genreRes.json()

        setMovieList(movieDate.results)
        setGenre(genreDate.genres)
      } catch (error) {
        console.log('failed catching movie')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovie()
  }, [])
  return (
    <div>Favorites</div>
  )
}

export default Favorites