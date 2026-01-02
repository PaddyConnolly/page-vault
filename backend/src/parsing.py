from src.db import get_db, get_pages
from src.models import ParsedJob
from bs4 import BeautifulSoup, Comment
import tldextract
import sqlite3


DBConnection = sqlite3.Connection 
Page = sqlite3.Row 


def get_page_url(page: Page) -> str:
    return str(page["url"])

def get_company_name_from_url(url: str) -> str:
    name = tldextract.extract(url).domain.title()
    return name

def get_company_id_from_url(conn: DBConnection, url: str) -> int | None:
    name = get_company_name_from_url(url) 
    cur = conn.cursor()
    cur.execute("SELECT id FROM company WHERE name = ?", (name,))
    row = cur.fetchone()

    if row:
        return int(row["id"])
    else:
        return None

def get_company_id_from_name(conn: DBConnection, name: str) -> int | None:
    cur = conn.cursor()
    cur.execute("SELECT id FROM company WHERE name = ?", (name,))
    row = cur.fetchone()

    if row:
        return int(row["id"])
    else:
        return None

def get_job_title(soup: BeautifulSoup, selector: str) -> str | None:
    title = soup.select_one(selector)
    if title:
        return title.text


def get_job_location(soup: BeautifulSoup, selector: str) -> str | None:
    location = soup.select_one(selector)
    if location:
        return location.text


def get_job_content(soup: BeautifulSoup, selector: str) -> str | None:
    content = soup.select_one(selector)
    if content:
        return content.text

def parse_content(content: str) -> tuple[str,...]:
    return (str("1"),str("2"),str("3"))

def trigger_company_creation(conn: DBConnection, name: str, selectors: list[str]) -> int:
    cur = conn.cursor()
    cur.execute("""
                INSERT INTO company (name, location_selector, header_selector, content_selector)
                VALUES (?, ?, ?, ?);
                """, (name, *selectors))
    conn.commit()
    if cur.lastrowid:
        return cur.lastrowid
    else:
        raise Exception("Couldn't insert new company")


def insert_job(conn: DBConnection, job: ParsedJob):
    cur = conn.cursor()
    cur.execute("""
    INSERT INTO job (page_id, company_id, title, location, url, descr, reqs, preferred_reqs)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    """,
    (job.page_id, job.company_id, job.title, job.location, job.url, job.descr, job.reqs, job.preferred_reqs))
    conn.commit()
    if cur.lastrowid:
        return cur.lastrowid
    else:
        raise Exception("Couldn't insert new job")

def insert_parsed(conn: DBConnection, html: str) -> int:
    cur = conn.cursor()
    cur.execute("INSERT INTO parsed (html) VALUES (?);", (html,))
    conn.commit()
    if cur.lastrowid:
        return cur.lastrowid
    else:
        raise Exception("Couldn't insert new parse")

def get_selectors_from_html(html: Page) -> list[str]:
    return ["ul.association-content li",".title","div.container > div > div > div.content"] 

def get_selectors_from_db(conn: DBConnection, company_id: int) -> list[str]:
    cur = conn.cursor()
    cur.execute("SELECT header_selector, location_selector, content_selector FROM company WHERE id = ?", (company_id,))
    row = cur.fetchone()
    return [row["header_selector"], row["location_selector"], row["content_selector"]]


def parse_page(page: Page):
    conn = get_db()
    if page:
        soup = BeautifulSoup(page["html"], 'html.parser')
        url = get_page_url(page)

    else:
        raise Exception("Failed to get Page")


    company_id = get_company_id_from_url(conn, url)

    if company_id is None:
        name = get_company_name_from_url(url)
        selectors = get_selectors_from_html(page)
        company_id = trigger_company_creation(conn, name, selectors)
        title = get_job_title(soup, selectors[0])
        location = get_job_location(soup, selectors[1])
        content = get_job_content(soup, selectors[2])
        if content:
            (descr, reqs, preferred_reqs) = parse_content(content)

        else:
            raise Exception("Bad request 1")
    

    else:
        title_selector, location_selector, content_selector = get_selectors_from_db(conn, company_id)
        title = get_job_title(soup, title_selector)
        location = get_job_location(soup, location_selector)
        content = get_job_content(soup, content_selector)
        if content:
            (descr, reqs, preferred_reqs) = parse_content(content)

        else:
            raise Exception("Bad request 2")
    

    if (title is not None and
        location is not None):
        page_id = insert_parsed(conn, str(page["html"]))
        job = ParsedJob(page_id=page_id, company_id=company_id, title=title, location=location, url=url, descr=descr, reqs=reqs, preferred_reqs=preferred_reqs)
        insert_job(conn, job)
    else:
        raise Exception("Bad Request")


    conn.close()

def parse_pages(conn: DBConnection):

    pages = get_pages(conn)
    if pages:
        for page in pages:
            parse_page(page)
    else:
        raise Exception("Failed to get pages from database")

