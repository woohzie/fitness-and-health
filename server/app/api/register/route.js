import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req) {
  const body = await req.json();
  const { email, password, repassword } = body;

  let client;
  try {

    client = await pool.connect();

    if (email == '' || password == '' || repassword == '') {
        return NextResponse.json({ error: 'Field can\'t be empty' }, { status: 401 });
    }

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(String(email).toLowerCase())){
        return NextResponse.json({ error: 'Invalid email' }, { status: 401 });
    }

    if(password.length < 7) {
        return NextResponse.json({ error: 'Password msutn\'t be less than 8 characters' }, { status: 401 });
    }

    if(password !== repassword) {
        return NextResponse.json({ error: 'Password not matched' }, { status: 401 });
    }

    const result = await client.query('SELECT 1 FROM users WHERE email = $1 LIMIT 1', [email]);
    console.log(result);
    if (result.rowCount) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insert =
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email';

    const {
      rows: [newUser],
    } = await client.query(insert, [email, hashedPassword]);

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return NextResponse.json({ token });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  } finally {
    client.release();
  }
}