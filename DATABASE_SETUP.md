# Database Setup Guide

This application uses Vercel Postgres for persistent data storage.

## Setting up Vercel Postgres

### 1. Add Postgres to your Vercel project

1. Go to your Vercel project dashboard
2. Navigate to the **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Follow the prompts to create your database

Vercel will automatically add the required environment variables to your project:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### 2. Run the database migration

After creating your Postgres database, you need to create the tables:

#### Option 1: Using Vercel Dashboard (Recommended)

1. Go to your Vercel project → Storage → Your Postgres database
2. Click on the **Query** tab
3. Copy and paste the contents of `src/lib/db/schema.sql`
4. Click **Run** to execute the migration

#### Option 2: Using the Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Pull environment variables from Vercel
vercel env pull .env.local

# Run the migration script (you'll need to implement this)
npx tsx src/lib/db/migrate.ts
```

### 3. Local Development

For local development, you have two options:

#### Option A: Use Vercel Postgres (Recommended)
Pull your environment variables from Vercel:
```bash
vercel env pull .env.local
```

#### Option B: Use a local Postgres instance
Install PostgreSQL locally and update your `.env.local`:
```env
POSTGRES_URL="postgresql://user:password@localhost:5432/worldcoffee"
```

Then run the schema from `src/lib/db/schema.sql` on your local database.

## Database Schema

### Tables

#### `messages`
Stores coffee purchase messages and transactions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| payment_id | TEXT | Payment reference ID |
| to_username | TEXT | Recipient username |
| from_username | TEXT | Sender username |
| from_profile_picture_url | TEXT | Sender's profile picture |
| message | TEXT | Optional message from sender |
| amount | TEXT | Amount in USDC |
| transaction_hash | TEXT | Blockchain transaction hash |
| created_at | TIMESTAMP | When the message was created |

**Indexes:**
- `idx_messages_to_username` - For fast lookups by recipient
- `idx_messages_created_at` - For sorted message lists

#### `profile_descriptions`
Stores user profile descriptions.

| Column | Type | Description |
|--------|------|-------------|
| username | TEXT | Primary key - user's username |
| description | TEXT | Profile description (max 240 chars) |
| updated_at | TIMESTAMP | When the description was last updated |

## Migration from In-Memory Storage

If you were previously using the in-memory storage (global variables), note that:
- All data will be lost on server restart with in-memory storage
- The new Postgres implementation persists data permanently
- No data migration is needed as the old in-memory storage is ephemeral

## Troubleshooting

### Connection Errors

If you see database connection errors:
1. Verify environment variables are set correctly
2. Check that your Vercel Postgres instance is active
3. For local development, ensure you've pulled the latest env vars with `vercel env pull`

### Table Not Found Errors

If you see "table does not exist" errors:
1. Make sure you've run the migration (see step 2 above)
2. Verify the tables exist in your database using the Vercel dashboard

### Permission Errors

Vercel Postgres automatically handles permissions. If you're using a local/custom Postgres instance, ensure your database user has CREATE, INSERT, SELECT, UPDATE permissions.
