import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sql } from '@vercel/postgres';

interface Message {
  id: string;
  paymentId: string;
  toUsername: string;
  fromUsername: string;
  fromProfilePictureUrl?: string;
  message: string;
  amount: string;
  transactionHash?: string;
  createdAt: string;
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { paymentId, toUsername, message, amount, transactionHash } = body;

    if (!paymentId || !toUsername || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert message into database
    const result = await sql`
      INSERT INTO messages (
        payment_id,
        to_username,
        from_username,
        from_profile_picture_url,
        message,
        amount,
        transaction_hash
      ) VALUES (
        ${paymentId},
        ${toUsername},
        ${session.user.username},
        ${session.user.profilePictureUrl || null},
        ${message || ''},
        ${amount},
        ${transactionHash || null}
      )
      RETURNING
        id,
        payment_id as "paymentId",
        to_username as "toUsername",
        from_username as "fromUsername",
        from_profile_picture_url as "fromProfilePictureUrl",
        message,
        amount,
        transaction_hash as "transactionHash",
        created_at as "createdAt"
    `;

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json(
      { error: 'Failed to save message' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
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
