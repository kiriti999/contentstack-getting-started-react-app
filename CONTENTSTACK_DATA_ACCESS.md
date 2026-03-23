# Contentstack Data Access & Import Methods

> How internal teams can access and import data from your Contentstack account

## Overview

You have published content (forms, pages, etc.) in Contentstack. This document outlines all the ways an internal team member can access and import that data — from simplest to most advanced.

---

## Method 1: Content Delivery API (REST) — Read-only access

**Setup required**: None — already available out of the box.

The Delivery API serves **published** content. Anyone with your credentials can fetch data via HTTP.

### Credentials to share

| Credential | Value | Source |
|-----------|-------|--------|
| API Key | From `.env` → `VITE_CONTENTSTACK_API_KEY` | Stack → Settings → Tokens |
| Delivery Token | From `.env` → `VITE_CONTENTSTACK_DELIVERY_TOKEN` | Stack → Settings → Tokens |
| Environment | From `.env` → `VITE_CONTENTSTACK_ENVIRONMENT` | e.g., `dev`, `production` |
| Region | From `.env` → `VITE_CONTENTSTACK_REGION` | e.g., `US`, `EU` |

### Example: Fetch all PDF entries

```bash
curl -X GET "https://cdn.contentstack.io/v3/content_types/pdf/entries" \
  -H "api_key: YOUR_API_KEY" \
  -H "access_token: YOUR_DELIVERY_TOKEN" \
  -H "environment: dev"
```

### Example: Fetch all entries of a content type

```bash
curl -X GET "https://cdn.contentstack.io/v3/content_types/{content_type_uid}/entries" \
  -H "api_key: YOUR_API_KEY" \
  -H "access_token: YOUR_DELIVERY_TOKEN" \
  -H "environment: dev"
```

### Security

- Delivery Tokens are **read-only** — they cannot create, update, or delete content
- Safe to share internally
- Can be revoked anytime from Settings → Tokens

---

## Method 2: Content Management API (REST) — Full CRUD access

**Setup required**: Create a Management Token in Contentstack.

Use this when the internal team needs to **create, update, or delete** entries — not just read.

### Setup steps

1. Go to **Settings → Tokens → Management Tokens**
2. Click **Add Token**
3. Set permissions (read/write per content type)
4. Share the Management Token with the team

### Example: Fetch all entries

```bash
curl -X GET "https://api.contentstack.io/v3/content_types/pdf/entries" \
  -H "api_key: YOUR_API_KEY" \
  -H "authorization: YOUR_MANAGEMENT_TOKEN"
```

### Example: Create an entry

```bash
curl -X POST "https://api.contentstack.io/v3/content_types/pdf/entries" \
  -H "api_key: YOUR_API_KEY" \
  -H "authorization: YOUR_MANAGEMENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "entry": {
      "title": "New Form",
      "file": "ASSET_UID"
    }
  }'
```

### Security

- Management Tokens have **write access** — share only with trusted team members
- Scope permissions per content type for least-privilege access
- Can be revoked anytime

---

## Method 3: CLI Export/Import — Bulk transfer

**Setup required**: Install Contentstack CLI.

Best for one-time bulk migrations, backups, or sharing data as files.

### Install CLI

```bash
npm install -g @contentstack/cli
```

### Login

```bash
csdx auth:login
```

### Export entire stack

```bash
csdx cm:stacks:export \
  --stack-api-key YOUR_API_KEY \
  --data-dir ./contentstack-export
```

This exports:
- All content types (schemas)
- All entries (content)
- All assets (files, images, PDFs)
- Environments, webhooks, etc.

### Import into another stack

```bash
csdx cm:stacks:import \
  --stack-api-key TARGET_STACK_API_KEY \
  --data-dir ./contentstack-export
```

### Use cases

- Migrate content between stacks
- Create backups
- Share data offline as JSON files
- Set up staging/production environments

---

## Method 4: Webhooks — Real-time push on publish

**Setup required**: Configure webhook in Contentstack + have a receiving endpoint.

Contentstack sends an HTTP POST to your endpoint whenever content is published, updated, or deleted.

### Setup steps

1. Go to **Settings → Webhooks** → **Add Webhook**
2. Set the **URL** to your internal API endpoint (e.g., `https://internal-api.company.com/contentstack-webhook`)
3. Choose **triggers**: Entry Published, Entry Updated, etc.
4. Optionally filter by content type (e.g., only `pdf`)
5. Save and enable

### Webhook payload example

```json
{
  "event": "publish",
  "content_type": {
    "uid": "pdf",
    "title": "PDF"
  },
  "entry": {
    "uid": "blt1234567890",
    "title": "Application Form",
    "file": {
      "url": "https://assets.contentstack.io/...",
      "filename": "form.pdf"
    }
  },
  "environment": "dev"
}
```

### Use cases

- Sync published forms to an internal database in real-time
- Trigger workflows (e.g., notify team, process form)
- Keep external systems in sync without polling

---

## Method 5: DataSync — Local database sync

**Setup required**: Node.js server running DataSync SDK.

Contentstack DataSync syncs published content to a **local database** (MongoDB or filesystem), reducing API calls by serving from local storage.

### Documentation

- [About Contentstack DataSync](https://www.contentstack.com/docs/developers/develop-apps-with-datasync/about-contentstack-datasync)
- [Get Started with DataSync](https://www.contentstack.com/docs/developers/develop-apps-with-datasync/get-started-with-contentstack-datasync)

### How it works

1. Initial sync: pulls all published content into local storage
2. Subsequent syncs: uses Contentstack's Sync API to fetch only changes (delta sync)
3. Supports MongoDB, filesystem, or custom storage connectors

### When to use

- High-traffic applications needing low-latency reads
- Offline-capable applications
- Reducing Contentstack API call volume

### When NOT to use

- Small-scale projects (< 1000 API calls/day) — REST API is simpler
- When real-time freshness matters more than performance

---

## Recommendation Matrix

| Scenario | Best method |
|----------|------------|
| Internal team wants to **read/browse** published forms | **Method 1** — Delivery API |
| Internal team needs to **edit/create** content programmatically | **Method 2** — Management API |
| One-time **bulk export** of all forms | **Method 3** — CLI Export |
| **Migrate** forms to another Contentstack stack | **Method 3** — CLI Import |
| **Auto-sync** when new forms are published | **Method 4** — Webhooks |
| High-traffic app needs **local caching** | **Method 5** — DataSync |
| Share a **simple read-only UI** for browsing | **Method 1** + this React app |

---

## What you need to expose

| Method | What to share |
|--------|--------------|
| Delivery API | API Key + Delivery Token + Environment (read-only, safe) |
| Management API | API Key + Management Token (write access, share carefully) |
| CLI | Login credentials or Management Token |
| Webhooks | Nothing — you configure the receiving endpoint |
| DataSync | API Key + Delivery Token + Sync Token |

**Key takeaway**: For read-only access, the Delivery Token credentials in your `.env` are sufficient. No additional setup or exposure is needed — the Contentstack Delivery API is already available.
