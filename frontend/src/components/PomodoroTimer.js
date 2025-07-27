import { useState, useEffect } from 'react';

  const PomodoroTimer = () => {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
      let interval;
      if (isActive && (minutes > 0 || seconds > 0)) {
        interval = setInterval(() => {
          if (seconds === 0) {
            setMinutes(minutes - 1);
            setSeconds(59);
          } else {
            setSeconds(seconds - 1);
          }
        }, 1000);
      } else if (minutes === 0 && seconds === 0) {
        setIsActive(false);
      }
      return () => clearInterval(interval);
    }, [isActive, minutes, seconds]);

    const startTimer = () => setIsActive(true);
    const pauseTimer = () => setIsActive(false);
    const resetTimer = () => {
      setIsActive(false);
      setMinutes(25);
      setSeconds(0);
    };

    return (
      <div className="max-w-md mx-auto p-6">
        <div className="card text-center">
          <h2 className="text-3xl font-bold mb-6 text-primary">Pomodoro Timer</h2>
          <div className="relative w-48 h-48 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-8 border-primary flex items-center justify-center">
              <span className="text-4xl font-semibold">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={startTimer}
              className="btn-primary"
            >
              Start
            </button>
            <button
              onClick={pauseTimer}
              className="btn-secondary"
            >
              Pause
            </button>
            <button
              onClick={resetTimer}
              className="bg-danger text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default PomodoroTimer;