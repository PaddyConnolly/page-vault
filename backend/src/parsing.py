from src.db import get_db, get_pages
from src.models import ParsedJob
from bs4 import BeautifulSoup, Comment
import tldextract
import sqlite3


DBConnection = sqlite3.Connection 
Page = sqlite3.Row 


def get_clean_soup(page: Page):
    soup = BeautifulSoup(page["html"], 'html.parser')

    head = soup.find("head")
    if head:
        head.decompose()

    first_header = soup.find("header")
    if first_header:
        first_header.decompose()

    non_content_tags = ["script", "style", "iframe", "footer", "nav", "noscript", "link", "meta", "path", "svg", "br", "img", "option", "button", "select", "input", "form", "pre"]

    for tag_name in non_content_tags:
        for tag in soup.find_all(tag_name):
            tag.decompose()

    for comment in soup.find_all(string=lambda text: isinstance(text, Comment)):
        comment.extract()

    footer = soup.find("footer")
    if footer:
        footer.decompose()

    footer = soup.select(".footer")
    for tag in footer:
        tag.decompose()

    return soup

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

def get_job_title(soup: BeautifulSoup) -> str | None:
    title = soup.select_one(".title")
    if title:
        return title.text


def get_job_location(soup: BeautifulSoup) -> str | None:
    location = soup.select_one("ul.association-content li")
    if location:
        return location.text


def get_job_content(soup: BeautifulSoup) -> str | None:
    content = soup.select_one("div.container > div > div > div.content")
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

def parse_page(page: Page):
    conn = get_db()
    if page:
        soup = get_clean_soup(page)
        url = get_page_url(page)

    else:
        raise Exception("Failed to get Page")

    title = get_job_title(soup)
    company_id = get_company_id_from_url(conn, url)
    location = get_job_location(soup)
    content = get_job_content(soup)
    if content:
        (descr, reqs, preferred_reqs) = parse_content(content)

    else:
        raise Exception("Bad request 1")
 

    if company_id is None:
        name = get_company_name_from_url(url)
        selectors = ["ul.association-content li",".title","div.container > div > div > div.content"]
        company_id = trigger_company_creation(conn, name, selectors)

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

