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

  useEffect(() => {
    fetch("http://127.0.0.1:8000/jobs")
      .then(response => response.json())
      .then(data => setJobs(data))
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job) => (
          <TableRow key={job.id}>
            <TableCell>{job.title}</TableCell>
            <TableCell>{job.company}</TableCell>
            <TableCell>{job.location}</TableCell>
            <TableCell><StatusBadge status={job.status} /></TableCell>
            <TableCell>
              <a href={job.url} target="_blank" className="link-button">
                ↗
              </a>
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
