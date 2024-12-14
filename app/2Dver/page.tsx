'use client'

import { useState } from 'react';

export default function App() {
  const [diceNumber, setDiceNumber] = useState(1);
  const [isRolling, setIsRolling] = useState(false);

  function rollDice() {
    let intervalId: NodeJS.Timeout;
    intervalId = setInterval(() => {
      if (!isRolling) {
        setDiceNumber(Math.floor(Math.random() * 6) + 1);
        clearInterval(intervalId);
      }
      console.log(intervalId);
    }, 100);
  }

  return (
    <>
      <div
        // ダイス
        className={`h-36 w-36 p-4 bg-white rounded-md`}
        onClick={() => {
          setIsRolling(!isRolling);
          if (isRolling) {
            rollDice();
          }
        }}
      >
        <div
          className='relative h-full w-full'
        >
          <div
            // ダイスの目 "1"
            className={diceNumber === 1 ? 'block' : 'hidden'}
          >
            <div className="h-12 w-12 bg-red-600 rounded-full absolute left-8 top-8"></div>
          </div>
          <div
            // ダイスの目 "2"
            className={diceNumber === 2 ? 'block' : 'hidden'}
          >
            <div className="h-8 w-8 bg-black rounded-full absolute left-0 top-0"></div>
            <div className="h-8 w-8 bg-black rounded-full absolute right-0 bottom-0"></div>
          </div>
          <div
            // ダイスの目 "3"
            className={diceNumber === 3 ? 'block' : 'hidden'}
          >
            <div className="h-8 w-8 bg-black rounded-full absolute left-0 top-0"></div>
            <div className="h-8 w-8 bg-black rounded-full absolute right-0 bottom-0"></div>
            <div className="h-8 w-8 bg-black rounded-full absolute left-10 top-10"></div>
          </div>
          <div
            // ダイスの目 "4"
            className={diceNumber === 4 ? 'block' : 'hidden'}
          >
            <div className="h-8 w-8 bg-black rounded-full absolute left-0 top-0"></div>
            <div className="h-8 w-8 bg-black rounded-full absolute right-0 bottom-0"></div>
            <div className="h-8 w-8 bg-black rounded-full absolute left-0 bottom-0"></div>
            <div className="h-8 w-8 bg-black rounded-full absolute right-0 top-0"></div>
          </div>
          <div
            // ダイスの目 "5"
            className={diceNumber === 5 ? 'block' : 'hidden'}
          >
            <div className="h-8 w-8 bg-black rounded-full absolute left-0 top-0"></div>
            <div className="h-8 w-8 bg-black rounded-full absolute right-0 bottom-0"></div>
            <div className="h-8 w-8 bg-black rounded-full absolute left-0 bottom-0"></div>
            <div className="h-8 w-8 bg-black rounded-full absolute right-0 top-0"></div>
            <div className="h-8 w-8 bg-black rounded-full absolute top-10 left-10"></div>
          </div>
          <div
            // ダイスの目 "6"
            className={diceNumber === 6 ? 'block' : 'hidden'}
          >
            <div className="h-8 w-8 bg-black rounded-full absolute left-0 top-0"></div>
            <div className="h-8 w-8 bg-black rounded-full absolute right-0 bottom-0"></div>
            <div className="h-8 w-8 bg-black rounded-full absolute left-0 bottom-0"></div>
            <div className="h-8 w-8 bg-black rounded-full absolute right-0 top-0"></div>
            <div className="h-8 w-8 bg-black rounded-full absolute top-10 left-0"></div>
            <div className="h-8 w-8 bg-black rounded-full absolute top-10 right-0"></div>
          </div>
        </div>
      </div>
    </>
  )
}
