import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "./components/StatusBadge"
import type { Status } from "./components/StatusBadge"
import { useState, useEffect } from "react"


export function JobListTable() {
  const [jobs, setJobs] = useState<Job[]>([])

  const fetchJobs = () => {

    fetch("http://127.0.0.1:8000/jobs")
      .then(response => response.json())
      .then(data => setJobs(data))
  }

  const deleteJob = (id: number) => {
    fetch(`http://127.0.0.1:8000/jobs/${id}`, { method: "DELETE" })
      .then(() => fetchJobs())
  }

  const updateStatus = (id: number, status: string) => {
  fetch(`http://127.0.0.1:8000/jobs/${id}?status=${status}`, { method: "PATCH" })
    .then(() => fetchJobs())
  }

  useEffect(() => {
    fetchJobs()
    const interval = setInterval(fetchJobs, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Table className="table">
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job) => (
          <TableRow key={job.id}>
            <TableCell>{job.title}</TableCell>
            <TableCell>{job.company}</TableCell>
            <TableCell>{job.location}</TableCell>
            <TableCell>
              <select
                  className={`status-select status-${job.status.toLowerCase()}`}
                  value={job.status}
                  onChange={(e) => updateStatus(job.id, e.target.value)}
              >
                <option value="Logged">Logged</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Rejected">Rejected</option>
                <option value="Offer">Offer</option>
              </select>
            </TableCell>
            <TableCell>
              <a href={job.url} target="_blank" className="link-button">
                ↗
              </a>
            </TableCell>
            <TableCell>
              <button 
                className="delete-button"
                onClick={() => deleteJob(job.id)}
              >
                ×
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function App() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '2rem', color: 'var(--primary)' }}>Page Vault</h1>
      <JobListTable />
    </div>
  )
}
export default App
