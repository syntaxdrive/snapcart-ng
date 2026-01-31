---
description: Canonical workflow for managing Supabase SQL migrations and schema synchronization.
---

# Supabase SQL Workflow

This workflow defines the canonical way to push and pull SQL changes to/from Supabase using the Supabase CLI.

## Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) installed (or use `npx supabase`).
-  Authenticate with Supabase: `npx supabase login`

## 1. Setup (One-time)

If you haven't set up the project locally yet:

1.  **Initialize**:
    ```bash
    npx supabase init
    ```

2.  **Link to Remote Project**:
    You need your project Reference ID (e.g., from your project URL `https://<project-id>.supabase.co`).
    ```bash
    npx supabase link --project-ref <project-id>
    ```
    *You will be asked for your database password.*

## 2. Pulling Remote Changes (Remote -> Local)

When execution of SQL happens in the dashboard or by another team member, you need to sync your local schema.

1.  **Pull Schema**:
    ```bash
    npx supabase db pull
    ```
    This updates `supabase/migrations/<timestamp>_remote_schema.sql`.

## 3. Pushing Local Changes (Local -> Remote)

**The Golden Rule**: Do not edit database schema in the Supabase Dashboard if you are using this workflow. Create a migration file instead.

1.  **Create a Migration**:
    ```bash
    npx supabase migration new <description_of_change>
    ```
    Example: `npx supabase migration new create_profiles_table`

2.  **Edit the Migration File**:
    The file will be created in `supabase/migrations/`. Open it and write your SQL there.

3.  **Apply Migration (Push)**:
    ```bash
    npx supabase db push
    ```
    This applies any local pending migrations to the remote database.

## 4. Troubleshooting

-   **Schema Drift**: If `db push` fails because the remote database has changes not in your local logic:
    1.  `npx supabase db pull` (to get remote changes)
    2.  Check the generated migration file.
    3.  `npx supabase db push` again.

-   **Reset**: To reset your local environment (if running locally) to match remote:
    ```bash
    npx supabase db reset
    ```

## 5. Automation

For this project, the Project Reference ID is: `xgxgfzxtswlbfhyiuytl`
