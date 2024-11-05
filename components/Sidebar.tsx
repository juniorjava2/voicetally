import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import { BsLightbulb } from 'react-icons/bs';

interface SidebarProps {
    difficulty: "easy" | "medium" | "hard";
    setDifficulty: React.Dispatch<React.SetStateAction<"easy" | "medium" | "hard">>;
    isPaused: boolean;
    setIsPaused: (isPaused: boolean) => void;
    image: string;
}

export default function Sidebar({ 
  difficulty, 
  setDifficulty, 
    isPaused, 
    setIsPaused,    
    image
}: SidebarProps) {
    const [time, setTime] = useState(0);
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (!isPaused) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPaused]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleHintClick = () => {
        setShowHint(true);
        setTimeout(() => {
            setShowHint(false);
        }, 5000);
    };

    return (
      <div className="w-64">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="w-full mb-4 p-2 bg-blue-500 text-white rounded flex items-center justify-center"
        >
          {isPaused ? <FaPlay className="mr-2" /> : <FaPause className="mr-2" />}
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <div className="mb-4">
          <label className="block mb-2">Difficulty:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
            className="w-full p-2 border rounded"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Timer:</label>
          <div className="text-2xl font-bold">{formatTime(time)}</div>
        </div>
        <button
          onClick={handleHintClick}
          className="w-full p-2 bg-yellow-500 text-white rounded flex items-center justify-center"
        >
          <BsLightbulb className="mr-2" />
          Show Hint
        </button>
        {showHint && (
          <div className="mt-4 transition-opacity duration-500 ease-in-out">
            <img src={image} alt="Puzzle Hint" className="w-full h-auto" />
          </div>
        )}
      </div>
    );
  }