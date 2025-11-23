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
      console.log('❌ Unauthorized coffee purchase attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { paymentId, toUsername, message, amount, transactionHash } = body;

    if (!paymentId || !toUsername || !amount) {
      console.log('❌ Missing required fields:', { paymentId, toUsername, amount });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Log the coffee purchase attempt
    console.log('☕ Coffee Purchase Initiated:', {
      timestamp: new Date().toISOString(),
      from: session.user.username,
      to: toUsername,
      amount: `$${amount}`,
      paymentId,
      hasMessage: !!message,
      messagePreview: message ? message.substring(0, 50) : null,
    });

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

    const savedMessage = result.rows[0];

    // Log successful save
    console.log('✅ Coffee Purchase Saved to Database:', {
      id: savedMessage.id,
      from: savedMessage.fromUsername,
      to: savedMessage.toUsername,
      amount: `$${savedMessage.amount}`,
      message: savedMessage.message || '(no message)',
      transactionHash: savedMessage.transactionHash || '(pending)',
      createdAt: savedMessage.createdAt,
    });

    return NextResponse.json(savedMessage);
  } catch (error) {
    console.error('❌ Error saving coffee purchase:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
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
