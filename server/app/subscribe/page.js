'use client';
import Nav from '../components/navbar';
import Image from 'next/image';
import Card from '../components/card';
import api from '../lib/axios';
import { useRouter } from 'next/navigation';

export default function Subscribe() {
    const router = useRouter();

    let loadingToastId;
    const handleSubscribe = async (plan) => {
        loadingToastId = toast.loading('Checking...');
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const { data } = await api.post(
                '/api/subscribe',
                { plan },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            router.push('/');
        } catch (err) {
            const message =
                err.response?.data?.error || err.message || 'Subscription failed';
            toast.dismiss(loadingToastId);
            toast.error(message);
        }
    };


    return (
    <>
        <Nav />
        <div className="subscribe-page bg-[#f9f7fb] min-h-screen py-12 px-4">
        <div className="flex justify-center mb-6">
            <Image 
            src="/images/image_3.png"
            alt="Subscribe"
            width={200}
            height={10}
            />
        </div>

        <h2 className="text-center text-2xl font-semibold mb-2">Go Premium for More Insights</h2>
        <p className="text-center text-gray-600 max-w-xl mx-auto mb-10">
            By subscribing to our Premium Plan, you'll unlock powerful tools to support your health journey.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card onClick={() => {handleSubscribe("1")}} src="/images/image_4.png">
            <div className="flex flex-col h-full">
                <p className="text-lg font-semibold">Talk to a Real Doctor</p>
                <p className="text-[#555]">Rp 50.000</p>
                <p className="text-sm text-gray-600 mt-2 flex-grow">
                We partner with certified medical professionals so you can consult directly about your BMI results and get the right guidance tailored to your condition.
                </p>
            </div>
            </Card>

            <Card onClick={() => {handleSubscribe("2")}} src="/images/image_5.png">
            <div className="flex flex-col h-full">
                <p className="text-lg font-semibold">Smart AI Health Assistant</p>
                <p className="text-[#555]">Rp 150.000</p>
                <p className="text-sm text-gray-600 mt-2">Recommended exercises based on your BMI</p>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-2 flex-grow">
                <li>Healthy eating tips and meal plans</li>
                <li>Lifestyle changes to reach a normal BMI</li>
                <li>Risk analysis of potential health conditions</li>
                </ul>
            </div>
            </Card>

            <Card onClick={() => {handleSubscribe("3")}} src="/images/image_6.png">
            <div className="flex flex-col h-full">
                <p className="text-lg font-semibold">Early Health Risk Prediction</p>
                <p className="text-[#555]">Rp 200.000</p>
                <p className="text-sm text-gray-600 mt-2 flex-grow">
                Using your BMI and additional optional data, our system can help predict potential health risks related to weight and suggest ways to prevent them early.
                </p>
            </div>
            </Card>
        </div>
        </div>
    </>
    );
}
