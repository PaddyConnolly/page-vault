from fastapi import APIRouter
from src.db import get_db, get_jobs_for_display, delete_pages, JobDisplay
from src.parsing import parse_pages


router = APIRouter()

@router.get("/jobs")
def get_jobs() -> list[JobDisplay]:
    conn = get_db()
    jobs = get_jobs_for_display(conn)
    return jobs

@router.post("/parse")
def parse():
    parse_pages()
    delete_pages(get_db())
