import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusDial } from "./StatusDial"
import type { Job } from "../types.ts"

export const mapCompanyLogo = (name: string) => {
  var logo = ""
  switch (name) {
    case "Datadog":
      logo = "datadoghq"
      break;
    case "Checkout.com":
      logo = "checkout"
      break;
    case "Starling":
      logo = "starlingbank"
      break;
    case "Modulr":
      logo = "modulrfinance"
      break;
    case "Millennium":
      logo = "mlp"
      break;
    case "HRT":
      logo = "hudsonrivertrading"
      break;
    case "Marshall Wace":
      logo = "mwam"
      break;
    case "Bank of America":
      logo = "bofa"
      break;
    default:
      logo = name.replace(/\s/g, "")
  }
  return logo.toLowerCase()
}


export function JobListTable() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [search, setSearch] = useState("")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null)

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase())
  )

  const handleSort = (column: string) => {
    if (sortColumn !== column) {
      setSortColumn(column)
      setSortDirection('asc')
    } else if (sortDirection === 'asc') {
      setSortDirection('desc')
    } else {
      setSortColumn(null)
      setSortDirection(null)
    }
  }
  const fetchJobs = () => {

    fetch("http://localhost:8000/jobs")
      .then(response => response.json())
      .then(data => setJobs(data))
  }

  const LIST_ORDER = ["Offer", "Interview", "Logged", "Applied", "Rejected"]

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    // Default sort by status if no column selected
    if (!sortColumn || !sortDirection) {
      return LIST_ORDER.indexOf(a.status) - LIST_ORDER.indexOf(b.status)
    }

    const aVal = a[sortColumn as keyof Job]
    const bVal = b[sortColumn as keyof Job]

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const deleteJob = (id: number) => {
    fetch(`http://localhost:8000/jobs/${id}`, { method: "DELETE" })
      .then(() => fetchJobs())
  }

  const updateStatus = (id: number, status: string) => {
    fetch(`http://localhost:8000/jobs/${id}?status=${status}`, { method: "PATCH" })
      .then(() => fetchJobs())
  }

  useEffect(() => {
    fetchJobs()
    const interval = setInterval(fetchJobs, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <StatusDial jobs={jobs} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-1rem' }}>
        <input
          type="text"
          className="search-input"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Table className="table">
        <TableHeader>
          <TableRow>
            <TableHead
              onClick={() => handleSort('title')}
              style={{ cursor: 'pointer' }}
            >
              Title {sortColumn === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead
              onClick={() => handleSort('company')}
              style={{ cursor: 'pointer' }}
            >
              Company {sortColumn === 'company' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead
              onClick={() => handleSort('location')}
              style={{ cursor: 'pointer' }}
            >
              Location {sortColumn === 'location' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead
              onClick={() => handleSort('status')}
              style={{ cursor: 'pointer' }}
            >
              Status {sortColumn === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedJobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell>{job.title}</TableCell>
              <TableCell>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <img
                    src={`../logos/${mapCompanyLogo(job.company)}.png`}
                    alt=""
                    style={{ width: '32px', height: '32px', borderRadius: '4px' }}
                    onError={(e) => e.currentTarget.style.display = 'none'}
                  />
                  {job.company}
                </div>
              </TableCell>
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
      </Table >
    </>
  )
}

