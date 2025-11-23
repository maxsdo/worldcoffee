import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

interface Params {
  params: Promise<{
    username: string;
  }>;
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { username } = await params;

    // Query messages for this user from database
    const result = await sql`
      SELECT
        id,
        payment_id as "paymentId",
        to_username as "toUsername",
        from_username as "fromUsername",
        from_profile_picture_url as "fromProfilePictureUrl",
        message,
        amount,
        transaction_hash as "transactionHash",
        created_at as "createdAt"
      FROM messages
      WHERE LOWER(to_username) = LOWER(${username})
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ messages: result.rows });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
