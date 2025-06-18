'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton, Button, TextInput } from "../components/basic";
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import api from '../lib/axios';

export default function Register() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');

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
            const { data } = await api.post('/api/register', { email, password, repassword });

            localStorage.setItem('token', data.token);
            api.defaults.headers.Authorization = `Bearer ${data.token}`;

            router.push('/set-username');
        } catch (err) {
            const message =
                err.response?.data?.error || err.message || 'Register failed';
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
                    label="E-mail"
                    type="text"
                    onChange={(e) => {setEmail(e.target.value)}}
                />

                <TextInput 
                    label="Password"
                    type="password"
                    onChange={(e) => {setPassword(e.target.value)}}
                />

                <TextInput 
                    label="Confirm Password"
                    type="password"
                    onChange={(e) => {setRepassword(e.target.value)}}
                />

                <Button
                    onClick={handleLogin}
                >
                    Register
                </Button>

                <div className="flex flex-row gap-1 text-center">
                    <p>Do you have an account?</p>
                    <Link href="/login" className="colored-text">
                        Login now
                    </Link>
                </div>
                
            </div>
        </div>
    );
}