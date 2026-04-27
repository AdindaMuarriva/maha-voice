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
import Musik from './pages/mahasiswa/Musik';
import Riwayat from './pages/mahasiswa/Riwayat';

function App() {
  const [currentStep, setCurrentStep] = useState('splash');
  const [score, setScore] = useState(0);

  return (
    <MobileContainer>

      {/* SPLASH */}
      {currentStep === 'splash' && (
        <SplashScreen onFinish={() => setCurrentStep('onboarding')} />
      )}

      {/* ONBOARDING */}
      {currentStep === 'onboarding' && (
        <Onboarding 
          onComplete={() => setCurrentStep('register')} 
          onLogin={() => setCurrentStep('login')}
        />
      )}

      {/* LOGIN */}
      {currentStep === 'login' && (
        <Login 
          onRegisterClick={() => setCurrentStep('register')} 
          onLogin={() => setCurrentStep('dashboard')} 
        />
      )}

      {/* REGISTER */}
      {currentStep === 'register' && (
        <Register 
          onLoginClick={() => setCurrentStep('login')} 
          onRegister={() => setCurrentStep('login')} 
        />
      )}

      {/* DASHBOARD */}
      {currentStep === 'dashboard' && (
        <Dashboard
          onFeatureClick={(feature) => {
            if (feature === 'chat') setCurrentStep('chat');
            if (feature === 'screening') setCurrentStep('screening');
            if (feature === 'music') setCurrentStep('musik');
            if (feature === 'history') setCurrentStep('riwayat');
          }}
        />
      )}

      {/* CHAT */}
      {currentStep === 'chat' && (
        <Chatbox 
          onBack={() => setCurrentStep('dashboard')} 
          onNavigate={(page) => setCurrentStep(page)}
        />
      )}

      {/* SCREENING */}
      {currentStep === 'screening' && (
        <Screening 
          onBack={() => setCurrentStep('dashboard')} 
          onFinish={(finalScore) => {
            setScore(finalScore);
            setCurrentStep('result');
          }}
        />
      )}

      {/* RESULT */}
      {currentStep === 'result' && (
        <Result
          score={score}
          onBack={() => setCurrentStep('dashboard')}
        />
      )}

      {/* MUSIK */}
      {currentStep === 'musik' && (
        <Musik 
          onBack={() => setCurrentStep('dashboard')} 
        />
      )}

      {/* RIWAYAT */}
      {currentStep === 'riwayat' && (
        <Riwayat 
          onBack={() => setCurrentStep('dashboard')} 
        />
      )}

    </MobileContainer>
  );
}

export default App;