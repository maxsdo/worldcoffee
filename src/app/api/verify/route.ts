import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sql } from '@vercel/postgres';

interface VerifyRequest {
  payload: {
    nullifier_hash: string;
    merkle_root: string;
    proof: string;
    verification_level: string;
    status: string;
  };
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      console.log('❌ Unauthorized verification attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: VerifyRequest = await request.json();
    const { payload } = body;

    // Check if verification was successful
    if (payload.status !== 'success') {
      console.log('❌ Verification failed:', payload.status);
      return NextResponse.json(
        { error: 'Verification failed' },
        { status: 400 }
      );
    }

    // Check verification level - must be orb
    if (payload.verification_level !== 'orb') {
      console.log('❌ Invalid verification level:', payload.verification_level);
      return NextResponse.json(
        { error: 'Only orb verification is accepted' },
        { status: 400 }
      );
    }

    // Verify the proof with World ID backend
    const verifyResponse = await fetch('https://developer.worldcoin.org/api/v2/verify/app_81bdb04426c352ea509dcece674eaf48', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nullifier_hash: payload.nullifier_hash,
        merkle_root: payload.merkle_root,
        proof: payload.proof,
        verification_level: payload.verification_level,
        action: 'verify-human',
        signal: '',
      }),
    });

    if (!verifyResponse.ok) {
      const errorData = await verifyResponse.json();
      console.log('❌ World ID verification failed:', errorData);
      return NextResponse.json(
        { error: 'World ID verification failed', detail: errorData },
        { status: 400 }
      );
    }

    const verifyData = await verifyResponse.json();

    if (!verifyData.success) {
      console.log('❌ World ID proof verification failed');
      return NextResponse.json(
        { error: 'Invalid proof' },
        { status: 400 }
      );
    }

    console.log('✅ World ID proof verified successfully');

    // Check if nullifier hash already exists
    const existing = await sql`
      SELECT username FROM verifications
      WHERE nullifier_hash = ${payload.nullifier_hash}
    `;

    if (existing.rows.length > 0) {
      console.log('❌ Nullifier hash already used by:', existing.rows[0].username);
      return NextResponse.json(
        { error: 'This World ID has already been used for verification' },
        { status: 400 }
      );
    }

    // Log verification attempt
    console.log('🔐 World ID Verification:', {
      username: session.user.username,
      verification_level: payload.verification_level,
      nullifier_hash: payload.nullifier_hash.substring(0, 20) + '...',
      timestamp: new Date().toISOString(),
    });

    // Store verification in database
    const result = await sql`
      INSERT INTO verifications (
        username,
        verification_level,
        nullifier_hash,
        merkle_root,
        proof
      ) VALUES (
        LOWER(${session.user.username}),
        ${payload.verification_level},
        ${payload.nullifier_hash},
        ${payload.merkle_root},
        ${payload.proof}
      )
      ON CONFLICT (username)
      DO UPDATE SET
        verification_level = ${payload.verification_level},
        nullifier_hash = ${payload.nullifier_hash},
        merkle_root = ${payload.merkle_root},
        proof = ${payload.proof},
        verified_at = CURRENT_TIMESTAMP
      RETURNING
        username,
        verification_level as "verificationLevel",
        verified_at as "verifiedAt"
    `;

    const verification = result.rows[0];

    // Log successful verification
    console.log('✅ World ID Verification Successful:', {
      username: verification.username,
      verificationLevel: verification.verificationLevel,
      verifiedAt: verification.verifiedAt,
    });

    return NextResponse.json({
      success: true,
      verification,
    });
  } catch (error) {
    console.error('❌ Error saving verification:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: 'Failed to save verification' },
      { status: 500 }
    );
  }
}

// Get verification status for a user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username required' },
        { status: 400 }
      );
    }

    const result = await sql`
      SELECT
        username,
        verification_level as "verificationLevel",
        verified_at as "verifiedAt"
      FROM verifications
      WHERE LOWER(username) = LOWER(${username})
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ verified: false });
    }

    return NextResponse.json({
      verified: true,
      ...result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching verification:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verification' },
      { status: 500 }
    );
  }
}
