'use client';
import { useState } from 'react';
import GenderSelect from "./gender";
import { TextInput, Button } from './basic';

export default function Calculator({onCalc, className}) {
    const [selectedGender, setSelectedGender] = useState('');
    const [age, setAge] = useState();
    const [height, setHeight] = useState();
    const [weight, setWeight] = useState();

    const handleCalculate = () => {
        if (onCalc) {
            onCalc({
                gender: selectedGender,
                age: Math.abs(age),
                height: Math.abs(height),
                weight: Math.abs(weight),
            });
        }
    };

    return (
        <div className={`calculator w-100 flex flex-col justify-around ${className}`}>
            <h1 className="text-4xl font-bold">BMI Calculator</h1>
            <p className="text-s text-gray-500">Enter the values and click the calculate button to get result.</p>

            <div className="calculator-field-container py-10 flex flex-col gap-3">
                <p className="text-sm font-bold text-gray-700">Choose Gender</p>
                <div className="flex align-center gap-5">
                    <GenderSelect 
                        gender="Male"
                        onClick={(e) => setSelectedGender('Male')}
                        selected={selectedGender === 'Male'}
                    />
                    <GenderSelect 
                        gender="Female"
                        onClick={(e) => setSelectedGender('Female')}
                        selected={selectedGender === 'Female'}
                    />
                </div>
                <TextInput 
                    label="Age"
                    type="number"
                    pattern='\+d'
                    onChange={(e) => setAge(e.target.value)}
                />

                <TextInput 
                    label="Height"
                    type="number"
                    pattern='\+d'
                    onChange={(e) => setHeight(e.target.value)}
                />

                <TextInput 
                    label="Weight"
                    type="number"
                    pattern='\+d'
                    onChange={(e) => setWeight(e.target.value)}
                />
                
                <Button
                    width={"full"}
                    onClick={handleCalculate}
                >
                    Calculate
                </Button>
                    
            </div>
        </div>
    );
}