import { sql } from '@vercel/postgres';
import * as fs from 'fs';
import * as path from 'path';

async function migrate() {
  try {
    console.log('Running database migrations...');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // Execute the schema
    await sql.query(schema);

    console.log('✅ Database migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

migrate();
