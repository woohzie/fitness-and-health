import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(req) {
    const auth = req.headers.get('authorization');
    if (!auth || !auth.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = auth.split(' ')[1];
    
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM chat_history WHERE user_id = $1 ORDER BY time ASC', [payload.id]);
        client.release();

        return NextResponse.json({ history: result.rows }, { status: 200 });
    } catch (err) {
        console.error('checkplan error: ', err);
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}
