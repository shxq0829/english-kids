import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nProvider } from './i18n';
import Layout from './components/Layout';
import Home from './pages/Home';
import Alphabet from './pages/Alphabet';
import Words from './pages/Words';
import Games from './pages/Games';
import Songs from './pages/Songs';
import Settings from './pages/Settings';

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter basename="/english-kids">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/alphabet" element={<Alphabet />} />
            <Route path="/words" element={<Words />} />
            <Route path="/games" element={<Games />} />
            <Route path="/songs" element={<Songs />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  );
}
