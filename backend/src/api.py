from fastapi import APIRouter, Depends
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
