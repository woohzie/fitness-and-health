'use client';
import { useState } from 'react';
import Calculator from "./components/calculator";
import Nav from "./components/navbar";
import DisplayBmi from './components/display';

export default function Home() {

  const [data, setData] = useState();

  const calc = (data) => {
    setData(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  }

  return (
    <>
      <Nav />
      <div className="main-page">
        <Calculator className="main-page-calculator" onCalc={calc}/>
        <DisplayBmi className="main-page-display" data={data}/>
      </div>
    </>
  );
}
