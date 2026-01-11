# 💼 Page Vault

A job application tracker with browser-based page capture.

<img src="frontend/src/assets/page-vault.png" alt="Screenshot" width="1000">

## Architecture

- 📚 Fullstack (React/FastAPI) web app for easy job applications and application tracking

- 🦊 Firefox extension for capturing and archiving webpage HTML via hotkey

- 🦀 Single-threaded HTTP server built using only Rust's standard library for archiving webpage HTML 

- 🔐 JWT-based authentication implemented from first principles

## Usage

Download the [extension](extension/page-vault.xpi) and go to Firefox -> Extensions -> Manage Extension -> Install Add-on from file

Access the site at http://localhost:5173 after:

```
make all
```

## Notes

Company detection and location parsing are currently hardcoded:

- Company names are extracted from URL domains (with special handling for job boards like workday)

- Locations are normalized by matching against a list of known cities

See [SUPPORTED_COMPANIES.md](SUPPORTED_COMPANIES.md) for the full list of configured companies (over 35+ tech companies currently configured).
