from fastapi import APIRouter, Depends, HTTPException
from src.db import get_db_dep, get_jobs_for_display, delete_pages, JobDisplay, DBConnection
from src.parsing import parse_pages
from src.auth import get_current_user


router = APIRouter()


@router.get("/jobs")
def get_jobs(
    conn: DBConnection = Depends(get_db_dep),
    user_id: int = Depends(get_current_user)
) -> list[JobDisplay]:
    parse_pages(conn, user_id)
    delete_pages(conn)

    return get_jobs_for_display(conn, user_id)

@router.post("/parse")
def parse(conn: DBConnection = Depends(get_db_dep), user_id: int = Depends(get_current_user)):
    parse_pages(conn, user_id)
    delete_pages(conn)

@router.delete("/jobs/{job_id}")
def delete_job(job_id: int, conn: DBConnection = Depends(get_db_dep), user_id: int = Depends(get_current_user)):
    cur = conn.cursor()
    print(user_id)
    cur.execute("DELETE FROM job WHERE id = ? AND user_id = ?", (job_id,user_id))
    conn.commit()
    if cur.rowcount == 0:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"deleted": job_id}


@router.patch("/jobs/{job_id}")
def update_job_status(job_id: int, status: str, conn: DBConnection = Depends(get_db_dep), user_id: int = Depends(get_current_user)):
    cur = conn.cursor()
    cur.execute("UPDATE job SET status = ? WHERE id = ? AND user_id = ?", (status, job_id, user_id))
    conn.commit()
    if cur.rowcount == 0:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"updated": job_id, "status": status}

@router.get("/companies/{name}/careers")
def get_careers_url_for_company(name: str, conn: DBConnection = Depends(get_db_dep)):
    cur = conn.cursor()
    cur.execute("SELECT url FROM company WHERE name = ?", (name,))
    row = cur.fetchone()
    if not row["url"]:
        raise HTTPException(status_code=404, detail="Company not found")
    else:
        url: str = row["url"]
    return {"url": url}


@router.get("/companies/categories")
def get_company_categories(conn: DBConnection = Depends(get_db_dep)):
    cur = conn.cursor()
    cur.execute("SELECT name, type FROM company;")
    rows = cur.fetchall()
    if not rows:
        raise HTTPException(status_code=404, detail="No categories found")
    else:
        return rows

