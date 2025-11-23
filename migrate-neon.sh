#!/bin/bash
# Migration script for Neon database

echo "🚀 Running migration on Neon database..."

psql 'postgresql://neondb_owner:npg_Eo5jdxWe8gZi@ep-steep-forest-ab3u9u5j-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require' -f src/lib/db/schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Migration completed successfully!"
    echo ""
    echo "Tables created:"
    echo "  - messages (coffee purchases)"
    echo "  - profile_descriptions"
else
    echo "❌ Migration failed. Please check the error above."
    exit 1
fi
