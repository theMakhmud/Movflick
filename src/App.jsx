import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import MoviePage from './pages/MoviePage'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import Layout from './component/Layout'
import Register from './pages/Register'

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}> 
        <Route path='/' element={<Home />} />
        <Route path='/movie/:id' element={<MoviePage />} />
        <Route path='/movie/' element={<MoviePage />} />
        <Route path='/favorites' element={<Favorites />} />
        <Route path='/profile' element={<Profile />} />
      </Route>

      <Route path='/auth' element={<Register />} />
    </Routes>
  )
}

export default App