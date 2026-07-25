import React, { use, useEffect, useState } from 'react'
import Header from '../component/header'
import Search from '../component/search'
import Genre from '../component/genre'
import Hero from '../component/hero'
import Trend from '../component/rowTrend'
import Popular from '../component/popular'
import HeroMovies from '../component/heroMovies'
import Loading from '../component/loading'
import TabBar from '../component/tabBar'

const API_BASE_TMDB = "https://api.themoviedb.org/3"
const API_KEY = import.meta.env.VITE_TMDB_API

const API_OPTION = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [movieList, setMovieList] = useState([])
  const [genreList, setGenreList] = useState([])
  const [trendList, setTrendList] = useState([])
  const [popularList, setPopularList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchAll = async (quary = '') => {
    try { 
      setIsLoading(true)
      setErrorMessage('')

      const [allMovie, trend, popular, genre] = await Promise.all([
        fetch( quary 
          ? `${API_BASE_TMDB}/search/movie?query=${encodeURIComponent(quary)}`
          : `${API_BASE_TMDB}/discover/movie?sort_by=popularity.desc`, API_OPTION),
        fetch(`${API_BASE_TMDB}/trending/movie/week`, API_OPTION),
        fetch(`${API_BASE_TMDB}/movie/popular`, API_OPTION),
        fetch(`${API_BASE_TMDB}/genre/movie/list`, API_OPTION)
      ])

      const movieData = await allMovie.json()
      const trendData = await trend.json()
      const popularData = await popular.json()
      const genreData = await genre.json()

      setMovieList(movieData.results)
      setTrendList(trendData.results)
      setPopularList(popularData.results)
      setGenreList(genreData.genres)

    } catch (error) {
      console.error(`Failed fatching movie ${error}`)
      setErrorMessage('Error fatching Movie, Pleace try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect( () => {
    fetchAll(searchTerm)
    console.log(movieList)
  }, [searchTerm])

  return (
    <div className="wrapper">
      <Header />
      <Search value={searchTerm} setValue={setSearchTerm} />
      {/* <Genre selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} genreList={genreList} /> */}
       { !searchTerm.trim() && <Genre movieList={movieList} genreList={genreList} selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} /> }

      <main className='px-4 py-1 mb-18 flex flex-col gap-3'>
        {isLoading ? (
          <Loading />
        ) : errorMessage ? (
          <p className='text-danger'>{errorMessage}</p>
        ) : searchTerm.length >= 1 ? (
          <section>
            <HeroMovies genreList={genreList} movieList={movieList} />
          </section>
        ) : selectedGenre === null ? (
          <>
            <section>
              <Hero movie={movieList} genreList={genreList} />
            </section>
            <section className='pb-3 pt-1'>
              <Trend movieList={trendList} genreList={genreList} />
            </section>
            <section>
              <Popular movieList={popularList} genreList={genreList} />
            </section>
          </>
        ) : (
          <section>
            <HeroMovies genreId={selectedGenre} genreList={genreList} movieList={movieList} />
          </section>
        )}
      </main>
    </div>
  )
}

export default App