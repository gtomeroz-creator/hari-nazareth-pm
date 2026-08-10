import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function ProjectsList() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/projects')
      setProjects(response.data)
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  const formatCurrency = (value) => {
    if (!value) return '₪0'
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0
    }).format(value)
  }

  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('he-IL')
  }

  return (
    <div className="projects-list">
      <h2>רשימת פרויקטים ({projects.length})</h2>
      
      {loading ? (
        <p className="loading">טוען...</p>
      ) : projects.length === 0 ? (
        <p className="empty">אין פרויקטים עדיין</p>
      ) : (
        <div className="table-container">
          <table className="projects-table">
            <thead>
              <tr>
                <th>שם פרויקט</th>
                <th>מספר</th>
                <th>תקציב</th>
                <th>מימון</th>
                <th>תאריך התחלה</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id}>
                  <td className="project-name">{project.name}</td>
                  <td>{project.project_number}</td>
                  <td className="amount">{formatCurrency(project.total_budget_with_tax)}</td>
                  <td>{project.financing || '-'}</td>
                  <td>{formatDate(project.start_date)}</td>
                  <td>
                    <button 
                      onClick={() => navigate(`/project/${project.id}`)}
                      className="view-btn"
                    >
                      צפה בפרטים →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}