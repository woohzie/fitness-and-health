import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(req) {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = auth.split(' ')[1];
  const { plan } = await req.json();

  let client;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    client = await pool.connect();

    const updateRes = await client.query(
      `UPDATE users
         SET plan = $1
       WHERE id = $2
       RETURNING id`,
      [plan, payload.id]
    );

    console.log(plan, payload.id, updateRes)

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('subscribe error:', err);
    return NextResponse.json(
      { error: err },
      { status: 500 }
    );
  } finally {
    client?.release();
  }
}

