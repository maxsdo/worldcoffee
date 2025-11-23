import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sql } from '@vercel/postgres';

// Get description for a specific user
interface GetParams {
  params: Promise<{
    username: string;
  }>;
}

export async function GET(request: Request, { params }: GetParams) {
  try {
    const { username } = await params;

    const result = await sql`
      SELECT description
      FROM profile_descriptions
      WHERE LOWER(username) = LOWER(${username})
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ description: '' });
    }

    return NextResponse.json({ description: result.rows[0].description });
  } catch (error) {
    console.error('Error fetching description:', error);
    return NextResponse.json(
      { error: 'Failed to fetch description' },
      { status: 500 }
    );
  }
}

// Update description (only for authenticated user's own profile)
export async function POST(request: Request, { params }: GetParams) {
  try {
    const session = await auth();
    const { username } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is updating their own profile
    if (session.user.username.toLowerCase() !== username.toLowerCase()) {
      return NextResponse.json(
        { error: 'Cannot update another user\'s description' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { description } = body;

    // Validate description length
    if (description && description.length > 240) {
      return NextResponse.json(
        { error: 'Description must be 240 characters or less' },
        { status: 400 }
      );
    }

    // Upsert profile description
    await sql`
      INSERT INTO profile_descriptions (username, description)
      VALUES (LOWER(${username}), ${description || ''})
      ON CONFLICT (username)
      DO UPDATE SET
        description = ${description || ''},
        updated_at = CURRENT_TIMESTAMP
    `;

    return NextResponse.json({ success: true, description: description || '' });
  } catch (error) {
    console.error('Error saving description:', error);
    return NextResponse.json(
      { error: 'Failed to save description' },
      { status: 500 }
    );
  }
}
