import { NextResponse } from 'next/server';
import { auth } from '@/auth';

interface ProfileDescription {
  username: string;
  description: string;
  updatedAt: string;
}

// In-memory storage for profile descriptions (in production, use a database)
declare global {
  var profileDescriptions: Map<string, ProfileDescription> | undefined;
}

if (!global.profileDescriptions) {
  global.profileDescriptions = new Map();
}

// Get description for a specific user
interface GetParams {
  params: Promise<{
    username: string;
  }>;
}

export async function GET(request: Request, { params }: GetParams) {
  try {
    const { username } = await params;
    const description = global.profileDescriptions?.get(username.toLowerCase());

    if (!description) {
      return NextResponse.json({ description: '' });
    }

    return NextResponse.json({ description: description.description });
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

    const profileDescription: ProfileDescription = {
      username: username.toLowerCase(),
      description: description || '',
      updatedAt: new Date().toISOString(),
    };

    global.profileDescriptions?.set(username.toLowerCase(), profileDescription);

    return NextResponse.json({ success: true, description: description || '' });
  } catch (error) {
    console.error('Error saving description:', error);
    return NextResponse.json(
      { error: 'Failed to save description' },
      { status: 500 }
    );
  }
}
