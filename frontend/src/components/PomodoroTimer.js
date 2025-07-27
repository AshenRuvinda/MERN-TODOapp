import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Target, Settings, Volume2, Timer, Zap, Award, Sparkles, TrendingUp } from 'lucide-react';

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [sessions, setSessions] = useState(0);
  const [settings, setSettings] = useState({
    workTime: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsUntilLongBreak: 4,
    soundEnabled: true
  });

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
    } else if (minutes === 0 && seconds === 0 && isActive) {
      setIsActive(false);
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const handleTimerComplete = () => {
    if (settings.soundEnabled) {
      console.log('Timer complete!');
    }

    if (mode === 'work') {
      const newSessions = sessions + 1;
      setSessions(newSessions);
      
      if (newSessions % settings.sessionsUntilLongBreak === 0) {
        setMode('longBreak');
        setMinutes(settings.longBreak);
        setSeconds(0);
      } else {
        setMode('shortBreak');
        setMinutes(settings.shortBreak);
        setSeconds(0);
      }
    } else {
      setMode('work');
      setMinutes(settings.workTime);
      setSeconds(0);
    }
  };

  const startTimer = () => setIsActive(true);
  const pauseTimer = () => setIsActive(false);
  
  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'work') {
      setMinutes(settings.workTime);
    } else if (mode === 'shortBreak') {
      setMinutes(settings.shortBreak);
    } else {
      setMinutes(settings.longBreak);
    }
    setSeconds(0);
  };

  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    switch (newMode) {
      case 'work':
        setMinutes(settings.workTime);
        break;
      case 'shortBreak':
        setMinutes(settings.shortBreak);
        break;
      case 'longBreak':
        setMinutes(settings.longBreak);
        break;
    }
    setSeconds(0);
  };

  const totalTime = mode === 'work' ? settings.workTime * 60 : 
                   mode === 'shortBreak' ? settings.shortBreak * 60 : 
                   settings.longBreak * 60;
  const currentTime = minutes * 60 + seconds;
  const progress = ((totalTime - currentTime) / totalTime) * 100;

  const getModeConfig = () => {
    switch (mode) {
      case 'work':
        return {
          title: 'Deep Focus',
          color: 'from-rose-500 via-red-500 to-pink-600',
          bgColor: 'bg-gradient-to-br from-rose-50 to-red-50',
          shadowColor: 'shadow-rose-500/20',
          textColor: 'text-rose-600',
          icon: Target,
          description: 'Time to focus and achieve greatness!',
          accent: 'rose',
          ringColor: 'ring-rose-500/30'
        };
      case 'shortBreak':
        return {
          title: 'Quick Recharge',
          color: 'from-emerald-500 via-green-500 to-teal-600',
          bgColor: 'bg-gradient-to-br from-emerald-50 to-green-50',
          shadowColor: 'shadow-emerald-500/20',
          textColor: 'text-emerald-600',
          icon: Coffee,
          description: 'Take a breather and energize yourself.',
          accent: 'emerald',
          ringColor: 'ring-emerald-500/30'
        };
      case 'longBreak':
        return {
          title: 'Extended Rest',
          color: 'from-blue-500 via-indigo-500 to-purple-600',
          bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
          shadowColor: 'shadow-blue-500/20',
          textColor: 'text-blue-600',
          icon: Coffee,
          description: 'Enjoy a well-deserved longer break!',
          accent: 'blue',
          ringColor: 'ring-blue-500/30'
        };
      default:
        return {
          title: 'Pomodoro',
          color: 'from-gray-500 to-gray-600',
          bgColor: 'bg-gradient-to-br from-gray-50 to-gray-100',
          shadowColor: 'shadow-gray-500/20',
          textColor: 'text-gray-600',
          icon: Target,
          description: 'Ready to start?',
          accent: 'gray',
          ringColor: 'ring-gray-500/30'
        };
    }
  };

  const modeConfig = getModeConfig();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Modern Header */}
        <div className="text-center mb-16 relative">
          {/* Floating decorative elements */}
          <div className="absolute top-0 left-1/4 w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
          <div className="absolute top-8 right-1/3 w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-4 right-1/4 w-1 h-1 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl mr-4">
                <Timer className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-6xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Timer
                </h1>
                <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-2"></div>
              </div>
            </div>
            <p className="text-xl text-gray-600 font-medium">Master productivity with elegant time management</p>
            <div className="flex items-center justify-center mt-4 space-x-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
              </div>
              <span className="text-gray-500 font-medium">Stay focused • Stay productive • Stay brilliant</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.9s'}}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '1.2s'}}></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Enhanced Timer Section */}
          <div className="xl:col-span-3">
            <div className={`${modeConfig.bgColor} rounded-3xl p-8 shadow-2xl border border-gray-100 relative overflow-hidden`}>
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, currentColor 2px, transparent 2px)`,
                backgroundSize: '50px 50px'
              }}></div>
              
              {/* Top accent line */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${modeConfig.color}`}></div>
              
              {/* Floating elements */}
              <div className="absolute top-8 right-8 w-20 h-20 bg-white/60 rounded-full blur-xl"></div>
              <div className="absolute bottom-8 left-8 w-16 h-16 bg-white/40 rounded-full blur-lg"></div>

              {/* Mode Selector */}
              <div className="flex justify-center mb-12 relative z-10">
                <div className="bg-white rounded-2xl p-2 shadow-xl border border-gray-200">
                  <div className="flex space-x-1">
                    {[
                      { key: 'work', label: 'Focus', icon: Target, color: 'from-rose-500 to-red-500' },
                      { key: 'shortBreak', label: 'Quick Break', icon: Coffee, color: 'from-emerald-500 to-green-500' },
                      { key: 'longBreak', label: 'Long Break', icon: Coffee, color: 'from-blue-500 to-indigo-500' }
                    ].map(({ key, label, icon: Icon, color }) => (
                      <button
                        key={key}
                        onClick={() => switchMode(key)}
                        className={`flex items-center space-x-3 px-6 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                          mode === key
                            ? `bg-gradient-to-r ${color} text-white shadow-lg`
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="hidden sm:inline">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Timer Display */}
              <div className="text-center relative z-10">
                <div className="flex items-center justify-center mb-8">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${modeConfig.color} shadow-lg mr-4`}>
                    <modeConfig.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-3xl font-black text-gray-800">{modeConfig.title}</h2>
                    <p className="text-gray-600 text-lg font-medium">{modeConfig.description}</p>
                  </div>
                </div>

                {/* Enhanced Circular Progress */}
                <div className="relative w-96 h-96 mx-auto mb-10">
                  {/* Outer decorative ring */}
                  <div className={`absolute inset-0 rounded-full ${modeConfig.ringColor} ring-4 opacity-20`}></div>
                  
                  {/* Main Timer Circle */}
                  <div className="relative w-full h-full">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background Circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="#f1f5f9"
                        strokeWidth="3"
                        fill="none"
                      />
                      {/* Progress Circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="url(#timerGradient)"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${progress * 2.827} ${282.7 - progress * 2.827}`}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-in-out"
                        style={{
                          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                        }}
                      />
                      <defs>
                        <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" className={`${mode === 'work' ? 'stop-rose-400' : mode === 'shortBreak' ? 'stop-emerald-400' : 'stop-blue-400'}`} />
                          <stop offset="50%" className={`${mode === 'work' ? 'stop-red-500' : mode === 'shortBreak' ? 'stop-green-500' : 'stop-indigo-500'}`} />
                          <stop offset="100%" className={`${mode === 'work' ? 'stop-pink-600' : mode === 'shortBreak' ? 'stop-teal-600' : 'stop-purple-600'}`} />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Time Display */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100">
                        <div className="text-7xl font-black text-gray-800 mb-2 tracking-tight">
                          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                        </div>
                        <div className={`text-xl font-bold ${modeConfig.textColor} flex items-center justify-center mb-3`}>
                          {isActive ? (
                            <>
                              <Zap className="h-5 w-5 mr-2 animate-pulse" />
                              In Progress
                            </>
                          ) : (
                            'Ready to Start'
                          )}
                        </div>
                        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            {Math.round(progress)}%
                          </span>
                          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                          <span>{Math.ceil(currentTime / 60)}m left</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Control Buttons */}
                <div className="flex justify-center space-x-6">
                  <button
                    onClick={isActive ? pauseTimer : startTimer}
                    className={`group flex items-center space-x-4 bg-gradient-to-r ${modeConfig.color} text-white px-12 py-6 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold text-xl relative overflow-hidden ${modeConfig.shadowColor} shadow-lg`}
                  >
                    <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    <div className="relative z-10 flex items-center space-x-4">
                      {isActive ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7" />}
                      <span>{isActive ? 'Pause Focus' : 'Start Focus'}</span>
                    </div>
                  </button>

                  <button
                    onClick={resetTimer}
                    className="group flex items-center space-x-4 bg-white text-gray-700 px-10 py-6 rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold border-2 border-gray-200 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gray-50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    <div className="relative z-10 flex items-center space-x-4">
                      <RotateCcw className="h-6 w-6" />
                      <span>Reset</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-8">
            {/* Session Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full blur-2xl"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
              
              <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center relative z-10">
                <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl mr-3">
                  <Award className="h-5 w-5 text-white" />
                </div>
                Today's Achievements
              </h3>
              
              <div className="space-y-6 relative z-10">
                <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200/50">
                  <div className="text-5xl font-black text-yellow-600 mb-2">{sessions}</div>
                  <div className="text-sm font-bold text-gray-600 uppercase tracking-wide">Sessions Completed</div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-black text-blue-600">{sessions * settings.workTime}m</div>
                        <div className="text-xs font-bold text-gray-600 uppercase">Deep Focus Time</div>
                      </div>
                      <Target className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-black text-emerald-600">{sessions * settings.shortBreak}m</div>
                        <div className="text-xs font-bold text-gray-600 uppercase">Recovery Time</div>
                      </div>
                      <Coffee className="h-8 w-8 text-emerald-500" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-600">Next Long Break</span>
                    <span className="text-gray-800">{sessions % settings.sessionsUntilLongBreak}/{settings.sessionsUntilLongBreak}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${((sessions % settings.sessionsUntilLongBreak) / settings.sessionsUntilLongBreak) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    {settings.sessionsUntilLongBreak - (sessions % settings.sessionsUntilLongBreak)} more sessions to go!
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Settings */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-400/10 to-purple-500/10 rounded-full blur-xl"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              
              <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center relative z-10">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl mr-3">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                Quick Settings
              </h3>
              
              <div className="space-y-6 relative z-10">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Work Duration (minutes)</label>
                  <input
                    type="number"
                    value={settings.workTime}
                    onChange={(e) => setSettings({...settings, workTime: parseInt(e.target.value)})}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 font-bold transition-all duration-200"
                    min="1"
                    max="60"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Short Break (minutes)</label>
                  <input
                    type="number"
                    value={settings.shortBreak}
                    onChange={(e) => setSettings({...settings, shortBreak: parseInt(e.target.value)})}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 font-bold transition-all duration-200"
                    min="1"
                    max="30"
                  />
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-3">
                    <Volume2 className="h-6 w-6 text-gray-600" />
                    <span className="text-sm font-bold text-gray-700">Sound Notifications</span>
                  </div>
                  <button
                    onClick={() => setSettings({...settings, soundEnabled: !settings.soundEnabled})}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      settings.soundEnabled ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-lg ${
                        settings.soundEnabled ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Tips */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200/50 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-amber-300/20 rounded-full blur-xl"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-400"></div>
              
              <h3 className="text-lg font-black text-gray-800 mb-4 flex items-center relative z-10">
                <div className="p-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl mr-3">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                💡 Productivity Insight
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed font-medium relative z-10">
                The secret to deep work lies in single-tasking. During focus sessions, 
                close unnecessary tabs, silence notifications, and commit fully to one meaningful task. 
                Quality over quantity always wins! ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;