import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => ({
    color: location.pathname === path ? '#6C63FF' : '#94A3B8',
    fontWeight: location.pathname === path ? '600' : '400'
  })

  return (
    <nav style={{
      background: '#1E293B',
      borderBottom: '1px solid #334155',
      padding: '0 24px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <h2 style={{ color: '#6C63FF', fontSize: '20px' }}>TaskFlow</h2>
        <Link to="/" style={isActive('/')}>Dashboard</Link>
        <Link to="/projects" style={isActive('/projects')}>Projects</Link>
        <Link to="/tasks" style={isActive('/tasks')}>Tasks</Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ color: '#94A3B8', fontSize: '14px' }}>
          👤 {user?.name}
          <span style={{
            marginLeft: '8px',
            background: user?.role === 'admin' ? '#4C1D95' : '#1E3A5F',
            color: user?.role === 'admin' ? '#C4B5FD' : '#7DD3FC',
            padding: '2px 8px',
            borderRadius: '20px',
            fontSize: '11px'
          }}>
            {user?.role}
          </span>
        </span>
        <button
          onClick={handleLogout}
          style={{ background: '#334155', color: '#F1F5F9', padding: '8px 16px' }}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}