import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { detectarIdiomaNavegador, type Idioma } from './idiomas'
import { TRADUCOES, type Traducao } from './traducoes'

interface LocaleContextValue {
  idioma: Idioma
  definirIdioma: (idioma: Idioma) => void
  t: Traducao
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [idioma, setIdioma] = useState<Idioma>(() => detectarIdiomaNavegador())

  useEffect(() => {
    document.documentElement.lang = idioma
  }, [idioma])

  const value = useMemo<LocaleContextValue>(
    () => ({ idioma, definirIdioma: setIdioma, t: TRADUCOES[idioma] }),
    [idioma],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const contexto = useContext(LocaleContext)
  if (!contexto) {
    throw new Error('useLocale precisa ser usado dentro de um LocaleProvider')
  }
  return contexto
}
