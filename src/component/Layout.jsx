import { NavLink, Outlet } from 'react-router-dom'
import React from 'react'
import TabBar from './tabBar'
import { useAuth } from '../AuthContext'
import playIcon from '../assets/Movflick-logo.png'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/movie', label: 'Discover' },
  { to: '/favorites', label: 'Favorites' },
  { to: '/profile', label: 'Profile' },
]

const DesktopHeader = () => {
  const { user } = useAuth()

  return (
    <header className='hidden lg:block sticky top-0 z-40 bg-base/80 backdrop-blur border-b border-white/5'>
      <div className='max-w-6xl mx-auto flex items-center justify-between px-6 h-16'>
        <NavLink to='/' className='flex items-center gap-2'>
          <div className='w-7 h-7 rounded-lg bg-primary flex justify-center items-center'>
            <img className='w-4 h-4' src={playIcon} alt='' />
          </div>
          <span className='text-white text-xl font-extrabold'>Mov<b className='text-primary lowercase'>Flick</b></span>
        </NavLink>

        <nav className='flex items-center gap-8'>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${isActive ? 'text-primary' : 'text-gray hover:text-white'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {user ? (
          <NavLink to='/profile' className='w-9 h-9 rounded-full gradient-brand flex justify-center items-center'>
            <p className='text-xs font-bold uppercase'>{user.name?.slice(0, 2) || 'U'}</p>
          </NavLink>
        ) : (
          <NavLink to='/auth' className='flex items-center gap-1.5 bg-primary rounded-full px-4 py-2 hover:bg-primary-hover transition-colors'>
            <span className='text-black font-bold text-sm'>Log In</span>
          </NavLink>
        )}
      </div>
    </header>
  )
}

const Layout = () => {
  return (
    <>
        <DesktopHeader />
        <Outlet />
        <TabBar />
    </>
  )
}

export default Layout
