from fastapi import APIRouter, Depends, HTTPException
from src.db import get_db_dep, get_jobs_for_display, delete_pages, JobDisplay, DBConnection
from src.parsing import parse_pages


router = APIRouter()

@router.get("/jobs")
def get_jobs(conn: DBConnection = Depends(get_db_dep)) -> list[JobDisplay]:
    return get_jobs_for_display(conn)

@router.post("/parse")
def parse(conn: DBConnection = Depends(get_db_dep)):
    parse_pages(conn)
    delete_pages(conn)
    get_jobs(conn)

@router.delete("/jobs/{job_id}")
def delete_job(job_id: int, conn: DBConnection = Depends(get_db_dep)):
    cur = conn.cursor()
    cur.execute("DELETE FROM job WHERE id = ?", (job_id,))
    conn.commit()
    if cur.rowcount == 0:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"deleted": job_id}


@router.patch("/jobs/{job_id}")
def update_job_status(job_id: int, status: str, conn: DBConnection = Depends(get_db_dep)):
    cur = conn.cursor()
    cur.execute("UPDATE job SET status = ? WHERE id = ?", (status, job_id))
    conn.commit()
    if cur.rowcount == 0:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"updated": job_id, "status": status}
