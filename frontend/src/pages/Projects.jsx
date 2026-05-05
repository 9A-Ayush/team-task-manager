import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function Projects() {
  const { user, API } = useAuth()
  const [projects, setProjects] = useState([])
  const [users, setUsers]       = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editProject, setEditProject] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', members: [] })
  const [error, setError] = useState('')

  const fetchProjects = () => axios.get(`${API}/projects`).then(res => setProjects(res.data))
  const fetchUsers    = () => axios.get(`${API}/auth/me`).then(() => {})

  useEffect(() => { fetchProjects() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editProject) {
        await axios.put(`${API}/projects/${editProject._id}`, form)
      } else {
        await axios.post(`${API}/projects`, form)
      }
      setForm({ name: '', description: '', members: [] })
      setShowForm(false)
      setEditProject(null)
      fetchProjects()
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return
    await axios.delete(`${API}/projects/${id}`)
    fetchProjects()
  }

  const handleEdit = (project) => {
    setEditProject(project)
    setForm({
      name: project.name,
      description: project.description || '',
      members: project.members.map(m => m._id)
    })
    setShowForm(true)
  }

  return (
    <div style={{ padding: '28px', maxWidth: '1000px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px' }}>📁 Projects</h2>
          <p style={{ color: '#94A3B8', fontSize: '14px', marginTop: '4px' }}>
            {projects.length} project{projects.length !== 1 ? 's' : ''} total
          </p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => { setShowForm(!showForm); setEditProject(null); setForm({ name: '', description: '', members: [] }) }}
            style={{ background: '#6C63FF', color: 'white', padding: '10px 20px' }}
          >
            {showForm ? '✕ Cancel' : '+ New Project'}
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {showForm && user?.role === 'admin' && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>
            {editProject ? '✏️ Edit Project' : '🆕 New Project'}
          </h3>
          {error && (
            <div style={{ background: '#7F1D1D', color: '#FCA5A5', padding: '10px', borderRadius: '8px', marginBottom: '12px', fontSize: '14px' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>Project Name</label>
              <input
                type="text"
                placeholder="e.g. Website Redesign"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>Description</label>
              <textarea
                placeholder="What is this project about?"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>
            <button type="submit" style={{ background: '#6C63FF', color: 'white', padding: '10px 24px' }}>
              {editProject ? 'Update Project' : 'Create Project'}
            </button>
          </form>
        </div>
      )}

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px', color: '#94A3B8' }}>
          <p style={{ fontSize: '40px' }}>📂</p>
          <p style={{ marginTop: '12px' }}>No projects yet</p>
          {user?.role === 'admin' && (
            <p style={{ fontSize: '13px', marginTop: '6px' }}>Click "New Project" to get started</p>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {projects.map(project => (
            <div key={project._id} className="card" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '16px', color: '#F1F5F9' }}>{project.name}</h3>
                {user?.role === 'admin' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEdit(project)}
                      style={{ background: '#1D4ED8', color: 'white', padding: '4px 10px', fontSize: '12px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="btn-danger"
                      style={{ padding: '4px 10px', fontSize: '12px' }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <p style={{ color: '#94A3B8', fontSize: '13px', margin: '10px 0' }}>
                {project.description || 'No description'}
              </p>

              <div style={{ borderTop: '1px solid #334155', paddingTop: '12px', marginTop: '12px' }}>
                <p style={{ fontSize: '12px', color: '#94A3B8' }}>
                  👤 Created by: <span style={{ color: '#F1F5F9' }}>{project.createdBy?.name}</span>
                </p>
                <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>
                  👥 Members: {project.members?.length > 0
                    ? project.members.map(m => m.name).join(', ')
                    : 'None assigned'}
                </p>
              </div>

              <p style={{ fontSize: '11px', color: '#475569', marginTop: '10px' }}>
                Created {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
