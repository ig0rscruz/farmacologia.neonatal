import { useMemo, useState } from 'react'
import { BannerAviso } from './components/BannerAviso'
import { FormularioPaciente } from './components/FormularioPaciente'
import { FonteInfo, PainelInteracoes, PainelPosologia } from './components/ResultadoVerificacao'
import { SeletorIdioma } from './components/SeletorIdioma'
import { FARMACOS, INTERACOES, PATOLOGIAS_PARENTAIS } from './data'
import { verificarFarmaco, type ResultadoVerificacao } from './engine/verificarFarmaco'
import { useLocale } from './i18n/LocaleContext'
import { texto } from './i18n/texto'
import { ViaAdministracao } from './types/comum'
import { pacienteVazio, type PosologiaInformada } from './types/paciente'

type Aba = 'interacoes' | 'posologia'
const TODAS_VIAS = ViaAdministracao.options

function App() {
  const { t, idioma } = useLocale()
  const [paciente, setPaciente] = useState(pacienteVazio())
  const [candidatoId, setCandidatoId] = useState('')
  const [posologiaCandidato, setPosologiaCandidato] = useState<PosologiaInformada>({})
  const [resultado, setResultado] = useState<ResultadoVerificacao | null>(null)
  const [abaAtiva, setAbaAtiva] = useState<Aba>('interacoes')

  const farmacoNomesPorId = useMemo(
    () => Object.fromEntries(FARMACOS.map((f) => [f.id, texto(f.nome, idioma)])),
    [idioma],
  )
  const farmacoCandidato = FARMACOS.find((f) => f.id === candidatoId)

  function handleVerificar() {
    if (!candidatoId) return
    const posologiaVazia = Object.values(posologiaCandidato).every((v) => v === undefined || v === '')
    setResultado(
      verificarFarmaco(
        paciente,
        candidatoId,
        { farmacos: FARMACOS, interacoes: INTERACOES, patologias: PATOLOGIAS_PARENTAIS },
        posologiaVazia ? undefined : posologiaCandidato,
      ),
    )
  }

  function handleSelecionarCandidato(id: string) {
    setCandidatoId(id)
    setPosologiaCandidato({})
    setResultado(null)
  }

  return (
    <div className="min-h-screen">
      <BannerAviso />
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <header className="relative flex flex-col items-center text-center gap-2 pt-2">
          <div className="absolute right-0 top-2">
            <SeletorIdioma />
          </div>
          <img
            src={`${import.meta.env.BASE_URL}logo-neodose.jpg`}
            alt="NeoDose"
            className="h-44 sm:h-52 w-auto rounded-full"
          />
          <p className="text-brand-teal-dark/80 text-sm max-w-md">{t.app.subtitulo}</p>
        </header>

        <div className="bg-white rounded-2xl border border-brand-teal-light shadow-sm p-4">
          <FormularioPaciente
            paciente={paciente}
            onChange={setPaciente}
            farmacosDisponiveis={FARMACOS}
            patologiasDisponiveis={PATOLOGIAS_PARENTAIS}
          />
        </div>

        <div className="bg-white rounded-2xl border border-brand-teal-light shadow-sm p-4 space-y-3">
          <h2 className="font-semibold text-brand-blue-dark">{t.candidato.titulo}</h2>
          <select
            className="input w-full sm:w-auto sm:min-w-[16rem]"
            value={candidatoId}
            onChange={(e) => handleSelecionarCandidato(e.target.value)}
          >
            <option value="">{t.form.selecionarFarmaco}</option>
            {FARMACOS.map((f) => (
              <option key={f.id} value={f.id}>
                {texto(f.nome, idioma)}
              </option>
            ))}
          </select>

          {candidatoId && (
            <div>
              <p className="text-xs text-slate-500 mb-1">{t.candidato.posologiaAviso}</p>
              <div className="flex flex-wrap gap-2">
                <input
                  type="number"
                  className="input w-24"
                  placeholder={t.form.dose}
                  value={posologiaCandidato.doseValor ?? ''}
                  onChange={(e) =>
                    setPosologiaCandidato((p) => ({
                      ...p,
                      doseValor: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                />
                <input
                  type="text"
                  className="input w-36"
                  placeholder={t.form.unidade}
                  value={posologiaCandidato.doseUnidade ?? ''}
                  onChange={(e) => setPosologiaCandidato((p) => ({ ...p, doseUnidade: e.target.value || undefined }))}
                />
                <input
                  type="number"
                  className="input w-24"
                  placeholder={t.form.aCada}
                  value={posologiaCandidato.intervaloHoras ?? ''}
                  onChange={(e) =>
                    setPosologiaCandidato((p) => ({
                      ...p,
                      intervaloHoras: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                />
                <select
                  className="input w-36"
                  value={posologiaCandidato.viaAdministracao ?? ''}
                  onChange={(e) =>
                    setPosologiaCandidato((p) => ({
                      ...p,
                      viaAdministracao: e.target.value ? (e.target.value as ViaAdministracao) : undefined,
                    }))
                  }
                >
                  <option value="">{t.form.via}</option>
                  {TODAS_VIAS.map((via) => (
                    <option key={via} value={via}>
                      {t.vias[via]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <button type="button" className="btn-primary" disabled={!candidatoId} onClick={handleVerificar}>
            {t.candidato.verificar}
          </button>

          {resultado && (
            <>
              <div className="flex border-b border-brand-teal-light -mb-px">
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium border-b-2 ${
                    abaAtiva === 'interacoes'
                      ? 'border-brand-blue text-brand-blue-dark'
                      : 'border-transparent text-slate-500 hover:text-brand-blue-dark'
                  }`}
                  onClick={() => setAbaAtiva('interacoes')}
                >
                  {t.abas.interacoes}
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium border-b-2 ${
                    abaAtiva === 'posologia'
                      ? 'border-brand-blue text-brand-blue-dark'
                      : 'border-transparent text-slate-500 hover:text-brand-blue-dark'
                  }`}
                  onClick={() => setAbaAtiva('posologia')}
                >
                  {t.abas.posologia}
                </button>
              </div>

              {abaAtiva === 'interacoes' ? (
                <PainelInteracoes resultado={resultado} farmacoNomesPorId={farmacoNomesPorId} />
              ) : (
                <PainelPosologia resultado={resultado} />
              )}
              {farmacoCandidato && <FonteInfo farmaco={farmacoCandidato} />}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
