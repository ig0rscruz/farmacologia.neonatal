import { useMemo, useState, type ReactNode } from 'react'
import type { Farmaco } from '../types/farmaco'
import type { PatologiaParental } from '../types/patologiaParental'
import type { Paciente, SinaisVitais } from '../types/paciente'
import { CONDICAO_CLINICA_CRITERIO, CONDICAO_CLINICA_LABEL, CondicaoClinica } from '../types/comum'
import { sugerirCondicoesPorSinaisVitais } from '../engine/sinaisVitais'

interface Props {
  paciente: Paciente
  onChange: (paciente: Paciente) => void
  farmacosDisponiveis: Farmaco[]
  patologiasDisponiveis: PatologiaParental[]
}

const TODAS_CONDICOES = CondicaoClinica.options

export function FormularioPaciente({ paciente, onChange, farmacosDisponiveis, patologiasDisponiveis }: Props) {
  const [novoMedicamentoId, setNovoMedicamentoId] = useState('')
  const [novoMedicamentoDose, setNovoMedicamentoDose] = useState('')
  const [novaPatologiaId, setNovaPatologiaId] = useState('')
  const [novaPatologiaParentesco, setNovaPatologiaParentesco] = useState<'mae' | 'pai'>('mae')

  function atualizar<K extends keyof Paciente>(campo: K, valor: Paciente[K]) {
    onChange({ ...paciente, [campo]: valor })
  }

  function atualizarSinalVital<K extends keyof SinaisVitais>(campo: K, valor: SinaisVitais[K]) {
    atualizar('sinaisVitais', { ...paciente.sinaisVitais, [campo]: valor })
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
    atualizar('medicamentosEmUso', [
      ...paciente.medicamentosEmUso,
      { farmacoId: novoMedicamentoId, doseAtual: novoMedicamentoDose || undefined },
    ])
    setNovoMedicamentoId('')
    setNovoMedicamentoDose('')
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
        <h2 className="font-semibold text-slate-800 mb-2">Dados do neonato</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Campo label="Identificador (opcional)">
            <input
              type="text"
              className="input"
              placeholder="Iniciais / nº prontuário"
              value={paciente.identificador ?? ''}
              onChange={(e) => atualizar('identificador', e.target.value)}
            />
          </Campo>
          <Campo label="Idade gestacional ao nascer (semanas)">
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
          <Campo label="Idade pós-natal (dias de vida)">
            <input
              type="number"
              className="input"
              min={0}
              value={paciente.idadePosNatalDias}
              onChange={(e) => atualizar('idadePosNatalDias', Number(e.target.value))}
            />
          </Campo>
          <Campo label="Peso atual (g)">
            <input
              type="number"
              className="input"
              min={0}
              value={paciente.pesoAtualG}
              onChange={(e) => atualizar('pesoAtualG', Number(e.target.value))}
            />
          </Campo>
          <Campo label="Peso ao nascer (g, opcional)">
            <input
              type="number"
              className="input"
              min={0}
              value={paciente.pesoNascimentoG ?? ''}
              onChange={(e) => atualizar('pesoNascimentoG', e.target.value ? Number(e.target.value) : undefined)}
            />
          </Campo>
          <Campo label="Comprimento (cm, opcional)">
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
        <h2 className="font-semibold text-slate-800 mb-2">Sinais vitais atuais (opcional)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Campo label="FC (bpm)">
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
          <Campo label="FR (irpm)">
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
          <Campo label="PA sistólica (mmHg)">
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
          <Campo label="PA diastólica (mmHg)">
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
          <Campo label="PA média (mmHg)">
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
          <Campo label="SatO2 (%)">
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
          <Campo label="Temperatura axilar (°C)">
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
            <p className="text-sm font-medium text-sky-900">
              Sugestões automáticas com base nos sinais vitais informados (confirme antes de aplicar):
            </p>
            {sugestoesVitais.map((s) => {
              const jaMarcada = paciente.condicoesClinicas.includes(s.condicao)
              return (
                <div key={s.condicao} className="flex items-center justify-between text-sm">
                  <span>
                    <strong>{CONDICAO_CLINICA_LABEL[s.condicao]}</strong> — {s.motivo}
                  </span>
                  {jaMarcada ? (
                    <span className="text-emerald-700 text-xs">já marcada</span>
                  ) : (
                    <button type="button" className="btn-secondary text-xs" onClick={() => alternarCondicao(s.condicao)}>
                      Confirmar
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-semibold text-slate-800 mb-2">
          Condições clínicas identificadas (anamnese / exames)
        </h2>
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
                {CONDICAO_CLINICA_LABEL[condicao]}
                {CONDICAO_CLINICA_CRITERIO[condicao] && (
                  <span className="text-slate-500"> — {CONDICAO_CLINICA_CRITERIO[condicao]}</span>
                )}
              </span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-semibold text-slate-800 mb-2">Medicamentos já em uso pelo neonato</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          <select className="input flex-1 min-w-[10rem]" value={novoMedicamentoId} onChange={(e) => setNovoMedicamentoId(e.target.value)}>
            <option value="">Selecionar fármaco…</option>
            {farmacosDisponiveis.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nome}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="input flex-1 min-w-[8rem]"
            placeholder="Dose atual (opcional)"
            value={novoMedicamentoDose}
            onChange={(e) => setNovoMedicamentoDose(e.target.value)}
          />
          <button type="button" className="btn-secondary" onClick={adicionarMedicamento}>
            Adicionar
          </button>
        </div>
        <ListaRemovivel
          itens={paciente.medicamentosEmUso.map(
            (m) => farmacosDisponiveis.find((f) => f.id === m.farmacoId)?.nome ?? m.farmacoId,
          )}
          onRemover={removerMedicamento}
          vazio="Nenhum medicamento em uso adicionado."
        />
      </section>

      <section>
        <h2 className="font-semibold text-slate-800 mb-2">Patologias parentais (pai/mãe)</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          <select className="input flex-1 min-w-[10rem]" value={novaPatologiaId} onChange={(e) => setNovaPatologiaId(e.target.value)}>
            <option value="">Selecionar patologia…</option>
            {patologiasDisponiveis.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
          <select
            className="input"
            value={novaPatologiaParentesco}
            onChange={(e) => setNovaPatologiaParentesco(e.target.value as 'mae' | 'pai')}
          >
            <option value="mae">Mãe</option>
            <option value="pai">Pai</option>
          </select>
          <button type="button" className="btn-secondary" onClick={adicionarPatologia}>
            Adicionar
          </button>
        </div>
        <ListaRemovivel
          itens={paciente.patologiasParentais.map((p) => {
            const nome = patologiasDisponiveis.find((d) => d.id === p.patologiaId)?.nome ?? p.patologiaId
            return `${nome} (${p.parentesco === 'mae' ? 'mãe' : 'pai'})`
          })}
          onRemover={removerPatologia}
          vazio="Nenhuma patologia parental adicionada."
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

function ListaRemovivel({ itens, onRemover, vazio }: { itens: string[]; onRemover: (i: number) => void; vazio: string }) {
  if (itens.length === 0) {
    return <p className="text-sm text-slate-400 italic">{vazio}</p>
  }
  return (
    <ul className="space-y-1">
      {itens.map((texto, i) => (
        <li key={i} className="flex items-center justify-between bg-slate-100 rounded px-3 py-1.5 text-sm">
          <span>{texto}</span>
          <button type="button" className="text-red-600 hover:underline" onClick={() => onRemover(i)}>
            remover
          </button>
        </li>
      ))}
    </ul>
  )
}
