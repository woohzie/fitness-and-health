'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function DisplayBmi({data = NaN, className}) {
    const [bmi, setBmi] = useState();

    useEffect(() => {
        if (data && data.weight && data.height) {
            const bmiRes = data.weight / ((data.height / 100) ** 2);
            setBmi(bmiRes);
            localStorage.setItem('bmi', bmiRes);
            console.log(localStorage.getItem('bmi'));
        }
    }, [data]);

    const getBgColor = (category) => {
        return {
            Underweight: "bg-blue-300",
            Normal: "bg-green-400",
            Overweight: "bg-yellow-400",
            Obese: "bg-red-400",
        }[category];
    };

    const getCategory = (bmi) => {
        if (bmi < 18.5) return "Underweight";
        if (bmi < 25) return "Normal";
        if (bmi < 30) return "Overweight";
        return "Obese";
    };

    const category = getCategory(bmi);
    const healthyMin = (18.5 * ((data.height / 100) ** 2)).toFixed(2);
    const healthyMax = (24.9 * ((data.height / 100) ** 2)).toFixed(2);
    console.log(healthyMin)
    
    return (
        <div className={`w-100 h-125 flex flex-col bg-[#F9FDFF] rounded-xl shadow-md p-6 ${className}`}>
            <p className="text-lg font-semibold text-gray-800 mb-1">Your result</p>
            <hr className="mb-4 border-gray-200" />
            
            {
                isNaN(bmi) ? (
                    <div className="pt-15 flex-col justifiy-center items-center text-center">
                        <Image 
                            src="/images/wait_result.png"
                            alt="no result"
                            width={500}
                            height={1}
                        />

                        <p className="mt-6 font-semibold text-gray-700">Your BMI is just a few clicks away.</p>
                        <p className="text-gray-500">Fill in your height and weight to see the result!</p>
                    </div>
                ) : (
                    <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 text-center">
                        <p className="text-sm text-gray-600 mb-4">
                            A BMI between 18.5 and 24.9 is considered normal weight, reducing the risk of weight related health issues.
                        </p>

                        <div className="text-md font-bold text-gray-700">Your BMI:</div>
                        <div className="py-3 text-5xl font-bold bg-gradient-to-r from-[#EB2CFC] to-[#62CCFA] bg-clip-text text-transparent">{bmi.toFixed(1)}</div>
                        <div className={`mt-1 inline-block px-3 py-1 text-xs ${getBgColor(category)} text-white rounded-full`}>{category}</div>

                        <div className="mt-4 flex justify-between items-center gap-1 text-xs">
                            <div className="h-2 flex-grow bg-blue-300 rounded"></div>
                            <div className="h-2 flex-grow bg-green-400 rounded"></div>
                            <div className="h-2 flex-grow bg-yellow-400 rounded"></div>
                            <div className="h-2 flex-grow bg-red-400 rounded"></div>
                        </div>

                        <div className="grid grid-cols-4 mt-6 text-sm font-medium text-gray-800">
                            <div>
                            <p className="text-lg font-bold bg-gradient-to-r from-[#EB2CFC] to-[#62CCFA] bg-clip-text text-transparent">{data.weight} kg</p>
                            <p className="text-gray-500 text-xs">Weight</p>
                            </div>
                            <div>
                            <p className="text-lg font-bold bg-gradient-to-r from-[#EB2CFC] to-[#62CCFA] bg-clip-text text-transparent">{data.height} cm</p>
                            <p className="text-gray-500 text-xs">Height</p>
                            </div>
                            <div>
                            <p className="text-lg font-bold bg-gradient-to-r from-[#EB2CFC] to-[#62CCFA] bg-clip-text text-transparent">{data.age}</p>
                            <p className="text-gray-500 text-xs">Age</p>
                            </div>
                            <div>
                            <p className="text-lg font-bold bg-gradient-to-r from-[#EB2CFC] to-[#62CCFA] bg-clip-text text-transparent">{data.gender}</p>
                            <p className="text-gray-500 text-xs">Gender</p>
                            </div>
                        </div>

                        <p className="mt-4 text-sm text-gray-600">
                            Healthy weight for the height:<br />
                            <span className="font-semibold font-bold bg-gradient-to-r from-[#EB2CFC] to-[#62CCFA] bg-clip-text text-transparent">{healthyMin} kg - {healthyMax} kg</span>
                        </p>
                        </div>
                )
            }

        </div>
    );
}