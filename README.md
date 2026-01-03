# 💼 Page Vault

A job application tracker with browser-based page capture.

<img src="frontend/src/assets/page-vault.png" alt="Screenshot" width="1000">

## Architecture

- 🦊 Firefox extension for capturing and archiving webpage HTML via hotkey
- 🦀 Single-threaded HTTP server built using only Rust's standard library for archiving webpage HTML 

## Notes

Company detection and location parsing are currently hardcoded:
- Company names are extracted from URL domains (with special handling for job boards like workday)
- Locations are normalized by matching against a list of known cities

See [SUPPORTED_COMPANIES.md](SUPPORTED_COMPANIES.md) for the full list of configured companies (over 35+ tech companies currently configured).

## Status

🚧 Under construction 🚧
