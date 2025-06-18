import Image from 'next/image';
import { Button } from './basic';

export default function Card({src, onClick, children}) {
    return (
        <div className="flex flex-col justify-between items-center text-justify w-80 gap-10 h-full bg-white px-5 py-8 rounded-2xl shadow-md">
            <Image 
                src={src}
                width={100}
                height={10}
                alt="Image"
            />
            <div>
                {children}
            </div>
            <Button
                onClick={onClick}
                width={"auto"}
            >
                Subscribe
            </Button>
        </div>
    );
}