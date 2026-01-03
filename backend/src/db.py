from contextlib import asynccontextmanager
from fastapi import FastAPI
from pathlib import Path
from src.models import JobDisplay

import sqlite3

DBConnection = sqlite3.Connection 
Page = sqlite3.Row


def get_db():
    db_path = Path("~/.local/share/page-vault/page-vault.db").expanduser()
    conn = sqlite3.connect(db_path, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    conn.execute("PRAGMA journal_mode = WAL;")
    conn.execute("PRAGMA busy_timeout = 5000;")
    return conn 

def get_db_dep():
    conn = get_db()
    try:
        yield conn
    finally:
        conn.close()

@asynccontextmanager
async def lifespan(_: FastAPI):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
                CREATE TABLE IF NOT EXISTS user (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                created TEXT DEFAULT CURRENT_TIMESTAMP)
                """)

    cur.execute("""
                CREATE TABLE IF NOT EXISTS parsed (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                html TEXT NOT NULL,
                parsed_at TEXT DEFAULT CURRENT_TIMESTAMP)
                """)

    cur.execute("""
                CREATE TABLE IF NOT EXISTS company (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                url TEXT NOT NULL UNIQUE,
                type TEXT NOT NULL UNIQUE,
                name TEXT NOT NULL UNIQUE,
                location_selector TEXT,
                header_selector TEXT,
                content_selector TEXT NOT NULL)
                """)

    cur.execute("""
                CREATE TABLE IF NOT EXISTS job (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                page_id INTEGER NOT NULL REFERENCES parsed(id),
                company_id INTEGER NOT NULL REFERENCES company(id),
                title TEXT NOT NULL,
                location TEXT NOT NULL,
                url TEXT NOT NULL UNIQUE,
                status TEXT DEFAULT "Logged",
                descr TEXT,
                reqs TEXT,
                preferred_reqs TEXT,
                created TEXT DEFAULT CURRENT_TIMESTAMP)
                """)
    conn.commit()
    conn.close()
    yield


def get_pages(conn: DBConnection) -> list[Page] | None:
    cur = conn.cursor()
    cur.execute("SELECT * FROM page ORDER BY scraped_at DESC;")
    pages = cur.fetchall()
    return pages


def get_jobs_for_display(conn: DBConnection) -> list[JobDisplay]:
    cur = conn.cursor()
    cur.execute("""
        SELECT job.id, job.title, company.name as company, job.location, job.url, job.status
        FROM job JOIN company ON job.company_id = company.id;
                """)
    rows = cur.fetchall()
    jobs = [JobDisplay(**dict(row)) for row in rows]
    return jobs

def get_company_name(conn: DBConnection, id: int) -> str:
    cur = conn.cursor()
    cur.execute("SELECT name FROM company WHERE id = ?", (id,))
    row = cur.fetchone()
    name = row["name"]
    return name


def delete_pages(conn: DBConnection):
    cur = conn.cursor()
    cur.execute("DELETE FROM page;")
    conn.commit()
