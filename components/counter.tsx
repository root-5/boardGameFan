'use client'

import { useState } from 'react';

const counterMax = 99999;
const counterMin = -99999;

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
    <>
      <div
        className='p-4 w-56 h-56 text-center bg-gray-800'
      >
        <input
          className='inline-block w-44 bg-transparent text-5xl font-bold text-center outline-none translate-x-2'
          type="number"
          onChange={(e) => setCount(ajustCounterValue(parseInt(e.target.value)))}
          value={count}
        />
        <div>
          <div className='flex justify-center align-middle gap-2 text-base'>
            <div className=''>
              <div 
                className='px-2 cursor-pointer opacity-100 hover:opacity-70'
                onClick={() => {setCount(ajustCounterValue(count - 1))}}
              >
                {'<'}
              </div>
              <div 
                className='px-2 cursor-pointer opacity-100 hover:opacity-70'
                onClick={() => {setCount(ajustCounterValue(count - 10))}}
              >
                -10
              </div>
              <div 
                className='px-2 cursor-pointer opacity-100 hover:opacity-70'
                onClick={() => {setCount(ajustCounterValue(count - 100))}}
              >
                -100
              </div>
              <div 
                className='px-2 cursor-pointer opacity-100 hover:opacity-70'
                onClick={() => {setCount(ajustCounterValue(count - 1000))}}
              >
                -1000
              </div>
            </div>
            <div>
              <div 
                className='px-2 cursor-pointer opacity-100 hover:opacity-70'
                onClick={() => {setCount(ajustCounterValue(count + 1))}}
              >
                {'>'}
              </div>
              <div 
                className='px-2 cursor-pointer opacity-100 hover:opacity-70'
                onClick={() => {setCount(ajustCounterValue(count + 10))}}
              >
                +10
              </div>
              <div 
                className='px-2 cursor-pointer opacity-100 hover:opacity-70'
                onClick={() => {setCount(ajustCounterValue(count + 100))}}
              >
                +100
              </div>
              <div 
                className='px-2 cursor-pointer opacity-100 hover:opacity-70'
                onClick={() => {setCount(ajustCounterValue(count + 1000))}}
              >
                +1000
              </div>
            </div>
          </div>
          <div
            className='inline-block mt-2 px-2 w-fit cursor-pointer opacity-100 hover:opacity-70'
            onClick={() => setCount(0)}
          >
            RESET
          </div>
        </div>
      </div>
    </>
  );
}