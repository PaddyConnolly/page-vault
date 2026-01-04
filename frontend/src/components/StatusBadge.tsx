export type Status =
  | "Logged"
  | "Applied"
  | "Interviewing"
  | "Rejected"
  | "Accepted";

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const className = `status-badge status-${status.toLowerCase()}`;
  return <span className={className}>{status}</span>;
}
