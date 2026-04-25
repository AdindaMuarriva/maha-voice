import { useState } from 'react';
import MobileContainer from './components/MobileContainer';
import SplashScreen from './pages/auth/SplashScreen';
import Onboarding from './pages/auth/Onboarding';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/mahasiswa/Dashboard';

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
        <Dashboard />
      )}
    </MobileContainer>
  );
}

export default App;