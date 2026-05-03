import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  id: {
    translation: {
      profile: {
        title: 'Profil',
        edit: 'Edit Profil',
        editDesc: 'Ubah data dan informasi akun',
        pwd: 'Ganti Password',
        pwdDesc: 'Perbarui kata sandi',
        notifications: 'Notifikasi',
        contact: 'Hubungi kami',
        history: 'Riwayat Screening',
        language: 'Bahasa',
        logout: 'Keluar',
        contactPersonLabel: 'Contact Person',
        contactPersonName: 'Dio',
        contactPersonNumber: '082248181269',
        copy: 'Salin',
        close: 'Tutup'
      }
      ,
      dashboard: {
        welcome: 'Selamat datang,',
        featureTitle: 'Fitur Utama',
        suggestionsTitle: 'Saran',
        features: {
          chat: { label: 'Mulai Chat', desc: 'Yuk ngobrol bebas sama Hava!' },
          screening: { label: 'Screening', desc: 'Cek tingkat stresmu di sini.' },
          history: { label: 'Riwayat', desc: 'Lihat riwayat dan perkembanganmu.' },
          music: { label: 'Musik', desc: 'Dengarkan lagu pereda stres di sini.' }
        },
        categories: ['Semua', 'Fokus Belajar', 'Tidur Sehat', 'Relaksasi'],
        readMore: 'Baca selengkapnya ›',
        noResults: 'Belum ada hasil',
        daysAgo: {
          today: 'Hari ini',
          oneDay: '1 hari yang lalu',
          days: '{{count}} hari yang lalu'
        }
      },
      tipDetail: {
        notFoundTitle: 'Saran tidak ditemukan',
        notFoundDesc: 'Kembali ke daftar saran untuk memilih ulang.',
        back: 'Kembali',
        defaultCategory: 'Umum',
        noContent: 'Belum ada isi artikel yang tersedia untuk tips ini.'
      }
    }
  },
  en: {
    translation: {
      profile: {
        title: 'Profile',
        edit: 'Edit Profile',
        editDesc: 'Update account information',
        pwd: 'Change Password',
        pwdDesc: 'Update your password',
        notifications: 'Notifications',
        contact: 'Contact us',
        history: 'Screening History',
        language: 'Language',
        logout: 'Sign out',
        contactPersonLabel: 'Contact Person',
        contactPersonName: 'Dio',
        contactPersonNumber: '082248181269',
        copy: 'Copy',
        close: 'Close'
      }
      ,
      dashboard: {
        welcome: 'Welcome,',
        featureTitle: 'Main Features',
        suggestionsTitle: 'Suggestions',
        features: {
          chat: { label: 'Start Chat', desc: "Let's chat with Hava!" },
          screening: { label: 'Screening', desc: 'Check your stress level here.' },
          history: { label: 'History', desc: 'View your history and progress.' },
          music: { label: 'Music', desc: 'Listen to stress-relief songs here.' }
        },
        categories: ['All', 'Study Focus', 'Healthy Sleep', 'Relaxation'],
        readMore: 'Read more ›',
        noResults: 'No results yet',
        daysAgo: {
          today: 'Today',
          oneDay: '1 day ago',
          days: '{{count}} days ago'
        }
      },
      tipDetail: {
        notFoundTitle: 'Suggestion not found',
        notFoundDesc: 'Return to the suggestions list to choose again.',
        back: 'Back',
        defaultCategory: 'General',
        noContent: 'No article content is available for this tip.'
      }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('lang') || 'id',
  fallbackLng: 'id',
  interpolation: { escapeValue: false }
});

export default i18n;
