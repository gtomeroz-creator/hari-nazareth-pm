import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function CreateProject() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    project_number: '',
    total_budget_with_tax: '',
    financing: '',
    grant: '',
    loan: '',
    start_date: '',
    expected_end_date: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/projects', {
        ...formData,
        total_budget_with_tax: parseFloat(formData.total_budget_with_tax),
        grant: formData.grant ? parseFloat(formData.grant) : null,
        loan: formData.loan ? parseFloat(formData.loan) : null
      })
      alert('✓ פרויקט נוצר בהצלחה!')
      navigate('/')
    } catch (error) {
      alert('שגיאה: ' + error.message)
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <h2>פרויקט חדש</h2>
        
        <div className="form-row">
          <div className="form-group">
            <label>שם הפרויקט *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>מספר פרויקט *</label>
            <input type="text" name="project_number" value={formData.project_number} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>תקציב כולל מע"מ *</label>
            <input type="number" name="total_budget_with_tax" value={formData.total_budget_with_tax} onChange={handleChange} required step="0.01" />
          </div>
          <div className="form-group">
            <label>מימון</label>
            <input type="text" name="financing" value={formData.financing} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>מענק</label>
            <input type="number" name="grant" value={formData.grant} onChange={handleChange} step="0.01" />
          </div>
          <div className="form-group">
            <label>הלוואה</label>
            <input type="number" name="loan" value={formData.loan} onChange={handleChange} step="0.01" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>תאריך התחלה</label>
            <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>תאריך סיום</label>
            <input type="date" name="expected_end_date" value={formData.expected_end_date} onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className="submit-btn">צור פרויקט</button>
      </form>
    </div>
  )
}