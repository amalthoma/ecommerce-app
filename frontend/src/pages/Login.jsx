import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          setError('Passwords do not match.')
          return
        }
        await register(email, password)
      } else {
        await login(email, password)
      }
      navigate('/products')
    } catch (err) {
      setError(mode === 'register' ? 'Registration failed. Try a different email.' : 'Login failed. Check your credentials.')
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-3xl">{mode === 'register' ? 'Create account' : 'Welcome back'}</h1>
      </div>
      <p className="mt-2 text-sm text-ink/70">
        {mode === 'register' ? 'Join the store to start shopping.' : 'Use your admin or customer account.'}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-ink/5 p-1 text-sm">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`rounded-lg px-3 py-2 ${mode === 'login' ? 'bg-white shadow' : 'text-ink/60'}`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode('register')}
          className={`rounded-lg px-3 py-2 ${mode === 'register' ? 'bg-white shadow' : 'text-ink/60'}`}
        >
          Register
        </button>
      </div>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input
          className="w-full rounded-xl border border-ink/20 px-4 py-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full rounded-xl border border-ink/20 px-4 py-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {mode === 'register' && (
          <input
            className="w-full rounded-xl border border-ink/20 px-4 py-3"
            placeholder="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full rounded-xl bg-ink px-4 py-3 text-white">
          {mode === 'register' ? 'Create account' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default Login
