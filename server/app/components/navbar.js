'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Button } from "../components/basic";
import Link from 'next/link';

export default function Nav({children}) {
    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Chat AI', href: '/chat' },
        { name: 'Subscribe', href: '/subscribe' },
    ];

    const [user, setUser] = useState();
  
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser(payload);
                localStorage.setItem('username', payload.username);
            } catch (e) {
                console.error('Invalid token');
                localStorage.removeItem('token');
            }
        }
    }, []);

    return (
        <nav className="nav">
            <Link href="/" className="title-logo">
                Fitness & Health
            </Link>

            <ul className="page-nav">
                {navItems.map((item) => (
                <li key={item.href}>
                    <Link
                    href={item.href}
                    className={pathname === item.href ? 'active' : 'page-nav-button'}
                    >
                    {item.name}
                    </Link>
                </li>
                ))}
            </ul>

            {user ? 
            <div className='flex flex-row gap-3 items-center'>
            <p>Hi, {user.username}</p>
            <Button
                onClick={() => {
                    localStorage.removeItem('token');
                    router.push('/login');
                }}>
                Logout
            </Button>
            </div>
            : 
            <Button onClick={() => {router.push('/login');}}>Login</Button>}
        </nav>
    );
}
