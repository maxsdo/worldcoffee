#!/bin/bash
# Migration script for Vercel-integrated Neon database

echo "🚀 Running migration on Neon database..."

psql 'postgresql://neondb_owner:npg_LSywv9Nm3Ygh@ep-weathered-field-ab5em02t-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require' -f src/lib/db/schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Migration completed successfully!"
    echo ""
    echo "Tables created:"
    echo "  - messages (coffee purchases with transaction details)"
    echo "  - profile_descriptions (user bios)"
    echo ""
    echo "Your Vercel deployment will automatically use these tables!"
else
    echo "❌ Migration failed. Please check the error above."
    exit 1
fi
