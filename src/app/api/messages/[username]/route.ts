import { NextResponse } from 'next/server';

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

// Import from parent route (in production, use a shared database)
// For now, we'll use a global variable
declare global {
  var coffeeMessages: Message[] | undefined;
}

if (!global.coffeeMessages) {
  global.coffeeMessages = [];
}

interface Params {
  params: Promise<{
    username: string;
  }>;
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { username } = await params;

    // Filter messages for this user
    const userMessages = (global.coffeeMessages || [])
      .filter(msg => msg.toUsername.toLowerCase() === username.toLowerCase())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ messages: userMessages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
