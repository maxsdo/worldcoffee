import { config } from 'dotenv';
import { sql } from '@vercel/postgres';

// Load environment variables
config();

async function verifyTables() {
  try {
    console.log('🔍 Checking database tables...\n');

    // Check if tables exist
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    console.log('✅ Found tables:');
    tables.rows.forEach(row => console.log(`  - ${row.table_name}`));

    // Check if required tables exist
    const tableNames = tables.rows.map(r => r.table_name);
    const required = ['messages', 'profile_descriptions', 'verifications'];
    const missing = required.filter(t => !tableNames.includes(t));

    if (missing.length > 0) {
      console.log('\n❌ Missing tables:', missing.join(', '));
      process.exit(1);
    }

    console.log('\n✅ All required tables exist!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifyTables();
