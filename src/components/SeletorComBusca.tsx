import { useEffect, useRef, useState } from 'react'

export interface OpcaoBusca {
  id: string
  rotulo: string
}

interface Props {
  opcoes: OpcaoBusca[]
  valor: string
  onSelecionar: (id: string) => void
  placeholder: string
  className?: string
}

function normalizar(texto: string): string {
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
  const opcoesFiltradas = consulta ? opcoes.filter((o) => normalizar(o.rotulo).includes(consulta)) : opcoes

  function selecionar(opcao: OpcaoBusca) {
    onSelecionar(opcao.id)
    setTextoDigitado(opcao.rotulo)
    setAberto(false)
  }

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
        <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-brand-teal-light bg-white shadow-lg">
          {opcoesFiltradas.map((opcao) => (
            <li key={opcao.id}>
              <button
                type="button"
                className="block w-full px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-brand-teal-light"
                onMouseDown={(e) => {
                  e.preventDefault()
                  selecionar(opcao)
                }}
              >
                {opcao.rotulo}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
