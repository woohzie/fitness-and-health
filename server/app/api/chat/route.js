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
    
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const client = await pool.connect();
        const result = await client.query('SELECT plan FROM users WHERE id = $1', [payload.id]);
    

        const plan = result.rows[0];
        if (!plan) throw new Error();

        console.log(plan.plan, result);

        const resp = Number(plan.plan) >= 2;

        if(!resp) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { message, userInfo, bmi, username } = body;

        userInfo.bmi = bmi;
        userInfo.username = username;

        if(Object.keys(userInfo).length === 0 || !bmi || !username ) {
            return NextResponse.json({ error: 'User data not found' }, { status: 404 });
        }

        const endpoint = 'http://ai_chatbot:5000/getans';
        const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
            body: JSON.stringify({ bmi_info: userInfo, message: message })
        });

        const data = await response.json();
        const answer = data.answer;

        const query = 'INSERT INTO chat_history (user_id, chat, answer) VALUES ($1, $2, $3) RETURNING *';
        const res = await pool.query(query, [payload.id, message, answer]);
        client.release();
        
        console.log(res);

        return NextResponse.json({ response: answer }, { status: 200 });

    } catch (err) {
        console.error('checkplan error: ', err);
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}
