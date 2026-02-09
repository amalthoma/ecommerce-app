import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/products')
    } catch (err) {
      setError('Login failed. Check your credentials.')
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="font-display text-3xl">Welcome back</h1>
      <p className="mt-2 text-sm text-ink/70">Use your admin or customer account.</p>
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
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full rounded-xl bg-ink px-4 py-3 text-white">Login</button>
      </form>
    </div>
  )
}

export default Login
