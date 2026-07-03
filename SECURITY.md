# Security Policy

This document details Nexora's vulnerability disclosure processes, sanitization protections, and rate-limiting limits.

---

## 🔒 Protections Checklist

- **SQL Injection:** Guarded via Prisma ORM parameterized values binding parameters.
- **XSS Attacks:** Script brackets are sanitized and escaped on the frontend layout.
- **Upload Protection:** Maximum size is restricted to 10MB; MIME validation blocks execution parameters.
- **Access Control:** User checks isolate endpoints based on roles (Student vs Admin).

---

## 📩 Reporting vulnerabilities

If you discover a potential vulnerability, do NOT open a public GitHub issue. Send reports directly to our team:

- **Email:** security@nexora.ai
- **Expectation:** We will acknowledge receipt of reports within 48 hours and coordinate patch updates.
