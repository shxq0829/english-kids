import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';

const TABS = [
  { key: '/', icon: '🏠', labelKey: 'home' },
  { key: '/alphabet', icon: '🔤', labelKey: 'alphabet' },
  { key: '/words', icon: '📖', labelKey: 'words' },
  { key: '/games', icon: '🎮', labelKey: 'games' },
  { key: '/songs', icon: '🎵', labelKey: 'songs' },
] as const;

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, toggleLang, t } = useI18n();

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur border-b-2 border-black/5 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧱</span>
          <span className="text-lg font-extrabold text-kids-text">English Kids</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/settings')}
            className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-sm active:scale-90 transition-transform border border-black/5"
            aria-label="Settings"
          >
            ⚙️
          </button>
          <button
            onClick={toggleLang}
            className="w-12 h-12 rounded-2xl bg-kids-yellow/20 flex items-center justify-center text-lg font-extrabold active:scale-90 transition-transform border-2 border-black/10"
            aria-label="Toggle language"
          >
            {lang === 'en' ? '中' : 'EN'}
          </button>
        </div>
      </div>

      {/* Main content - scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-4">
        <Outlet />
      </div>

      {/* Bottom nav */}
      <nav className="flex items-stretch bg-white/90 backdrop-blur border-t-2 border-black/5 px-1 pt-1 pb-[env(safe-area-inset-bottom,8px)] shrink-0">
        {TABS.map((tab) => {
          const active = isActive(tab.key);
          return (
            <button
              key={tab.key}
              onClick={() => navigate(tab.key)}
              className={`
                flex flex-col items-center justify-center flex-1 py-2 rounded-xl mx-0.5
                transition-all duration-200 active:scale-90
                ${active
                  ? 'bg-kids-yellow/30 -translate-y-1 shadow-md'
                  : 'hover:bg-gray-100'
                }
              `}
            >
              <span className="text-2xl">{tab.icon}</span>
              <span className={`text-[10px] font-bold mt-0.5 ${active ? 'text-kids-text' : 'text-gray-400'}`}>
                {t(`nav.${tab.labelKey}` as any)}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
