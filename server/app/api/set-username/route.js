import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(req) {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = auth.split(' ')[1];
  const { username } = await req.json();

  if (!username || username.length < 3) {
    return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
  }

  let client;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    client = await pool.connect();

    const takenRes = await client.query(
      'SELECT 1 FROM users WHERE username = $1 LIMIT 1',
      [username]
    );
    if (takenRes.rowCount) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      );
    }

    const updateRes = await client.query(
      `UPDATE users
         SET username = $1
       WHERE id = $2
         AND username IS NULL
       RETURNING id`,
      [username, payload.id]
    );

    console.log(username, payload.id, updateRes)

    if (!updateRes.rowCount) {
      return NextResponse.json(
        { error: 'Username already set or invalid user' },
        { status: 403 }
      );
    }

    const updatedUserPayload = {
        id: payload.id,
        username: username,
    };

    const newToken = jwt.sign(updatedUserPayload, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

    return NextResponse.json({ token: newToken });
  } catch (err) {
    console.error('set-username error:', err);
    return NextResponse.json(
      { error: err },
      { status: 500 }
    );
  } finally {
    client?.release();
  }
}

