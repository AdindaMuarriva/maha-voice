import chatBg from '../../assets/chatbg.png';
import { useTranslation } from 'react-i18next';

const TipDetail = ({ tip, onBack }) => {
  const { t } = useTranslation();
  if (!tip) {
    return (
      <div className="flex h-full items-center justify-center px-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-xl font-bold text-slate-900 mb-4">{t('tipDetail.notFoundTitle')}</h1>
          <p className="text-sm text-slate-600 mb-6">{t('tipDetail.notFoundDesc')}</p>
          <button
            onClick={onBack}
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
          >
            {t('tipDetail.back')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-full overflow-y-auto px-6 py-8"
      style={{
        backgroundImage: `url(${chatBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      <div className="mb-4 inline-flex items-center gap-2">
        <button
          onClick={onBack}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Kembali
        </button>
      </div>

      <div className="rounded-[2rem] bg-slate-100 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          {tip.category || t('tipDetail.defaultCategory')}
        </p>
        <h1 className="mb-4 text-3xl font-black text-slate-900">{tip.title}</h1>
        <p className="mb-6 text-sm leading-7 text-slate-700">{tip.description || tip.desc || ''}</p>

        {tip.content ? (
          <div className="space-y-5 text-sm leading-7 text-slate-700">
            {typeof tip.content === 'string'
              ? tip.content.split('\n\n').map((block, index) => (
                  <p key={index}>{block}</p>
                ))
              : <p>{String(tip.content)}</p>
            }
          </div>
        ) : (
          <p className="text-sm text-slate-500">{t('tipDetail.noContent')}</p>
        )}
      </div>
    </div>
  );
};

export default TipDetail;
