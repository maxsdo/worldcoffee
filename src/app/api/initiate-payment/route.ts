import { NextResponse } from 'next/server';

// In-memory storage for payment intents (in production, use a database)
const paymentIntents = new Map<string, {
  id: string;
  toUsername: string;
  message: string;
  createdAt: string;
}>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { toUsername, message } = body;

    const uuid = crypto.randomUUID().replace(/-/g, '');

    // Store the payment intent
    paymentIntents.set(uuid, {
      id: uuid,
      toUsername,
      message: message || '',
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: uuid });
  } catch (error) {
    console.error('Error initiating payment:', error);
    return NextResponse.json(
      { error: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Payment ID required' }, { status: 400 });
  }

  const intent = paymentIntents.get(id);

  if (!intent) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
  }

  return NextResponse.json(intent);
}
