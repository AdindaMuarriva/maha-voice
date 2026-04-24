import { useEffect } from 'react';
import logo from '../../assets/logo.png';

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => onFinish(), 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white px-10">
      <div className="animate-pulse">
        <img 
          src={logo} 
          alt="MahaVoice Logo" 
          className="w-40 h-auto object-contain" 
        />
      </div>
    </div>
  );
};

export default SplashScreen;