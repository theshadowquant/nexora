# Nexora Deployment Guide

This document describes how to deploy Nexora to staging and production environments using Vercel or Docker container coordinates.

---

## ⚙️ Prerequisites

You must provision connections to these cloud services before starting:

1. **Database:** Postgres (e.g. Supabase, Neon, or Railway) supporting standard connection strings.
2. **Cache:** Upstash Redis rest endpoint and rest token.
3. **AI:** OpenAI API key.
4. **Storage:** Cloudinary account.
5. **Observability:** Sentry DSN key and PostHog keys.

---

## 🚀 Deployment Mode 1: Vercel (Recommended)

1. Connect the `main` branch of your GitHub repository to Vercel.
2. Configure all environment variables listed inside `.env.example` in Vercel settings.
3. Run database migrations during build:
   - Build Command: `npx prisma generate && npm run build`
   - Install Command: `npm install`
4. Deploy the project. The default staging URL will resemble `nexora-staging.vercel.app`.

---

## 🐳 Deployment Mode 2: Docker Containers

We provisioned a multi-stage Docker build matching minimal sizes.

1. **Build the image:**
   ```bash
   docker build -t nexora-app .
   ```

2. **Run the container locally:**
   ```bash
   docker run -p 3000:3000 --env-file .env nexora-app
   ```

3. **Verify readiness checks:**
   Open [http://localhost:3000/api/health/ready](http://localhost:3000/api/health/ready). It will return status HTTP 200 once connection to database passes.
