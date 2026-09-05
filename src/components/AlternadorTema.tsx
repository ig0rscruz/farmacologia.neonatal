import { useEffect, useState } from 'react'

type Tema = 'claro' | 'escuro'

function lerTemaSalvo(): Tema {
  try {
    const salvo = localStorage.getItem('neodose-tema')
    if (salvo === 'claro' || salvo === 'escuro') return salvo
  } catch {
    /* localStorage indisponível (modo privado etc.) — cai no padrão do sistema */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro'
}

export function AlternadorTema() {
  const [tema, setTema] = useState<Tema>(lerTemaSalvo)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', tema === 'escuro')
    try {
      localStorage.setItem('neodose-tema', tema)
    } catch {
      /* ignorar falha ao persistir preferência de tema */
    }
  }, [tema])

  return (
    <button
      type="button"
      onClick={() => setTema((t) => (t === 'claro' ? 'escuro' : 'claro'))}
      className="input text-xs py-1 px-2.5 cursor-pointer"
      aria-label={tema === 'claro' ? 'Ativar modo escuro' : 'Ativar modo claro'}
      title={tema === 'claro' ? 'Modo escuro' : 'Modo claro'}
    >
      {tema === 'claro' ? '🌙' : '☀️'}
    </button>
  )
}
