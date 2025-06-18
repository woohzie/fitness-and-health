'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/axios';
import Nav from '../components/navbar';
import ChatBox from '../components/chatbox';

export default function Chat() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            api.defaults.headers.Authorization = `Bearer ${token}`;
            router.push('/login');
        } else {
            api.get('/api/checkplan')
                .then(res => {
                    if (!res.data.success) {
                        router.push('/subscribe');
                    }
                })
                .catch(() => {
                    router.push('/login');
                });
        }
    }, [router]);

    return (
        <div className="flex flex-col h-screen w-screen">
            <Nav />
            <ChatBox />
        </div>
    );
}