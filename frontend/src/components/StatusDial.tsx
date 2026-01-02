import type { Job } from "../types.ts"

interface StatusDialProps {
  jobs: Job[]
}

const STATUS_ORDER = ["Logged", "Applied", "Interview", "Rejected", "Offer"]

const STATUS_COLORS: Record<string, string> = {
  Logged: "#E8E4DE",
  Applied: "#DDE8F0",
  Interview: "#E8DCF0",
  Rejected: "#F0E0DC",
  Offer: "#DCF0E0",
}

export function StatusDial({ jobs }: StatusDialProps) {
  const total = jobs.length
  const loggedCount = jobs.filter(j => j.status === "Logged").length
  const appliedCount = total - loggedCount

  // Count by status
  const counts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Build segments in fixed order
  const segments = STATUS_ORDER
    .filter(status => counts[status] > 0)
    .map(status => ({
      status,
      color: STATUS_COLORS[status],
      percentage: counts[status] / total,
    }))

  // Arc settings
  const radius = 45
  const strokeWidth = 5
  const center = 50
  const gapAngle = 90
  const totalArcAngle = 360 - gapAngle
  const startOffset = -225

  let currentAngle = startOffset

  const arcs = segments.map((segment, _) => {
    const angle = segment.percentage * totalArcAngle
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle

    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    const x1 = center + radius * Math.cos(startRad)
    const y1 = center + radius * Math.sin(startRad)
    const x2 = center + radius * Math.cos(endRad)
    const y2 = center + radius * Math.sin(endRad)

    const largeArc = angle > 180 ? 1 : 0

    const d = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`

    return (
      <path
        key={segment.status}
        d={d}
        fill="none"
        stroke={segment.color}
        strokeWidth={strokeWidth}
      />
    )
  })

  // Background arc
  const bgStartRad = (startOffset * Math.PI) / 180
  const bgEndRad = ((startOffset + totalArcAngle) * Math.PI) / 180
  const bgX1 = center + radius * Math.cos(bgStartRad)
  const bgY1 = center + radius * Math.sin(bgStartRad)
  const bgX2 = center + radius * Math.cos(bgEndRad)
  const bgY2 = center + radius * Math.sin(bgEndRad)
  const bgPath = `M ${bgX1} ${bgY1} A ${radius} ${radius} 0 1 1 ${bgX2} ${bgY2}`

  return (
    <div className="status-dial">
      <svg viewBox="0 0 100 100" width="300" height="300">
        {total === 0 && (
          <path
            d={bgPath}
            fill="none"
            stroke="#E8E4DE"
            strokeWidth={strokeWidth}
          />
        )}
        {arcs}
      </svg>
      <div className="status-dial-center">
        <span className="status-dial-count">{appliedCount}</span>
        <span className="status-dial-label">Applied</span>
      </div>
      <div className="status-dial-logged">{total} Logged</div>
    </div>
  )
}
