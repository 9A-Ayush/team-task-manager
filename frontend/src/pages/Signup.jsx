import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signup(form.name, form.email, form.password, form.role)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.msg || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-center">
      <div className="card" style={{ width: '100%', maxWidth: '420px' }}>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ color: '#6C63FF', fontSize: '28px' }}>TaskFlow</h1>
          <p style={{ color: '#94A3B8', marginTop: '6px' }}>Create your account 🚀</p>
        </div>

        {error && (
          <div style={{
            background: '#7F1D1D', color: '#FCA5A5',
            padding: '10px 14px', borderRadius: '8px', marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Full Name
            </label>
            <input
              type="text"
              placeholder="Ayush Kumar"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '13px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Join as
            </label>
            <select
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#94A3B8', fontSize: '14px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6C63FF' }}>Login</Link>
        </p>
      </div>
    </div>
  )
}