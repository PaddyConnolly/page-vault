from contextlib import asynccontextmanager
from fastapi import FastAPI
from pathlib import Path

import sqlite3

DBConnection = sqlite3.Connection 
Page = sqlite3.Row 

def get_db():
    db_path = Path("~/.local/share/page-vault/page-vault.db").expanduser()
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn 

@asynccontextmanager
async def lifespan(_: FastAPI):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
                CREATE TABLE IF NOT EXISTS parsed (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                html TEXT NOT NULL,
                parsed_at TEXT DEFAULT CURRENT_TIMESTAMP)
                """)

    cur.execute("""
                CREATE TABLE IF NOT EXISTS company (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
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


def get_test_page(conn: DBConnection) -> Page | None:
    cur = conn.cursor()
    cur.execute("SELECT * FROM page ORDER BY scraped_at DESC;")
    page = cur.fetchone()
    return page
