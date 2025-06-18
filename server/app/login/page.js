'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton, Button, TextInput } from '../components/basic';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import api from '../lib/axios';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      router.push('/');
    }
  }, [router]);

  let loadingToastId;
  const handleLogin = async () => {
    try {
      loadingToastId = toast.loading('Logging in...');
      const { data } = await api.post('/api/login', { username, password });

      localStorage.setItem('token', data.token);
      api.defaults.headers.Authorization = `Bearer ${data.token}`;

      toast.dismiss(loadingToastId);
      toast.success('Successfully logged in!');

      router.push('/');
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || 'Login failed';
      toast.dismiss(loadingToastId);
      toast.error(message);
    }
  };

  return (
    <div className="login min-h-screen">
      <Image
        src="/images/login.png"
        width={500}
        height={10}
        alt="Login"
      />
      <div className="flex flex-col gap-5 w-100">
        <div className="flex w-full items-center gap-3">
          <BackButton onClick={() => { router.push('/') }}/>
          <p className="title-logo">Fitness & Health</p>
        </div>
        <p className="font-bold text-2xl">Nice to see you again</p>

        <TextInput
          label="Username"
          type="text"
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextInput
          label="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={handleLogin}>Login</Button>

        <div className="flex flex-row gap-1 text-center">
          <p>Don't have account?</p>
          <Link href="/register" className="colored-text">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
}
