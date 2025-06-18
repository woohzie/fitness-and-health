'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, TextInput } from "../components/basic";
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import api from '../lib/axios';

export default function SetUsername() {
    const router = useRouter();
    const [username, setUsername] = useState('');

    useEffect(() => {
        api.get('/api/me')
        .then(res => {
            if (res.data.username) {
                router.push('/');
            }
        })
        .catch(() => {
            router.push('/login');
        });
    }, []);

    let loadingToastId;
    const handleLogin = async () => {
        try {
            loadingToastId = toast.loading('Logging in...');

            const { data } = await api.post('/api/set-username', { username });
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
                <p className="title-logo">Fitness & Health</p>
                <p className="font-bold text-2xl">Nice to see you again</p>

                <TextInput 
                    label="Username"
                    type="text"
                    onChange={(e) => {setUsername(e.target.value)}}
                />

                <Button
                    onClick={handleLogin}
                >
                    Continue
                </Button>
                
            </div>
        </div>
    );
}