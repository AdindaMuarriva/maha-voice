import { useState } from 'react';
import MobileContainer from './components/MobileContainer';
import SplashScreen from './pages/auth/SplashScreen';
import Onboarding from './pages/auth/Onboarding';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/mahasiswa/Dashboard';
import Chatbox from './pages/mahasiswa/Chatbox';
import Screening from './pages/mahasiswa/Screening';
import Result from './pages/mahasiswa/Result';

function App() {
  const [currentStep, setCurrentStep] = useState('splash');
  const [score, setScore] = useState(0);

  return (
    <MobileContainer>
      {/* 1. Splash */}
      {currentStep === 'splash' && (
        <SplashScreen onFinish={() => setCurrentStep('onboarding')} />
      )}

      {/* 2. Onboarding */}
      {currentStep === 'onboarding' && (
        <Onboarding 
          onComplete={() => setCurrentStep('register')} 
          onLogin={() => setCurrentStep('login')}
        />
      )}

      {/* 3. Login */}
      {currentStep === 'login' && (
        <Login 
          onRegisterClick={() => setCurrentStep('register')} 
          onLogin={() => {
            setCurrentStep('dashboard');
          }} 
        />
      )}

      {/* 4. Register */}
      {currentStep === 'register' && (
        <Register 
          onLoginClick={() => setCurrentStep('login')} 
          onRegister={() => setCurrentStep('login')} 
        />
      )}

    {/* 5. Dashboard */}
    {currentStep === 'dashboard' && (
      <Dashboard
        onFeatureClick={(feature) => {
          if (feature === 'chat') {
            setCurrentStep('chat');
          }
          if (feature === 'screening') {
            setCurrentStep('screening');
          }
        }}
      />
    )}

    {/* 6. Chat */}
    {currentStep === 'chat' && (
      <Chatbox 
        onBack={() => setCurrentStep('dashboard')} 
      />
    )}

    {/* 7. Screening */}
    {currentStep === 'screening' && (
      <Screening 
        onBack={() => setCurrentStep('dashboard')} 
        onFinish={(finalScore) => {
          setScore(finalScore);
          setCurrentStep('result');
        }}
      />
    )}

    {/* 8. Result */}
    {currentStep === 'result' && (
      <Result
        score={score}
        onBack={() => setCurrentStep('dashboard')}
      />
    )}

    </MobileContainer>
  );
}

export default App;