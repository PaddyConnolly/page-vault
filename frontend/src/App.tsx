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

export function JobListTable() {
  const jobs: { id: number; title: string; company: string; location: string; url: string; status: Status }[] = [
    { id: 1, title: "Software Engineer", company: "Amazon", location: "Seattle, WA", status: "Logged", url: "https://amazon.jobs/123" },
    { id: 2, title: "Frontend Dev", company: "Stripe", location: "San Francisco", status: "Applied", url: "https://stripe.com/jobs/456" },
    { id: 3, title: "ML Engineer", company: "Anthropic", location: "London", status: "Interviewing", url: "https://anthropic.com/jobs/789" },
    { id: 4, title: "DevOps Engineer", company: "Microsoft", location: "New York", status: "Rejected", url: "https://microsoft.com/jobs/910" },
    { id: 5, title: "Sales Engineer", company: "Netflix", location: "Dublin", status: "Accepted", url: "https://netflix.com/jobs/234" },
  ]
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
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '2rem', color: 'var(--primary)' }}>Page Vault</h1>
      <JobListTable />
    </div>
  )
}
export default App
