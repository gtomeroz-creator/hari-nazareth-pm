import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import ProjectsList from './pages/ProjectsList'
import ProjectDetails from './pages/ProjectDetails'
import CreateProject from './pages/CreateProject'

export default function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <h1>🏗️ ניהול פרויקטים - הרי נצרת</h1>
        </header>
        <Routes>
          <Route path="/" element={<ProjectsList />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/create" element={<CreateProject />} />
        </Routes>
      </div>
    </Router>
  )
}