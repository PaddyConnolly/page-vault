import { Routes, Route, Link } from 'react-router-dom'
import { JobListTable } from './components/JobListTable'
import { Companies } from './components/Companies.tsx'

function App() {
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
