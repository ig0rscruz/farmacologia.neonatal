import { useMemo, useState } from 'react'
import { BannerAviso } from './components/BannerAviso'
import { FormularioPaciente } from './components/FormularioPaciente'
import { FonteInfo, ResultadoVerificacaoView } from './components/ResultadoVerificacao'
import { FARMACOS, INTERACOES, PATOLOGIAS_PARENTAIS } from './data'
import { verificarFarmaco, type ResultadoVerificacao } from './engine/verificarFarmaco'
import { pacienteVazio } from './types/paciente'

function App() {
  const [paciente, setPaciente] = useState(pacienteVazio())
  const [candidatoId, setCandidatoId] = useState('')
  const [resultado, setResultado] = useState<ResultadoVerificacao | null>(null)

  const farmacoNomesPorId = useMemo(
    () => Object.fromEntries(FARMACOS.map((f) => [f.id, f.nome])),
    [],
  )
  const farmacoCandidato = FARMACOS.find((f) => f.id === candidatoId)

  function handleVerificar() {
    if (!candidatoId) return
    setResultado(
      verificarFarmaco(paciente, candidatoId, {
        farmacos: FARMACOS,
        interacoes: INTERACOES,
        patologias: PATOLOGIAS_PARENTAIS,
      }),
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <BannerAviso />
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-slate-900">Farmacologia Neonatal</h1>
          <p className="text-slate-600 text-sm">
            Verificação de adequação de fármacos, interações medicamentosas e implicações de patologias
            parentais para o paciente neonatal.
          </p>
        </header>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <FormularioPaciente
            paciente={paciente}
            onChange={setPaciente}
            farmacosDisponiveis={FARMACOS}
            patologiasDisponiveis={PATOLOGIAS_PARENTAIS}
          />
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
          <h2 className="font-semibold text-slate-800">Fármaco a ser administrado</h2>
          <div className="flex flex-wrap gap-2">
            <select
              className="input flex-1 min-w-[12rem]"
              value={candidatoId}
              onChange={(e) => {
                setCandidatoId(e.target.value)
                setResultado(null)
              }}
            >
              <option value="">Selecionar fármaco…</option>
              {FARMACOS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nome}
                </option>
              ))}
            </select>
            <button type="button" className="btn-primary" disabled={!candidatoId} onClick={handleVerificar}>
              Verificar
            </button>
          </div>

          {resultado && (
            <>
              <ResultadoVerificacaoView resultado={resultado} farmacoNomesPorId={farmacoNomesPorId} />
              {farmacoCandidato && <FonteInfo farmaco={farmacoCandidato} />}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
