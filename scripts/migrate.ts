import { config } from 'dotenv';
import { sql } from '@vercel/postgres';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env file
config();

async function migrate() {
  try {
    console.log('🚀 Running database migration...\n');

    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'src/lib/db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // Split by semicolons and execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      console.log('Executing:', statement.substring(0, 60) + '...');
      await sql.query(statement);
    }

    console.log('\n✅ Migration completed successfully!\n');
    console.log('Tables created:');
    console.log('  - messages (coffee purchases with transaction details)');
    console.log('  - profile_descriptions (user bios)\n');

    // Verify tables exist
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    console.log('Verified tables in database:');
    tables.rows.forEach(row => console.log(`  ✓ ${row.table_name}`));

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('\nError details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    process.exit(1);
  }
}

migrate();
