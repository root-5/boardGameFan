'use client'

import { useState } from 'react';

const counterMax = 9999;
const counterMin = -9999;

function ajustCounterValue(value: number): number {
    console.log(value);
    if (value > counterMax) {
        return counterMax;
    } else if (value < counterMin) {
        return counterMin;
    }
    return value;
}

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div
      className='text-5xl font-bold text-center text-white'
    >
      <p
        className='inline-block p-6 cursor-pointer transition hover:opacity-70 hover:translate-x-[-0.5rem] hover:scale-y-75'
        onClick={() => {
            setCount(ajustCounterValue(count - 1));
        }}
      >{"<"}</p>
      <input
        className='inline-block bg-transparent w-40 text-center'
        type='number'
        onChange={(e) => {
            if (e.target.value === '') {
                setCount(0);
                return;
            } else if (isNaN(Number(e.target.value))) {
                return;
            }
            setCount(ajustCounterValue(Number(e.target.value)));
        }}
        value={count}
      >
      </input>
      <p
        className='inline-block p-6 cursor-pointer transition hover:opacity-70 hover:translate-x-2 hover:scale-y-75'
        onClick={() => {
            setCount(ajustCounterValue(count + 1));
        }}
      >{">"}</p>
    </div>
  );
}