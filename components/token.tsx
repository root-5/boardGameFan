'use client'

import { useState } from 'react';

const tokenMax = 99;
const tokenMin = -99;

function ajustTokenValue(value: number): number {
    if (value > tokenMax) {
        return tokenMax;
    } else if (value < tokenMin) {
        return tokenMin;
    }
    return value;
}

export default function Token() {
  const [token1Count, setToken1Count] = useState(0);
  const [token2Count, setToken2Count] = useState(0);
  const [token3Count, setToken3Count] = useState(0);
  const [token4Count, setToken4Count] = useState(0);

  return (
    <>
      <div
        className='relative flex flex-col justify-center items-center p-4 w-56 h-56 text-center text-2xl bg-gray-900'
      >
        <div
          className='flex justify-center items-center'
        >
          <div
            className='py-1.5 px-4 text-center cursor-pointer transition hover:opacity-70 hover:-translate-x-2'
            onClick={() => setToken1Count(ajustTokenValue(token1Count - 1))}
          >
            {'<'}
          </div>
          <div className='text-5xl text-red-600 h-8 leading-7'>♥</div>
          <input
            className='inline-block ml-2 w-9 bg-transparent outline-none text-center forcus:'
            type="number"
            onChange={(e) => setToken1Count(ajustTokenValue(parseInt(e.target.value)))}
            value={token1Count}
          />
          <div
            className='py-1.5 px-4 text-center cursor-pointer transition hover:opacity-70 hover:translate-x-2'
            onClick={() => setToken1Count(ajustTokenValue(token1Count + 1))}
          >
            {'>'}
          </div>
        </div>
        <div
          className='flex justify-center items-center'
        >
          <div
            className='py-1.5 px-4 text-center cursor-pointer transition hover:opacity-70 hover:-translate-x-2'
            onClick={() => setToken2Count(ajustTokenValue(token2Count - 1))}
          >
            {'<'}
          </div>
          <div className='text-5xl text-yellow-300 h-8 leading-7'>●</div>
          <input
            className='inline-block ml-2 w-9 bg-transparent outline-none text-center'
            type="number"
            onChange={(e) => setToken2Count(ajustTokenValue(parseInt(e.target.value)))}
            value={token2Count}
          />
          <div
            className='py-1.5 px-4 text-center cursor-pointer transition hover:opacity-70 hover:translate-x-2'
            onClick={() => setToken2Count(ajustTokenValue(token2Count + 1))}
          >
            {'>'}
          </div>
        </div>
        <div
          className='flex justify-center items-center'
        >
          <div
            className='py-1.5 px-4 text-center cursor-pointer transition hover:opacity-70 hover:-translate-x-2'
            onClick={() => setToken3Count(ajustTokenValue(token3Count - 1))}
          >
            {'<'}
          </div>
          <div className='text-3xl text-green-600 h-8 leading-8'>▲</div>
          <input
            className='inline-block ml-2 w-9 bg-transparent outline-none text-center'
            type="number"
            onChange={(e) => setToken3Count(ajustTokenValue(parseInt(e.target.value)))}
            value={token3Count}
          />
          <div
            className='py-1.5 px-4 text-center cursor-pointer transition hover:opacity-70 hover:translate-x-2'
            onClick={() => setToken3Count(ajustTokenValue(token3Count + 1))}
          >
            {'>'}
          </div>
        </div>
        <div
          className='flex justify-center items-center'
        >
          <div
            className='py-1.5 px-4 text-center cursor-pointer transition hover:opacity-70 hover:-translate-x-2'
            onClick={() => setToken4Count(ajustTokenValue(token4Count - 1))}
          >
            {'<'}
          </div>
          <div className='text-5xl text-blue-600 h-8 leading-5'>■</div>
          <input
            className='inline-block ml-2 w-9 bg-transparent outline-none text-center'
            type="number"
            onChange={(e) => setToken4Count(ajustTokenValue(parseInt(e.target.value)))}
            value={token4Count}
          />
          <div
            className='py-1.5 px-4 text-center cursor-pointer transition hover:opacity-70 hover:translate-x-2'
            onClick={() => setToken4Count(ajustTokenValue(token4Count + 1))}
          >
            {'>'}
          </div>
        </div>
        <div
          className='absolute bottom-1 left-1 text-xl cursor-pointer'
          onClick={() => {
            setToken1Count(0);
            setToken2Count(0);
            setToken3Count(0);
            setToken4Count(0);
          }}
        >
          ↺
        </div>
      </div>
    </>
  );
}