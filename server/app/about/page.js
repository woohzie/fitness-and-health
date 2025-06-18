'use client';
import { useRouter } from 'next/navigation';
import { Button } from "../components/basic";
import Image from 'next/image';
import Nav from '../components/navbar';

export default function About() {
  const router = useRouter();
  
  return (
    <>
      <Nav />
      <div className="flex flex-col about-container">
        <div className="about-1">
          <div className="flex flex-col gap-13">
            <div className="flex flex-col gap-3">
              <p className="font-bold text-3xl">Welcome to Fitness & Health!</p>
              <p className="w-105 text-[#807D7D]">We're here to help you understand your body better through fast, easy, and accurate BMI (Body Mass Index) calculation.</p>
            </div>
            <Button
              onClick={() => {router.push('/');}}
            >
              Let's Calculate!
            </Button>
          </div>
          <Image 
            src="/images/image_1.png"
            alt="Image 1"
            width={600}
            height={10}
            priority
          />
        </div>

        <div className="about-2">
          <p className="font-bold text-3xl">What is BMI and Why Does It Matter?</p>
          <p className="w-200 text-[#807D7D]">BMI is a simple indicator used to determine whether your weight is ideal for your height. By knowing your BMI, you can take the first step toward maintaining a healthy body and preventing chronic diseases like diabetes, hypertension, and heart problems.</p>
        </div>

        <div className="about-3">
          <Image 
            src="/images/image_2.png"
            alt="Image 2"
            width={500}
            height={10}
            priority
          />
          <div className="flex flex-col gap-3 w-150">
            <p className="font-bold text-3xl">Free Features</p>
            <p className="text-[#807D7D]">You can use our BMI calculator anytime without signing up. Just enter your height and weight, and your result will appear instantly! But… if you're looking for more than just a number, we offer premium features that can really make a difference. ✨</p>
          </div>
        </div>

        <div className="about-4">
          <div className="flex flex-col gap-13">
            <div className="flex flex-col gap-3">
              <p className="font-bold text-3xl">Go Premium for More Insights</p>
              <p className="w-105 text-[#807D7D]">By subscribing to our Premium Plan, you'll unlock powerful tools to support your health journey.</p>
            </div>
            <Button
              onClick={() => {router.push('/subscribe');}}
            >
              Subscribe
            </Button>
          </div>
          <Image 
            src="/images/image_3.png"
            alt="Image 3"
            width={200}
            height={10}
            priority
          />
        </div>
      </div>
    </>
  );
}