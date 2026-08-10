import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function ProjectDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [contractors, setContractors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: 'contractor',
    name: '',
    contact_info: '',
    contract_value: '',
    percentage: ''
  })

  useEffect(() => {
    fetchProjectDetails()
    fetchContractors()
  }, [id])

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`/api/projects/${id}`)
      setProject(response.data)
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  const fetchContractors = async () => {
    try {
      const response = await axios.get(`/api/projects/${id}/contractors`)
      setContractors(response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleAddContractor = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/contractors', {
        project_id: parseInt(id),
        type: formData.type,
        name: formData.name,
        contact_info: formData.contact_info,
        contract_value: parseFloat(formData.contract_value),
        percentage_or_fixed: formData.percentage ? 'percentage' : 'fixed',
        percentage: formData.percentage ? parseFloat(formData.percentage) : null
      })
      setFormData({ type: 'contractor', name: '', contact_info: '', contract_value: '', percentage: '' })
      setShowForm(false)
      fetchContractors()
    } catch (error) {
      alert('שגיאה: ' + error.message)
    }
  }

  const formatCurrency = (value) => {
    if (!value) return '₪0'
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0
    }).format(value)
  }

  const contractorTypeLabels = {
    'contractor': 'קבלן',
    'designer': 'מתכנן',
    'inspector': 'מפקח',
    'management': 'ניהול',
    'other': 'אחר'
  }

  if (loading) return <div className="loading">טוען...</div>
  if (!project) return <div className="error">פרויקט לא נמצא</div>

  return (
    <div className="project-details">
      <button onClick={() => navigate('/')} className="back-btn">← חזור לרשימה</button>
      
      <div className="project-header">
        <h1>{project.name}</h1>
        <p>מספר: {project.project_number}</p>
      </div>

      <div className="project-info">
        <div className="info-card">
          <h3>פרטי פרויקט</h3>
          <div className="info-row">
            <label>תקציב:</label>
            <span>{formatCurrency(project.total_budget_with_tax)}</span>
          </div>
          <div className="info-row">
            <label>מימון:</label>
            <span>{project.financing || '-'}</span>
          </div>
          <div className="info-row">
            <label>מענק:</label>
            <span>{formatCurrency(project.grant)}</span>
          </div>
          <div className="info-row">
            <label>הלוואה:</label>
            <span>{formatCurrency(project.loan)}</span>
          </div>
        </div>
      </div>

      <div className="contractors-section">
        <h2>קבלנים וגורמים</h2>
        
        <button 
          onClick={() => setShowForm(!showForm)}
          className="add-btn"
        >
          {showForm ? '✕ בטל' : '+ הוסף קבלן'}
        </button>

        {showForm && (
          <form onSubmit={handleAddContractor} className="contractor-form">
            <div className="form-row">
              <div className="form-group">
                <label>סוג</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="contractor">קבלן</option>
                  <option value="designer">מתכנן</option>
                  <option value="inspector">מפקח</option>
                  <option value="management">ניהול</option>
                  <option value="other">אחר</option>
                </select>
              </div>
              <div className="form-group">
                <label>שם *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>יצירת קשר</label>
                <input
                  type="text"
                  value={formData.contact_info}
                  onChange={(e) => setFormData({...formData, contact_info: e.target.value})}
                />
              </div>
              <div