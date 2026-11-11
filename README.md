# CollabDocs — Collaborative Document Workspace (MVP)

A modern collaborative document editor built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM (PostgreSQL / Neon)**, and **TipTap**.

## ✨ Features
- **Rich Text Authoring:** Powered by TipTap with formatting toolbar (Headings, Lists, Bold/Italic/Strike, Blockquotes, Code blocks, Undo/Redo) and debounced **autosave**.
- **File Import (`.txt` & `.md`):** Upload plain-text or Markdown files directly into editable rich-text documents with strict HTML sanitization (`isomorphic-dompurify`).
- **Granular RBAC Sharing:** Share documents by email with **Can Edit (`EDIT`)** or **View Only (`VIEW`)** permissions, enforced on both API routes and UI.
- **Instant Reviewer Sandbox:** Pre-seeded demo accounts (`reviewer@example.com`, `test@example.com`) with one-click user switching to test permissions immediately.

## 🚀 Quick Local Setup

1. **Install dependencies:**
   ```bash
   npm install