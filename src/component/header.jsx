import React from 'react'
import playIcon from '../assets/Movflick-logo.png'
import { useAuth } from '../AuthContext'
import { Link } from 'react-router-dom'

const Header = () => {
    const { user } = useAuth()
    return (
        <header className='flex items-center py-4 px-4 lg:hidden'>
            <nav className='flex w-full justify-between'>
                <div className="flex gap-2">
                    <div className='w-7 h-7 rounded-lg bg-primary flex justify-center items-center'>
                        <img className='w-4 h-4' src={playIcon} alt="" />
                    </div>
                    <span className='text-white text-xl font-extrabold'>Mov<b className='text-primary lowercase'>Flick</b></span>
                </div>

                {user ? (
                    <div className='w-8 h-8 cursor-pointer rounded-full gradient-brand flex justify-center items-center'>
                        <p className='text-xs font-bold uppercase'>
                        {user.name?.slice(0, 2) || 'U'}
                        </p>
                    </div>
                ) : (
                    <Link to='/auth'>
                        <button className='flex items-center gap-1.5 bg-primary rounded-full px-4 py-2 cursor-pointer active:scale-95 transition-transform'>
                        <svg className='w-4 h-4 text-black' viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                            <polyline points="10 17 15 12 10 7" />
                            <line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                        <span className='text-black font-bold text-sm'>Log In</span>
                        </button>
                    </Link>
                )}

            </nav>
        </header>
    )
}

export default Header