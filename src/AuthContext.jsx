import React, { createContext, useContext, useEffect, useState } from 'react'
import { account } from './lib/appwrite'
import { ID } from 'appwrite'

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

    const register = async (email, password, name) => {
        await account.create(ID.unique(), email, password, name)
        await account.createEmailPasswordSession(email, password)
        const currentUser = await account.get() 
        setUser(currentUser)                     
        return currentUser
    }
     const login = async (email, password) => {
        await account.createEmailPasswordSession(email, password)
        const currentUser = await account.get()
        setUser(currentUser)                     
        return currentUser
    }

    const logout = async () => {
        await account.deleteSession('current')
        setUser(null)                            
    }
  return (
    <AuthContext.Provider value={{ user, authLoading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
