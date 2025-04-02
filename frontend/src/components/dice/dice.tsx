// src/components/dice/dice.tsx

'use client';

import { useState } from 'react';
import './dice.css';
import {
  BsDice1Fill,
  BsDice2Fill,
  BsDice3Fill,
  BsDice4Fill,
  BsDice5Fill,
  BsDice6Fill,
} from 'react-icons/bs';

export default function DiceRoller() {
  const [currentFace, setCurrentFace] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);

  // Map góc quay tương ứng với mỗi mặt
  const faceAngles: Record<number, string> = {
    1: 'rotateY(0deg) rotateX(0deg)',
    2: 'rotateY(-90deg) rotateX(0deg)',
    3: 'rotateY(180deg) rotateX(0deg)',
    4: 'rotateY(90deg) rotateX(0deg)',
    5: 'rotateX(-90deg) rotateY(0deg)',
    6: 'rotateX(90deg) rotateY(0deg)',
  };

  const rollDice = () => {
    setIsRolling(true);
    const rollDuration = 1000;

    const interval = setInterval(() => {
      const randomFace = Math.floor(Math.random() * 6) + 1;
      setCurrentFace(randomFace);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setIsRolling(false);
    }, rollDuration);
  };

  return (
    <div className="dice-container" onClick={rollDice}>
      <div
        className={`dice ${isRolling ? 'rolling' : ''}`}
        style={{ transform: isRolling ? '' : faceAngles[currentFace] }}
      >
        <div className="face face-1">
          <BsDice1Fill />
        </div>
        <div className="face face-2">
          <BsDice2Fill />
        </div>
        <div className="face face-3">
          <BsDice3Fill />
        </div>
        <div className="face face-4">
          <BsDice4Fill />
        </div>
        <div className="face face-5">
          <BsDice5Fill />
        </div>
        <div className="face face-6">
          <BsDice6Fill />
        </div>
      </div>
    </div>
  );
}
