import { useState } from 'react';
import { useI18n } from '../i18n';
import ParentGate from '../components/ParentGate';

export default function Settings() {
  const { t, lang, toggleLang } = useI18n();
  const [passedGate, setPassedGate] = useState(false);

  if (!passedGate) {
    return <ParentGate onPass={() => setPassedGate(true)} onBack={() => window.history.back()} />;
  }

  return (
    <div className="p-4 max-w-md mx-auto animate-slide-up">
      <h2 className="text-3xl font-extrabold text-kids-text text-center mt-2 mb-6">
        {t('settings.title')}
      </h2>

      {/* Language toggle */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-black/5 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-extrabold text-kids-text text-lg">🌐 {t('settings.language')}</div>
            <div className="text-sm text-kids-text/40">{lang === 'zh' ? '中文' : 'English'}</div>
          </div>
          <button
            onClick={toggleLang}
            className="px-6 py-3 bg-kids-yellow text-kids-text font-extrabold rounded-2xl border-2 border-black/5 active:scale-95 transition-all"
          >
            {lang === 'en' ? '切换到中文' : 'Switch to EN'}
          </button>
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-black/5">
        <div className="font-extrabold text-kids-text text-lg mb-1">ℹ️ 关于</div>
        <div className="text-sm text-kids-text/60">{t('settings.about')}</div>
        <div className="text-xs text-kids-text/30 mt-3">
          💡 {lang === 'zh'
            ? '安装到 iPad：用 Safari 打开，点击分享按钮 → 添加到主屏幕'
            : 'Install on iPad: Open in Safari → Share → Add to Home Screen'
          }
        </div>
      </div>
    </div>
  );
}
