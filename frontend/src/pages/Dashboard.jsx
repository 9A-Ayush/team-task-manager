import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function Dashboard() {
  const { user, API } = useAuth()
  const [tasks, setTasks]       = useState([])
  const [projects, setProjects] = useState([])

  useEffect(() => {
    axios.get(`${API}/tasks`).then(res => setTasks(res.data))
    axios.get(`${API}/projects`).then(res => setProjects(res.data))
  }, [])

  const todo       = tasks.filter(t => t.status === 'todo').length
  const inprogress = tasks.filter(t => t.status === 'inprogress').length
  const done       = tasks.filter(t => t.status === 'done').length
  const overdue    = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length

  const stats = [
    { label: 'Total Projects', value: projects.length, color: '#6C63FF' },
    { label: 'Total Tasks',    value: tasks.length,    color: '#38BDF8' },
    { label: 'In Progress',    value: inprogress,      color: '#F59E0B' },
    { label: 'Completed',      value: done,            color: '#4ADE80' },
    { label: 'To Do',          value: todo,            color: '#94A3B8' },
    { label: 'Overdue',        value: overdue,         color: '#F87171' },
  ]

  return (
    <div style={{ padding: '28px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '24px' }}>👋 Hey, {user?.name}!</h2>
        <p style={{ color: '#94A3B8', marginTop: '4px' }}>Here's your work overview</p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {stats.map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: s.color }}>
              {s.value}
            </div>
            <div style={{ color: '#94A3B8', fontSize: '13px', marginTop: '4px' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Tasks */}
      <div className="card">
        <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>📋 Recent Tasks</h3>
        {tasks.length === 0 ? (
          <p style={{ color: '#94A3B8', fontSize: '14px' }}>No tasks yet</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ color: '#94A3B8', textAlign: 'left' }}>
                <th style={{ padding: '8px 0' }}>Title</th>
                <th>Project</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.slice(0, 8).map(task => (
                <tr key={task._id} style={{ borderTop: '1px solid #334155' }}>
                  <td style={{ padding: '10px 0' }}>{task.title}</td>
                  <td style={{ color: '#94A3B8' }}>{task.project?.name}</td>
                  <td>
                    <span className={`badge badge-${task.status}`}>
                      {task.status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${task.priority}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td style={{ color: '#94A3B8' }}>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}