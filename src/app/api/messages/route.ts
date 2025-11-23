import { NextResponse } from 'next/server';
import { auth } from '@/auth';

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

// In-memory storage for messages (in production, use a database)
declare global {
  var coffeeMessages: Message[] | undefined;
}

if (!global.coffeeMessages) {
  global.coffeeMessages = [];
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

    // Create new message
    const newMessage: Message = {
      id: crypto.randomUUID(),
      paymentId,
      toUsername,
      fromUsername: session.user.username,
      fromProfilePictureUrl: session.user.profilePictureUrl,
      message: message || '',
      amount,
      transactionHash,
      createdAt: new Date().toISOString(),
    };

    if (!global.coffeeMessages) {
      global.coffeeMessages = [];
    }
    global.coffeeMessages.push(newMessage);

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json(
      { error: 'Failed to save message' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ messages: global.coffeeMessages || [] });
}
