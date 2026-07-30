import React, { createContext, useContext, useEffect, useState } from 'react'
import { account } from './lib/appwrite'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [authLoading, setAuthLoading] = useState(true)

    useEffect(() => {
        const checkUser = async () => {
            try {
                const currentUser = await account.get()
                setUser(currentUser)
            } catch (error) {
                setUser(null)
            } finally {
                setAuthLoading(false)
            }
        }
        checkUser()
    }, [])
  return (
    <AuthContext.Provider value={{user, authLoading}}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
