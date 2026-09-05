import { useMemo, useState, type ReactNode } from 'react'
import type { Farmaco } from '../types/farmaco'
import type { PatologiaParental } from '../types/patologiaParental'
import type { ExamesFuncaoOrgao, Paciente, PosologiaInformada, SinaisVitais } from '../types/paciente'
import { CondicaoClinica, ViaAdministracao } from '../types/comum'
import { sugerirCondicoesPorSinaisVitais } from '../engine/sinaisVitais'
import { useLocale } from '../i18n/LocaleContext'
import { texto } from '../i18n/texto'

interface Props {
  paciente: Paciente
  onChange: (paciente: Paciente) => void
  farmacosDisponiveis: Farmaco[]
  patologiasDisponiveis: PatologiaParental[]
}

const TODAS_CONDICOES = CondicaoClinica.options
const TODAS_VIAS = ViaAdministracao.options

export function FormularioPaciente({ paciente, onChange, farmacosDisponiveis, patologiasDisponiveis }: Props) {
  const { t, idioma } = useLocale()
  const [novoMedicamentoId, setNovoMedicamentoId] = useState('')
  const [novaPosologia, setNovaPosologia] = useState<PosologiaInformada>({})
  const [novaPatologiaId, setNovaPatologiaId] = useState('')
  const [novaPatologiaParentesco, setNovaPatologiaParentesco] = useState<'mae' | 'pai'>('mae')

  function atualizar<K extends keyof Paciente>(campo: K, valor: Paciente[K]) {
    onChange({ ...paciente, [campo]: valor })
  }

  function atualizarSinalVital<K extends keyof SinaisVitais>(campo: K, valor: SinaisVitais[K]) {
    atualizar('sinaisVitais', { ...paciente.sinaisVitais, [campo]: valor })
  }

  function atualizarExameFuncaoOrgao<K extends keyof ExamesFuncaoOrgao>(campo: K, valor: ExamesFuncaoOrgao[K]) {
    atualizar('examesFuncaoOrgao', { ...paciente.examesFuncaoOrgao, [campo]: valor })
  }

  const sugestoesVitais = useMemo(() => sugerirCondicoesPorSinaisVitais(paciente), [paciente])

  function alternarCondicao(condicao: CondicaoClinica) {
    const jaMarcada = paciente.condicoesClinicas.includes(condicao)
    atualizar(
      'condicoesClinicas',
      jaMarcada
        ? paciente.condicoesClinicas.filter((c) => c !== condicao)
        : [...paciente.condicoesClinicas, condicao],
    )
  }

  function adicionarMedicamento() {
    if (!novoMedicamentoId) return
    const posologiaVazia = Object.values(novaPosologia).every((v) => v === undefined || v === '')
    atualizar('medicamentosEmUso', [
      ...paciente.medicamentosEmUso,
      { farmacoId: novoMedicamentoId, posologia: posologiaVazia ? undefined : novaPosologia },
    ])
    setNovoMedicamentoId('')
    setNovaPosologia({})
  }

  function removerMedicamento(index: number) {
    atualizar(
      'medicamentosEmUso',
      paciente.medicamentosEmUso.filter((_, i) => i !== index),
    )
  }

  function adicionarPatologia() {
    if (!novaPatologiaId) return
    atualizar('patologiasParentais', [
      ...paciente.patologiasParentais,
      { patologiaId: novaPatologiaId, parentesco: novaPatologiaParentesco },
    ])
    setNovaPatologiaId('')
  }

  function removerPatologia(index: number) {
    atualizar(
      'patologiasParentais',
      paciente.patologiasParentais.filter((_, i) => i !== index),
    )
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="font-semibold text-slate-800 mb-2">{t.form.dadosNeonato}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Campo label={t.form.identificador}>
            <input
              type="text"
              className="input"
              placeholder={t.form.identificadorPlaceholder}
              value={paciente.identificador ?? ''}
              onChange={(e) => atualizar('identificador', e.target.value)}
            />
          </Campo>
          <Campo label={t.form.idadeGestacional}>
            <input
              type="number"
              className="input"
              min={20}
              max={45}
              step={0.1}
              value={paciente.idadeGestacionalSemanas}
              onChange={(e) => atualizar('idadeGestacionalSemanas', Number(e.target.value))}
            />
          </Campo>
          <Campo label={t.form.idadePosNatal}>
            <input
              type="number"
              className="input"
              min={0}
              value={paciente.idadePosNatalDias}
              onChange={(e) => atualizar('idadePosNatalDias', Number(e.target.value))}
            />
          </Campo>
          <Campo label={t.form.pesoAtual}>
            <input
              type="number"
              className="input"
              min={0}
              value={paciente.pesoAtualG}
              onChange={(e) => atualizar('pesoAtualG', Number(e.target.value))}
            />
          </Campo>
          <Campo label={t.form.pesoNascimento}>
            <input
              type="number"
              className="input"
              min={0}
              value={paciente.pesoNascimentoG ?? ''}
              onChange={(e) => atualizar('pesoNascimentoG', e.target.value ? Number(e.target.value) : undefined)}
            />
          </Campo>
          <Campo label={t.form.comprimento}>
            <input
              type="number"
              className="input"
              min={0}
              value={paciente.comprimentoCm ?? ''}
              onChange={(e) => atualizar('comprimentoCm', e.target.value ? Number(e.target.value) : undefined)}
            />
          </Campo>
        </div>
      </section>

      <section>
        <h2 className="font-semibold text-slate-800 mb-2">{t.form.sinaisVitais}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Campo label={t.form.fc}>
            <input
              type="number"
              className="input"
              min={0}
              value={paciente.sinaisVitais.frequenciaCardiacaBpm ?? ''}
              onChange={(e) =>
                atualizarSinalVital('frequenciaCardiacaBpm', e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </Campo>
          <Campo label={t.form.fr}>
            <input
              type="number"
              className="input"
              min={0}
              value={paciente.sinaisVitais.frequenciaRespiratoriaIrpm ?? ''}
              onChange={(e) =>
                atualizarSinalVital(
                  'frequenciaRespiratoriaIrpm',
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
          </Campo>
          <Campo label={t.form.paSistolica}>
            <input
              type="number"
              className="input"
              min={0}
              value={paciente.sinaisVitais.pressaoArterialSistolicaMmHg ?? ''}
              onChange={(e) =>
                atualizarSinalVital(
                  'pressaoArterialSistolicaMmHg',
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
          </Campo>
          <Campo label={t.form.paDiastolica}>
            <input
              type="number"
              className="input"
              min={0}
              value={paciente.sinaisVitais.pressaoArterialDiastolicaMmHg ?? ''}
              onChange={(e) =>
                atualizarSinalVital(
                  'pressaoArterialDiastolicaMmHg',
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
          </Campo>
          <Campo label={t.form.paMedia}>
            <input
              type="number"
              className="input"
              min={0}
              value={paciente.sinaisVitais.pressaoArterialMediaMmHg ?? ''}
              onChange={(e) =>
                atualizarSinalVital(
                  'pressaoArterialMediaMmHg',
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
          </Campo>
          <Campo label={t.form.satO2}>
            <input
              type="number"
              className="input"
              min={0}
              max={100}
              value={paciente.sinaisVitais.saturacaoOxigenioPercent ?? ''}
              onChange={(e) =>
                atualizarSinalVital(
                  'saturacaoOxigenioPercent',
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
          </Campo>
          <Campo label={t.form.temperatura}>
            <input
              type="number"
              className="input"
              step={0.1}
              value={paciente.sinaisVitais.temperaturaAxilarC ?? ''}
              onChange={(e) =>
                atualizarSinalVital('temperaturaAxilarC', e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </Campo>
        </div>

        {sugestoesVitais.length > 0 && (
          <div className="mt-3 bg-sky-50 border border-sky-200 rounded p-3 space-y-1.5">
            <p className="text-sm font-medium text-sky-900">{t.form.sugestoesTitulo}</p>
            {sugestoesVitais.map((s) => {
              const jaMarcada = paciente.condicoesClinicas.includes(s.condicao)
              return (
                <div key={s.condicao} className="flex items-center justify-between text-sm">
                  <span>
                    <strong>{t.condicoes[s.condicao]}</strong> — {s.motivo}
                  </span>
                  {jaMarcada ? (
                    <span className="text-emerald-700 text-xs">{t.form.sugestaoJaMarcada}</span>
                  ) : (
                    <button type="button" className="btn-secondary text-xs" onClick={() => alternarCondicao(s.condicao)}>
                      {t.form.sugestaoConfirmar}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-semibold text-slate-800 mb-2">{t.form.examesOrgao}</h2>
        <p className="text-xs text-slate-500 mb-2">{t.form.examesOrgaoAviso}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Campo label={t.form.creatinina}>
            <input
              type="number"
              className="input"
              step={0.01}
              min={0}
              value={paciente.examesFuncaoOrgao.creatininaSericaMgDl ?? ''}
              onChange={(e) =>
                atualizarExameFuncaoOrgao('creatininaSericaMgDl', e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </Campo>
          <Campo label={t.form.clearance}>
            <input
              type="number"
              className="input"
              min={0}
              value={paciente.examesFuncaoOrgao.clearanceCreatininaEstimado ?? ''}
              onChange={(e) =>
                atualizarExameFuncaoOrgao(
                  'clearanceCreatininaEstimado',
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
          </Campo>
          <Campo label={t.form.diurese}>
            <input
              type="number"
              className="input"
              step={0.1}
              min={0}
              value={paciente.examesFuncaoOrgao.diureseMlKgHora ?? ''}
              onChange={(e) =>
                atualizarExameFuncaoOrgao('diureseMlKgHora', e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </Campo>
          <Campo label={t.form.bilirrubina}>
            <input
              type="number"
              className="input"
              step={0.1}
              min={0}
              value={paciente.examesFuncaoOrgao.bilirrubinaTotalMgDl ?? ''}
              onChange={(e) =>
                atualizarExameFuncaoOrgao('bilirrubinaTotalMgDl', e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </Campo>
          <Campo label={t.form.tgo}>
            <input
              type="number"
              className="input"
              min={0}
              value={paciente.examesFuncaoOrgao.tgoUl ?? ''}
              onChange={(e) => atualizarExameFuncaoOrgao('tgoUl', e.target.value ? Number(e.target.value) : undefined)}
            />
          </Campo>
          <Campo label={t.form.tgp}>
            <input
              type="number"
              className="input"
              min={0}
              value={paciente.examesFuncaoOrgao.tgpUl ?? ''}
              onChange={(e) => atualizarExameFuncaoOrgao('tgpUl', e.target.value ? Number(e.target.value) : undefined)}
            />
          </Campo>
        </div>
      </section>

      <section>
        <h2 className="font-semibold text-slate-800 mb-2">{t.form.condicoesClinicas}</h2>
        <div className="grid grid-cols-1 gap-1.5">
          {TODAS_CONDICOES.map((condicao) => (
            <label key={condicao} className="flex items-start gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={paciente.condicoesClinicas.includes(condicao)}
                onChange={() => alternarCondicao(condicao)}
              />
              <span>
                {t.condicoes[condicao]}
                {t.criterios[condicao] && <span className="text-slate-500"> — {t.criterios[condicao]}</span>}
              </span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-semibold text-slate-800 mb-2">{t.form.medicamentosEmUso}</h2>
        <p className="text-xs text-slate-500 mb-2">{t.form.medicamentosEmUsoAviso}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          <select
            className="input flex-1 min-w-[10rem]"
            value={novoMedicamentoId}
            onChange={(e) => setNovoMedicamentoId(e.target.value)}
          >
            <option value="">{t.form.selecionarFarmaco}</option>
            {farmacosDisponiveis.map((f) => (
              <option key={f.id} value={f.id}>
                {texto(f.nome, idioma)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          <input
            type="number"
            className="input w-24"
            placeholder={t.form.dose}
            value={novaPosologia.doseValor ?? ''}
            onChange={(e) =>
              setNovaPosologia((p) => ({ ...p, doseValor: e.target.value ? Number(e.target.value) : undefined }))
            }
          />
          <input
            type="text"
            className="input w-32"
            placeholder={t.form.unidade}
            value={novaPosologia.doseUnidade ?? ''}
            onChange={(e) => setNovaPosologia((p) => ({ ...p, doseUnidade: e.target.value || undefined }))}
          />
          <input
            type="number"
            className="input w-24"
            placeholder={t.form.aCada}
            value={novaPosologia.intervaloHoras ?? ''}
            onChange={(e) =>
              setNovaPosologia((p) => ({ ...p, intervaloHoras: e.target.value ? Number(e.target.value) : undefined }))
            }
          />
          <select
            className="input w-36"
            value={novaPosologia.viaAdministracao ?? ''}
            onChange={(e) =>
              setNovaPosologia((p) => ({
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
          <button type="button" className="btn-secondary" onClick={adicionarMedicamento}>
            {t.form.adicionar}
          </button>
        </div>
        <ListaRemovivel
          itens={paciente.medicamentosEmUso.map((m) => {
            const nome = texto(farmacosDisponiveis.find((f) => f.id === m.farmacoId)?.nome ?? { 'pt-BR': m.farmacoId, 'en-US': m.farmacoId, es: m.farmacoId }, idioma)
            if (!m.posologia) return nome
            const { doseValor, doseUnidade, intervaloHoras, viaAdministracao } = m.posologia
            const partes = [
              doseValor !== undefined && `${doseValor} ${doseUnidade ?? ''}`.trim(),
              intervaloHoras !== undefined && `${t.form.aCada.replace(' (h)', '')} ${intervaloHoras}h`,
              viaAdministracao && t.vias[viaAdministracao],
            ].filter(Boolean)
            return partes.length > 0 ? `${nome} — ${partes.join(', ')}` : nome
          })}
          onRemover={removerMedicamento}
          vazio={t.form.nenhumMedicamento}
          removerLabel={t.form.remover}
        />
      </section>

      <section>
        <h2 className="font-semibold text-slate-800 mb-2">{t.form.patologiasParentais}</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          <select
            className="input flex-1 min-w-[10rem]"
            value={novaPatologiaId}
            onChange={(e) => setNovaPatologiaId(e.target.value)}
          >
            <option value="">{t.form.selecionarPatologia}</option>
            {patologiasDisponiveis.map((p) => (
              <option key={p.id} value={p.id}>
                {texto(p.nome, idioma)}
              </option>
            ))}
          </select>
          <select
            className="input"
            value={novaPatologiaParentesco}
            onChange={(e) => setNovaPatologiaParentesco(e.target.value as 'mae' | 'pai')}
          >
            <option value="mae">{t.form.mae}</option>
            <option value="pai">{t.form.pai}</option>
          </select>
          <button type="button" className="btn-secondary" onClick={adicionarPatologia}>
            {t.form.adicionar}
          </button>
        </div>
        <ListaRemovivel
          itens={paciente.patologiasParentais.map((p) => {
            const patologia = patologiasDisponiveis.find((d) => d.id === p.patologiaId)
            const nome = patologia ? texto(patologia.nome, idioma) : p.patologiaId
            return `${nome} (${p.parentesco === 'mae' ? t.form.mae : t.form.pai})`
          })}
          onRemover={removerPatologia}
          vazio={t.form.nenhumaPatologia}
          removerLabel={t.form.remover}
        />
      </section>
    </div>
  )
}

function Campo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-700">
      {label}
      {children}
    </label>
  )
}

function ListaRemovivel({
  itens,
  onRemover,
  vazio,
  removerLabel,
}: {
  itens: string[]
  onRemover: (i: number) => void
  vazio: string
  removerLabel: string
}) {
  if (itens.length === 0) {
    return <p className="text-sm text-slate-400 italic">{vazio}</p>
  }
  return (
    <ul className="space-y-1">
      {itens.map((linha, i) => (
        <li key={i} className="flex items-center justify-between bg-slate-100 rounded px-3 py-1.5 text-sm">
          <span>{linha}</span>
          <button type="button" className="text-red-600 hover:underline" onClick={() => onRemover(i)}>
            {removerLabel}
          </button>
        </li>
      ))}
    </ul>
  )
}
