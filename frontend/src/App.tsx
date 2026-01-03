import { Routes, Route, Link } from 'react-router-dom'
import { JobListTable } from './components/JobListTable'
import { Companies } from './components/Companies.tsx'
import { Auth } from './components/Auth.tsx'
import { useState } from 'react'

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
  if (!token) {
    return <Auth onLogin={setToken} />
  }
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <nav className="navbar">
        <h1 className="nav-title">Page Vault</h1>
        <div className="nav-links">
          <Link to="/" className="nav-link">Jobs</Link>
          <Link to="/companies" className="nav-link">Companies</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<JobListTable />} />
        <Route path="/companies" element={<Companies />} />
      </Routes>
    </div>
  )
}
export default App
