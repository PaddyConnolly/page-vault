from dataclasses import dataclass
from datetime import datetime

@dataclass
class ParsedJob:
    page_id: int
    company_id: int
    title: str
    location: str
    url: str
    descr: str
    reqs: str
    preferred_reqs: str


@dataclass
class Job:
    id: int
    page_id: int
    company_id: int
    title: str
    location: str
    url: str
    status: str
    descr: str
    reqs: str
    preferred_reqs: str
    created: datetime

@dataclass
class JobDisplay:
    id: int
    title: str
    company: str
    location: str
    url: str
    status: str
