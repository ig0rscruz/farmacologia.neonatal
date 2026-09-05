import { useEffect, useRef, useState } from 'react'

export interface OpcaoBusca {
  id: string
  rotulo: string
  /** Rótulo de agrupamento opcional (ex.: classe farmacológica) — quando presente, os resultados são exibidos em seções no menu. */
  grupo?: string
}

interface Props {
  opcoes: OpcaoBusca[]
  valor: string
  onSelecionar: (id: string) => void
  placeholder: string
  className?: string
}

export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

export function SeletorComBusca({ opcoes, valor, onSelecionar, placeholder, className }: Props) {
  const [textoDigitado, setTextoDigitado] = useState('')
  const [aberto, setAberto] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const opcaoSelecionada = opcoes.find((o) => o.id === valor)
    setTextoDigitado(opcaoSelecionada ? opcaoSelecionada.rotulo : '')
  }, [valor, opcoes])

  useEffect(() => {
    function aoClicarFora(evento: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(evento.target as Node)) {
        setAberto(false)
      }
    }
    document.addEventListener('mousedown', aoClicarFora)
    return () => document.removeEventListener('mousedown', aoClicarFora)
  }, [])

  const consulta = normalizar(textoDigitado)
  const opcoesFiltradas = (consulta ? opcoes.filter((o) => normalizar(o.rotulo).includes(consulta)) : opcoes)
    .slice()
    .sort((a, b) => (a.grupo ?? '').localeCompare(b.grupo ?? '') || a.rotulo.localeCompare(b.rotulo))

  function selecionar(opcao: OpcaoBusca) {
    onSelecionar(opcao.id)
    setTextoDigitado(opcao.rotulo)
    setAberto(false)
  }

  let grupoAnterior: string | undefined
  return (
    <div className={`relative ${className ?? ''}`} ref={containerRef}>
      <input
        type="text"
        className="input w-full"
        placeholder={placeholder}
        value={textoDigitado}
        onFocus={() => setAberto(true)}
        onChange={(e) => {
          setTextoDigitado(e.target.value)
          setAberto(true)
          if (valor) onSelecionar('')
        }}
      />
      {aberto && opcoesFiltradas.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-brand-teal-light dark:border-slate-600 bg-white dark:bg-slate-800 shadow-lg">
          {opcoesFiltradas.map((opcao) => {
            const novoGrupo = opcao.grupo !== undefined && opcao.grupo !== grupoAnterior
            grupoAnterior = opcao.grupo
            return (
              <li key={opcao.id}>
                {novoGrupo && (
                  <p className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-brand-teal-dark dark:text-brand-teal bg-brand-teal-light/40 dark:bg-slate-900/60">
                    {opcao.grupo}
                  </p>
                )}
                <button
                  type="button"
                  className="block w-full px-3 py-1.5 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-brand-teal-light dark:hover:bg-slate-700"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    selecionar(opcao)
                  }}
                >
                  {opcao.rotulo}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
