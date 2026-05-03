import { useState } from 'react';
import MobileContainer from './components/MobileContainer';
import SplashScreen from './pages/auth/SplashScreen';
import Onboarding from './pages/auth/Onboarding';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/mahasiswa/Dashboard';
import Profil from './pages/mahasiswa/profil';
import EditProfil from './pages/mahasiswa/editprofil';
import GantiPassword from './pages/mahasiswa/gantipassword';
import TipDetail from './pages/mahasiswa/TipDetail';
import Chatbox from './pages/mahasiswa/Chatbox';
import Screening from './pages/mahasiswa/Screening';
import Result from './pages/mahasiswa/Result';
import Musik from './pages/mahasiswa/Musik';
import Riwayat from './pages/mahasiswa/Riwayat';
import Dashboard_Admin from './pages/auth/Admin/Dashboard_Admin';
import Daftar_Users from './pages/auth/Admin/Daftar_Users';
import Hasil_Screening from './pages/auth/Admin/Hasil_Screening';
import Pertanyaan_Screening from './pages/auth/Admin/Pertanyaan_Screening';
import Rekomendasi from './pages/auth/Admin/Rekomendasi';
import TipsAndMusic from './pages/auth/Admin/Tips dan Music';
import { saveScreeningResult } from './services/adminApi';

function App() {
  const [currentStep, setCurrentStep] = useState('admin-login');
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(40);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedTip, setSelectedTip] = useState(null);
  const [adminPage, setAdminPage] = useState('dashboard');

  const renderAdminPage = () => {
    if (adminPage === 'dashboard') {
      return <Dashboard_Admin onNavigate={setAdminPage} />;
    }

    if (adminPage === 'users') {
      return <Daftar_Users onNavigate={setAdminPage} />;
    }

    if (adminPage === 'results') {
      return <Hasil_Screening onNavigate={setAdminPage} />;
    }

    if (adminPage === 'questions') {
      return <Pertanyaan_Screening onNavigate={setAdminPage} />;
    }

    if (adminPage === 'recommendation') {
      return <Rekomendasi onNavigate={setAdminPage} />;
    }

    return <TipsAndMusic onNavigate={setAdminPage} />;
  };

  if (currentStep === 'admin-dashboard') {
    return (
      <div style={{ minHeight: '100vh', width: '100%', background: '#f3f6fa' }}>
        {renderAdminPage()}
      </div>
    );
  }

  if (currentStep?.startsWith('admin')) {
    return (
      <div className="w-full h-screen">
        {currentStep === 'admin-login' && (
          <AdminLogin onAdminLogin={() => setCurrentStep('admin-dashboard')} />
        )}
        {currentStep === 'admin-dashboard' && (
          <div className="flex items-center justify-center h-full text-4xl font-bold text-[#3C7A92]">
            Dashboard Admin MahaVoice
          </div>
        )}
      </div>
    );
  }

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
          onLogin={(loginResult) => {
            const account = loginResult?.user || loginResult;
            if (!account) {
              console.error('Login tidak menghasilkan pengguna:', loginResult);
              return;
            }

            const role = loginResult?.role || account?.role || 'user';
            setCurrentUser({ ...account, role });

            if (role === 'admin') {
              setAdminPage('dashboard');
              setCurrentStep('admin-dashboard');
              return;
            }

            setCurrentStep('dashboard');
          }} 
        />
      )}

      {/* REGISTER */}
      {currentStep === 'register' && (
        <Register 
          onLoginClick={() => setCurrentStep('login')} 
          onRegister={(user) => {
            setCurrentUser(user);
            setCurrentStep('login');
          }} 
        />
      )}

      {/* DASHBOARD */}
      {currentStep === 'dashboard' && (
        <Dashboard
          currentUser={currentUser}
          userName={currentUser?.nama || currentUser?.fullName || 'Pengguna'}
          onFeatureClick={(feature) => {
            if (feature === 'chat') setCurrentStep('chat');
            if (feature === 'screening') setCurrentStep('screening');
            if (feature === 'music') setCurrentStep('musik');
            if (feature === 'history') setCurrentStep('riwayat');
          }}
          onProfileClick={() => setCurrentStep('profile')}
          onTipSelect={(tip) => {
            setSelectedTip(tip);
            setCurrentStep('tip-detail');
          }}
        />
      )}

      {currentStep === 'profile' && (
        <Profil
          currentUser={currentUser}
          onBack={() => setCurrentStep('dashboard')}
          onLogout={() => {
            setCurrentUser(null);
            setCurrentStep('login');
          }}
          onEditProfile={() => setCurrentStep('edit-profile')}
          onChangePassword={() => setCurrentStep('change-password')}
          onNavigate={(page) => setCurrentStep(page)}
          onLanguageChange={(next) => {
            // Optionally handle app-wide language change here
            console.log('Language changed to', next);
          }}
        />
      )}

      {currentStep === 'edit-profile' && (
        <EditProfil
          currentUser={currentUser}
          onBack={() => setCurrentStep('profile')}
          onProfileUpdated={(user) => { setCurrentUser(prev => ({ ...prev, ...user })); setCurrentStep('profile'); }}
        />
      )}

      {currentStep === 'change-password' && (
        <GantiPassword
          currentUser={currentUser}
          onBack={() => setCurrentStep('profile')}
          onPasswordChanged={() => setCurrentStep('profile')}
        />
      )}

      {currentStep === 'tip-detail' && (
        <TipDetail
          tip={selectedTip}
          onBack={() => setCurrentStep('dashboard')}
        />
      )}

      {/* CHAT */}
      {currentStep === 'chat' && (
        <Chatbox 
          currentUser={currentUser}
          onBack={() => setCurrentStep('dashboard')} 
          onNavigate={(page) => setCurrentStep(page)}
        />
      )}

      {/* SCREENING */}
      {currentStep === 'screening' && (
        <Screening 
          onBack={() => setCurrentStep('dashboard')} 
          onFinish={(result) => {
            const finalScore = result?.score ?? 0;
            const totalScore = result?.totalScore ?? 40;
            const answers = Array.isArray(result?.answers) ? result.answers : [];

            saveScreeningResult({
              userId: currentUser?.id_user || null,
              nama: currentUser?.nama || currentUser?.fullName || 'Pengguna',
              npm: currentUser?.npm || '',
              email: currentUser?.email || '',
              score: finalScore,
              totalScore,
              answers,
            }).catch((error) => {
              console.error('Gagal menyimpan screening:', error);
            });
            setScore(finalScore);
            setTotalScore(totalScore);
            setCurrentStep('result');
          }}
        />
      )}

      {/* RESULT */}
      {currentStep === 'result' && (
        <Result
          score={score}
          totalScore={totalScore}
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
          currentUser={currentUser}
          onBack={() => setCurrentStep('dashboard')} 
        />
      )}

    </MobileContainer>
  );
}

export default App;