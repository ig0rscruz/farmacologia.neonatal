import { useMemo, useState } from 'react'
import { CampoDoseUnidade } from '../components/CampoDoseUnidade'
import { FormularioPaciente } from '../components/FormularioPaciente'
import { FonteInfo, PainelInteracoes, PainelPosologia } from '../components/ResultadoVerificacao'
import { SeletorComBusca } from '../components/SeletorComBusca'
import { FARMACOS, INTERACOES, PATOLOGIAS_PARENTAIS } from '../data'
import { verificarFarmaco, type ResultadoVerificacao } from '../engine/verificarFarmaco'
import { useLocale } from '../i18n/LocaleContext'
import { texto } from '../i18n/texto'
import { ViaAdministracao } from '../types/comum'
import { pacienteVazio, type Paciente, type PosologiaInformada } from '../types/paciente'

type Aba = 'interacoes' | 'posologia'
const TODAS_VIAS = ViaAdministracao.options

function assinatura(paciente: Paciente, candidatoId: string, posologia: PosologiaInformada): string {
  return JSON.stringify({ paciente, candidatoId, posologia })
}

export function PaginaCalculadora() {
  const { t, idioma } = useLocale()
  const [paciente, setPaciente] = useState(pacienteVazio())
  const [candidatoId, setCandidatoId] = useState('')
  const [posologiaCandidato, setPosologiaCandidato] = useState<PosologiaInformada>({})
  const [resultado, setResultado] = useState<ResultadoVerificacao | null>(null)
  const [assinaturaVerificada, setAssinaturaVerificada] = useState('')
  const [abaAtiva, setAbaAtiva] = useState<Aba>('interacoes')

  const farmacoNomesPorId = useMemo(
    () => Object.fromEntries(FARMACOS.map((f) => [f.id, texto(f.nome, idioma)])),
    [idioma],
  )
  const opcoesFarmacos = useMemo(
    () => FARMACOS.map((f) => ({ id: f.id, rotulo: texto(f.nome, idioma) })),
    [idioma],
  )
  const farmacoCandidato = FARMACOS.find((f) => f.id === candidatoId)
  const desatualizado = resultado !== null && assinaturaVerificada !== assinatura(paciente, candidatoId, posologiaCandidato)

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
    setAssinaturaVerificada(assinatura(paciente, candidatoId, posologiaCandidato))
  }

  function handleSelecionarCandidato(id: string) {
    setCandidatoId(id)
    setPosologiaCandidato({})
    setResultado(null)
  }

  return (
    <div className="space-y-6">
      <div className="card-surface p-4">
        <FormularioPaciente
          paciente={paciente}
          onChange={setPaciente}
          farmacosDisponiveis={FARMACOS}
          patologiasDisponiveis={PATOLOGIAS_PARENTAIS}
        />
      </div>

      <div className="card-surface p-4 space-y-3">
        <h2 className="font-semibold text-brand-blue-dark dark:text-brand-teal-light">{t.candidato.titulo}</h2>
        <SeletorComBusca
          className="w-full sm:w-auto sm:min-w-[16rem]"
          opcoes={opcoesFarmacos}
          valor={candidatoId}
          onSelecionar={handleSelecionarCandidato}
          placeholder={t.form.selecionarFarmaco}
        />

        {candidatoId && (
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t.candidato.posologiaAviso}</p>
            <div className="flex flex-wrap gap-2">
              <CampoDoseUnidade
                className="w-48"
                doseValor={posologiaCandidato.doseValor}
                doseUnidade={posologiaCandidato.doseUnidade}
                onChangeDose={(v) => setPosologiaCandidato((p) => ({ ...p, doseValor: v }))}
                onChangeUnidade={(v) => setPosologiaCandidato((p) => ({ ...p, doseUnidade: v }))}
                placeholderDose={t.form.dose}
                placeholderUnidade={t.form.unidade}
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

        {desatualizado && (
          <div className="text-sm bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded-lg px-3 py-2 animate-fade-in">
            {t.candidato.dadosDesatualizados}
          </div>
        )}

        {resultado && (
          <div key={assinaturaVerificada} className="animate-fade-in space-y-3">
            <div className="flex border-b border-brand-teal-light dark:border-slate-700 -mb-px">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  abaAtiva === 'interacoes'
                    ? 'border-brand-blue text-brand-blue-dark dark:text-brand-teal-light'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-brand-blue-dark dark:hover:text-brand-teal-light'
                }`}
                onClick={() => setAbaAtiva('interacoes')}
              >
                {t.abas.interacoes}
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  abaAtiva === 'posologia'
                    ? 'border-brand-blue text-brand-blue-dark dark:text-brand-teal-light'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-brand-blue-dark dark:hover:text-brand-teal-light'
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
          </div>
        )}
      </div>
    </div>
  )
}
