import { HashRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom'
import { AlternadorTema } from './components/AlternadorTema'
import { BannerAviso } from './components/BannerAviso'
import { SeletorIdioma } from './components/SeletorIdioma'
import { PaginaCalculadora } from './pages/PaginaCalculadora'
import { PaginaResumos } from './pages/PaginaResumos'
import { useLocale } from './i18n/LocaleContext'

function App() {
  const { t } = useLocale()

  return (
    <HashRouter>
      <div className="min-h-screen">
        <BannerAviso />
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          <header className="relative flex flex-col items-center text-center gap-2 pt-2">
            <div className="absolute right-0 top-2 flex items-center gap-2">
              <AlternadorTema />
              <SeletorIdioma />
            </div>
            <div className="h-44 sm:h-52 aspect-square rounded-full shadow-lg overflow-hidden">
              <img
                src={`${import.meta.env.BASE_URL}logo-neodose.jpg`}
                alt="NeoDose"
                className="w-full h-full object-cover scale-[1.4]"
              />
            </div>
            <p className="text-brand-teal-dark/80 dark:text-brand-teal-light/80 text-sm max-w-md">{t.app.subtitulo}</p>
          </header>

          <nav className="flex justify-center gap-2">
            <NavLink
              to="/calculadora"
              className={({ isActive }) =>
                `px-5 py-2 rounded-full text-sm font-medium transition-all duration-150 active:scale-95 ${
                  isActive
                    ? 'bg-brand-blue text-white shadow-md'
                    : 'bg-brand-teal-light text-brand-blue-dark hover:bg-brand-teal-light/70 dark:bg-slate-800 dark:text-brand-teal-light dark:hover:bg-slate-700'
                }`
              }
            >
              {t.nav.calculadora}
            </NavLink>
            <NavLink
              to="/resumos"
              className={({ isActive }) =>
                `px-5 py-2 rounded-full text-sm font-medium transition-all duration-150 active:scale-95 ${
                  isActive
                    ? 'bg-brand-blue text-white shadow-md'
                    : 'bg-brand-teal-light text-brand-blue-dark hover:bg-brand-teal-light/70 dark:bg-slate-800 dark:text-brand-teal-light dark:hover:bg-slate-700'
                }`
              }
            >
              {t.nav.resumos}
            </NavLink>
          </nav>

          <Routes>
            <Route path="/" element={<Navigate to="/calculadora" replace />} />
            <Route path="/calculadora" element={<PaginaCalculadora />} />
            <Route path="/resumos" element={<PaginaResumos />} />
            <Route path="*" element={<Navigate to="/calculadora" replace />} />
          </Routes>

          <footer className="text-center text-xs text-slate-400 dark:text-slate-500 pb-4 space-y-0.5">
            <p>{t.rodape.construidoPor}</p>
            <p>{t.rodape.telefone}</p>
            <p>{t.rodape.email}</p>
          </footer>
        </div>
      </div>
    </HashRouter>
  )
}

export default App
