import React, { createContext, useContext, useState, useEffect } from 'react'
import { databases } from './lib/appwrite'
import { ID, Query, Permission, Role } from 'appwrite'
import { useAuth } from './AuthContext'

const DB_ID = import.meta.env.VITE_APPWRITE_DB_ID
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID

const FavoritesContext = createContext()

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth()

  const [items, setItems] = useState([])
  const [listsLoading, setListsLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      setItems([])
      return
    }

    const fetchLists = async () => {
      try {
        setListsLoading(true)
        const res = await databases.listDocuments(DB_ID, COLLECTION_ID, [
          Query.equal('userId', user.$id),
          Query.limit(200)
        ])

        setItems(res.documents.map(doc => ({
          docId: doc.$id,
          movieId: doc.movieId,
          listType: doc.listType,
          movie: JSON.parse(doc.movieData)
        })))
      } catch (err) {
        console.error('Failed loading lists:', err)
      } finally {
        setListsLoading(false)
      }
    }

    fetchLists()
  }, [user])

  const toggleInList = async (movie, listType) => {
    if (!user) return false

    const existing = items.find(
      i => i.movieId === movie.id && i.listType === listType
    )

    if (existing) {
      setItems(prev => prev.filter(i => i.docId !== existing.docId))
      try {
        await databases.deleteDocument(DB_ID, COLLECTION_ID, existing.docId)
      } catch (err) {
        console.error('Toggle failed:', err)
        setItems(prev => [...prev, existing])
      }
      return true
    }

    const tempId = `temp-${movie.id}-${listType}`
    setItems(prev => [...prev, { docId: tempId, movieId: movie.id, listType, movie }])

    try {
      const doc = await databases.createDocument(
        DB_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          movieId: movie.id,
          listType,
          movieData: JSON.stringify(movie)
        },
        [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id))
        ]
      )
      setItems(prev => prev.map(i => (i.docId === tempId ? { ...i, docId: doc.$id } : i)))
    } catch (err) {
      console.error('Toggle failed:', err)
      setItems(prev => prev.filter(i => i.docId !== tempId))
    }
    return true
  }


  const toggleFav = (movie) => toggleInList(movie, 'favorite')
  const toggleWatched = (movie) => toggleInList(movie, 'watched')
  const togglePlanned = (movie) => toggleInList(movie, 'planned')

  const isFavorites = (id) =>
    items.some(i => i.movieId === id && i.listType === 'favorite')
  const isWatched = (id) =>
    items.some(i => i.movieId === id && i.listType === 'watched')
  const isPlanned = (id) =>
    items.some(i => i.movieId === id && i.listType === 'planned')

  const favorites = items.filter(i => i.listType === 'favorite').map(i => i.movie)
  const watched = items.filter(i => i.listType === 'watched').map(i => i.movie)
  const planned = items.filter(i => i.listType === 'planned').map(i => i.movie)

  return (
    <FavoritesContext.Provider value={{
      favorites, toggleFav, isFavorites,
      watched, toggleWatched, isWatched,
      planned, togglePlanned, isPlanned,
      listsLoading
    }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => useContext(FavoritesContext)