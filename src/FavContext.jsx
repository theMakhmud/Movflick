import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const FavContext = createContext()

export const Context = ({ children }) => {

    const { user } = useAuth()

    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('favorites')
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites))
    }, [favorites])

    const toggleFav = ((movie) => {
        if (!user) return false
        setFavorites((prev) => {
            const exists = prev.find(m => m.id === movie.id)
            return exists
            ? prev.filter(m => m.id !== movie.id)
            : [...prev, movie]
        })
        return true
    })

    const isFavorites = (id) => favorites.some(m => m.id === id)

    return (
        <FavContext.Provider value={{favorites, toggleFav, isFavorites}}>
            { children }
        </FavContext.Provider>
    )
}

export const useFavorites = () => useContext(FavContext)

