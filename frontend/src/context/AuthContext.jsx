import { createContext, useContext, useMemo, useState } from 'react'
import api, { setAuthToken } from '../api'

const AuthContext = createContext(null)

const stored = localStorage.getItem('auth')
const initial = stored ? JSON.parse(stored) : { token: null, user: null }

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(initial)

  const register = async (email, password) => {
    await api.post('/auth/register', { email, password })
    await login(email, password)
  }

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    const next = { token: data.access_token, user: data.user }
    setAuth(next)
    localStorage.setItem('auth', JSON.stringify(next))
    setAuthToken(next.token)
  }

  const logout = () => {
    setAuth({ token: null, user: null })
    localStorage.removeItem('auth')
    setAuthToken(null)
  }

  const value = useMemo(
    () => ({
      token: auth.token,
      user: auth.user,
      isAdmin: auth.user?.is_admin || false,
      register,
      login,
      logout
    }),
    [auth]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

setAuthToken(initial.token)

export default AuthContext
