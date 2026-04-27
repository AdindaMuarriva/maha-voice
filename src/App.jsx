import { useState } from 'react';
import MobileContainer from './components/MobileContainer';
import SplashScreen from './pages/auth/SplashScreen';
import Onboarding from './pages/auth/Onboarding';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/mahasiswa/Dashboard';
import Chatbox from './pages/mahasiswa/Chatbox';
import Musik from './pages/mahasiswa/Musik';         

function App() {
  const [currentStep, setCurrentStep] = useState('splash');

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
            if (feature === 'music') {  
              setCurrentStep('musik');
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

      {/* 7. Musik */}                
      {currentStep === 'musik' && (
        <Musik 
          onBack={() => setCurrentStep('dashboard')} 
        />
      )}
    </MobileContainer>
  );
}

export default App;
