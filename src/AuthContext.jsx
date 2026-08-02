import React, { createContext, useContext, useEffect, useState } from 'react'
import { account } from './lib/appwrite'
import { ID } from 'appwrite'

const AuthContext = createContext()

const VERIFY_GRACE_MS = 3 * 60 * 60 * 1000
const VERIFY_URL = `${window.location.origin}/Movflick/verify-email`

const isVerifyExpired = (u) =>
    !u.emailVerification &&
    Date.now() > new Date(u.registration).getTime() + VERIFY_GRACE_MS

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [authLoading, setAuthLoading] = useState(true)

    useEffect(() => {
        const checkUser = async () => {
            try {
                const currentUser = await account.get()
                if (isVerifyExpired(currentUser)) {
                    await account.deleteSession('current')
                    setUser(null)
                } else {
                    setUser(currentUser)
                }
            } catch (error) {
                setUser(null)
            } finally {
                setAuthLoading(false)
            }
        }
        checkUser()
    }, [])

    useEffect(() => {
        if (!user || user.emailVerification) return

        const deadline = new Date(user.registration).getTime() + VERIFY_GRACE_MS
        const timeLeft = deadline - Date.now()

        if (timeLeft <= 0) {
            logout()
            return
        }
        const timer = setTimeout(() => logout(), timeLeft)
        return () => clearTimeout(timer)
    }, [user])

    const register = async (email, password, name) => {
        try {
            await account.create(ID.unique(), email, password, name)
        } catch (err) {
            // аккаунт мог остаться от прерванной регистрации — пробуем войти с теми же данными
            if (err.code !== 409) throw err
        }
        await account.createEmailPasswordSession(email, password)
        const currentUser = await account.get()
        if (!currentUser.emailVerification) {
            try {
                await account.createVerification({ url: VERIFY_URL })
            } catch (err) {
                console.error('Failed to send verification email:', err)
            }
        }
        setUser(currentUser)
        return currentUser
    }
     const login = async (email, password) => {
        await account.createEmailPasswordSession(email, password)
        const currentUser = await account.get()

        if (isVerifyExpired(currentUser)) {
            try {
                await account.createVerification({ url: VERIFY_URL })
            } catch (err) {
                console.error('Failed to resend verification email:', err)
            }
            await account.deleteSession('current')
            const err = new Error('Email не подтверждён. Мы отправили новое письмо — подтвердите его, чтобы войти.')
            err.code = 'email_unverified'
            throw err
        }

        setUser(currentUser)
        return currentUser
    }

    const logout = async () => {
        try {
            await account.deleteSession('current')
        } catch (error) {
            console.error(error)
        }
        setUser(null)
    }

    const resendVerification = async () => {
        await account.createVerification({ url: VERIFY_URL })
    }

    const refreshUser = async () => {
        try {
            const currentUser = await account.get()
            setUser(currentUser)
            return currentUser
        } catch (error) {
            setUser(null)
            return null
        }
    }

    const needsVerification = !!user && !user.emailVerification
    const verifyDeadline = needsVerification
        ? new Date(user.registration).getTime() + VERIFY_GRACE_MS
        : null

  return (
    <AuthContext.Provider value={{ user, authLoading, register, login, logout, needsVerification, verifyDeadline, resendVerification, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
