import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function Tasks() {
  const { user, API } = useAuth()
  const [tasks, setTasks] = useState([])
  const [trashedTasks, setTrashedTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [error, setError] = useState('')
  const [undoData, setUndoData] = useState(null)
  const [form, setForm] = useState({
    title: '', description: '', status: 'todo',
    priority: 'medium', dueDate: '', project: '', assignedTo: ''
  })

  const fetchAll = async () => {
    try {
      const requests = [
        axios.get(`${API}/tasks`),
        axios.get(`${API}/projects`),
        axios.get(`${API}/auth/users`)
      ]
      if (user?.role === 'admin') requests.push(axios.get(`${API}/tasks/trash`))
      const [t, p, u, trash] = await Promise.all(requests)
      setTasks(t.data)
      setProjects(p.data)
      setUsers(u.data)
      if (trash) setTrashedTasks(trash.data)
    } catch (err) {
      console.error('fetchAll error:', err.response?.data || err.message)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editTask) {
        await axios.put(`${API}/tasks/${editTask._id}`, form)
      } else {
        await axios.post(`${API}/tasks`, form)
      }
      setForm({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '', project: '', assignedTo: '' })
      setShowForm(false)
      setEditTask(null)
      fetchAll()
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Move this task to trash?')) return
    await axios.delete(`${API}/tasks/${id}`)
    fetchAll()
  }

  const handleRestore = async (id) => {
    await axios.put(`${API}/tasks/${id}/restore`)
    fetchAll()
  }

  const handlePermanentDelete = async (id) => {
    if (!window.confirm('Permanently delete this task? This cannot be undone.')) return
    await axios.delete(`${API}/tasks/${id}/permanent`)
    fetchAll()
  }

  const handleEdit = (task) => {
    setEditTask(task)
    setForm({
      title:       task.title,
      description: task.description || '',
      status:      task.status,
      priority:    task.priority,
      dueDate:     task.dueDate ? task.dueDate.split('T')[0] : '',
      project:     task.project?._id || '',
      assignedTo:  task.assignedTo?._id || ''
    })
    setShowForm(true)
  }

  const handleStatusChange = async (task, newStatus) => {
    const prevStatus = task.status
    await axios.put(`${API}/tasks/${task._id}`, { ...task, status: newStatus })
    setUndoData({ taskId: task._id, prevStatus })
    fetchAll()
  }

  const handleUndo = async () => {
    if (!undoData) return
    await axios.put(`${API}/tasks/${undoData.taskId}`, { status: undoData.prevStatus })
    setUndoData(null)
    fetchAll()
  }

  const filtered = filterStatus === 'all'
    ? tasks
    : tasks.filter(t => t.status === filterStatus)

  const isOverdue = (task) =>
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'

  return (
    <div style={{ padding: '28px', maxWidth: '1100px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px' }}>✅ Tasks</h2>
          <p style={{ color: '#94A3B8', fontSize: '14px', marginTop: '4px' }}>
            {filtered.length} task{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditTask(null)
              setForm({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '', project: '', assignedTo: '' })
            }}
            style={{ background: '#6C63FF', color: 'white', padding: '10px 20px' }}
          >
            {showForm ? '✕ Cancel' : '+ New Task'}
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {['all', 'todo', 'inprogress', 'done'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              background: filterStatus === s ? '#6C63FF' : '#1E293B',
              color: filterStatus === s ? 'white' : '#94A3B8',
              border: '1px solid #334155',
              padding: '7px 16px',
              fontSize: '13px'
            }}
          >
            {s === 'all' ? 'All' : s === 'inprogress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        {user?.role === 'admin' && (
          <button
            onClick={() => setFilterStatus('trash')}
            style={{
              background: filterStatus === 'trash' ? '#F87171' : '#1E293B',
              color: filterStatus === 'trash' ? 'white' : '#94A3B8',
              border: '1px solid #334155',
              padding: '7px 16px',
              fontSize: '13px',
              marginLeft: 'auto'
            }}
          >
            🗑️ Trash {trashedTasks.length > 0 && `(${trashedTasks.length})`}
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {showForm && user?.role === 'admin' && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>
            {editTask ? '✏️ Edit Task' : '🆕 New Task'}
          </h3>
          {error && (
            <div style={{ background: '#7F1D1D', color: '#FCA5A5', padding: '10px', borderRadius: '8px', marginBottom: '12px', fontSize: '14px' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Design homepage"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>Description</label>
                <textarea
                  placeholder="Task details..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>Project</label>
                <select
                  value={form.project}
                  onChange={e => setForm({ ...form, project: e.target.value })}
                  required
                >
                  <option value="">Select project</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>Assign To</label>
                <select
                  value={form.assignedTo}
                  onChange={e => setForm({ ...form, assignedTo: e.target.value })}
                >
                  <option value="">Select member</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>Priority</label>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={e => setForm({ ...form, dueDate: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="todo">To Do</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

            </div>
            <button type="submit" style={{ background: '#6C63FF', color: 'white', padding: '10px 24px', marginTop: '16px' }}>
              {editTask ? 'Update Task' : 'Create Task'}
            </button>
          </form>
        </div>
      )}

      {/* Tasks List */}
      {filterStatus === 'trash' ? (
        trashedTasks.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px', color: '#94A3B8' }}>
            <p style={{ fontSize: '40px' }}>🗑️</p>
            <p style={{ marginTop: '12px' }}>Trash is empty</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <p style={{ color: '#94A3B8', fontSize: '13px' }}>{trashedTasks.length} deleted task{trashedTasks.length !== 1 ? 's' : ''}</p>
              <button
                onClick={async () => {
                  if (!window.confirm('Permanently delete all trashed tasks?')) return
                  await Promise.all(trashedTasks.map(t => axios.delete(`${API}/tasks/${t._id}/permanent`)))
                  fetchAll()
                }}
                style={{ background: '#7F1D1D', color: '#FCA5A5', padding: '6px 14px', fontSize: '12px' }}
              >
                🗑️ Empty Trash
              </button>
            </div>
            {trashedTasks.map(task => (
              <div
                key={task._id}
                className="card"
                style={{ borderLeft: '4px solid #475569', opacity: 0.7 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '15px', textDecoration: 'line-through', color: '#64748B' }}>
                      {task.title}
                    </h3>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '12px', color: '#475569' }}>
                      <span>📁 {task.project?.name || '—'}</span>
                      <span>👤 {task.assignedTo?.name || 'Unassigned'}</span>
                      <span>🗑️ Deleted {new Date(task.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleRestore(task._id)}
                      style={{ background: '#166534', color: '#BBF7D0', padding: '6px 12px', fontSize: '12px' }}
                    >
                      ↩ Restore
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(task._id)}
                      className="btn-danger"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      Delete Forever
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px', color: '#94A3B8' }}>
          <p style={{ fontSize: '40px' }}>📋</p>
          <p style={{ marginTop: '12px' }}>No tasks found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(task => (
            <div
              key={task._id}
              className="card"
              style={{
                borderLeft: `4px solid ${
                  task.priority === 'high' ? '#F87171' :
                  task.priority === 'medium' ? '#F59E0B' : '#4ADE80'
                }`,
                opacity: task.status === 'done' ? 0.7 : 1
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <h3 style={{
                      fontSize: '15px',
                      textDecoration: task.status === 'done' ? 'line-through' : 'none',
                      color: task.status === 'done' ? '#64748B' : '#F1F5F9'
                    }}>
                      {task.title}
                    </h3>
                    <span className={`badge badge-${task.status}`}>
                      {task.status === 'inprogress' ? 'In Progress' : task.status}
                    </span>
                    <span className={`badge badge-${task.priority}`}>
                      {task.priority}
                    </span>
                    {isOverdue(task) && (
                      <span className="badge" style={{ background: '#7F1D1D', color: '#FCA5A5' }}>
                        ⚠️ Overdue
                      </span>
                    )}
                  </div>

                  {task.description && (
                    <p style={{ color: '#94A3B8', fontSize: '13px', marginTop: '6px' }}>
                      {task.description}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: '20px', marginTop: '10px', fontSize: '12px', color: '#64748B', flexWrap: 'wrap' }}>
                    <span>📁 {task.project?.name || '—'}</span>
                    <span>👤 {task.assignedTo?.name || 'Unassigned'}</span>
                    {task.dueDate && (
                      <span style={{ color: isOverdue(task) ? '#F87171' : '#64748B' }}>
                        📅 {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <select
                    value={task.status}
                    onChange={e => handleStatusChange(task, e.target.value)}
                    style={{ width: 'auto', padding: '6px 10px', fontSize: '12px' }}
                  >
                    <option value="todo">To Do</option>
                    <option value="inprogress">In Progress</option>
                    <option value="done">Done</option>
                  </select>

                  {user?.role === 'admin' && (
                    <>
                      <button
                        onClick={() => handleEdit(task)}
                        style={{ background: '#1D4ED8', color: 'white', padding: '6px 12px', fontSize: '12px' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="btn-danger"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Undo Toast */}
      {undoData && (
        <div style={{
          position: 'fixed', bottom: '28px', left: '50%', transform: 'translateX(-50%)',
          background: '#1E293B', border: '1px solid #334155', borderRadius: '10px',
          padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '14px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)', zIndex: 1000, fontSize: '14px', color: '#F1F5F9'
        }}>
          <span>Status updated</span>
          <button
            onClick={handleUndo}
            style={{
              background: '#6C63FF', color: 'white',
              padding: '6px 14px', fontSize: '13px', borderRadius: '6px', border: 'none', cursor: 'pointer'
            }}
          >
            ↩ Undo
          </button>
          <button
            onClick={() => setUndoData(null)}
            style={{ background: 'transparent', color: '#64748B', border: 'none', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}