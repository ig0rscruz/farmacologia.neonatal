import type { ResultadoVerificacao as ResultadoVerificacaoType, NivelConfianca } from '../engine/verificarFarmaco'
import {
  CONDICAO_CLINICA_CRITERIO,
  CONDICAO_CLINICA_LABEL,
  GRAVIDADE_INTERACAO_LABEL,
  GRAVIDADE_LABEL,
  NIVEL_EVIDENCIA_LABEL,
} from '../types/comum'
import type { Farmaco } from '../types/farmaco'

const ESTILO_NIVEL: Record<NivelConfianca, { titulo: string; classes: string }> = {
  adequado: {
    titulo: 'Adequado conforme critérios cadastrados',
    classes: 'bg-emerald-50 border-emerald-400 text-emerald-900',
  },
  usar_com_cautela: {
    titulo: 'Usar com cautela — há ressalvas a considerar',
    classes: 'bg-amber-50 border-amber-400 text-amber-900',
  },
  contraindicado: {
    titulo: 'Contraindicado para este paciente',
    classes: 'bg-red-50 border-red-500 text-red-900',
  },
  sem_dados_suficientes: {
    titulo: 'Dados insuficientes — nenhuma faixa de dose cadastrada para este perfil',
    classes: 'bg-slate-100 border-slate-400 text-slate-700',
  },
}

export function ResultadoVerificacaoView({
  resultado,
  farmacoNomesPorId,
}: {
  resultado: ResultadoVerificacaoType
  farmacoNomesPorId: Record<string, string>
}) {
  const estilo = ESTILO_NIVEL[resultado.nivelConfianca]

  return (
    <div className={`border-2 rounded-lg p-4 space-y-4 ${estilo.classes}`}>
      <h3 className="font-bold text-lg">{estilo.titulo}</h3>

      {resultado.faixaDoseAplicavel && (
        <div>
          <h4 className="font-semibold mb-1">Dose recomendada para este perfil</h4>
          <p className="text-sm">
            {resultado.faixaDoseAplicavel.doseValor} {resultado.faixaDoseAplicavel.doseUnidade}
            {resultado.faixaDoseAplicavel.intervaloHoras > 0 && ` a cada ${resultado.faixaDoseAplicavel.intervaloHoras}h`} —{' '}
            {resultado.faixaDoseAplicavel.viaAdministracao}
          </p>
          {resultado.faixaDoseAplicavel.observacoes && (
            <p className="text-sm italic opacity-80">{resultado.faixaDoseAplicavel.observacoes}</p>
          )}
        </div>
      )}

      {resultado.contraindicacoesEncontradas.length > 0 && (
        <div>
          <h4 className="font-semibold mb-1">Alertas relacionados às condições clínicas do paciente</h4>
          <ul className="space-y-2">
            {resultado.contraindicacoesEncontradas.map((c, i) => (
              <li key={i} className="text-sm bg-white/60 rounded p-2">
                <span className="font-medium">
                  [{GRAVIDADE_LABEL[c.gravidade]}] {CONDICAO_CLINICA_LABEL[c.condicao]}
                  {CONDICAO_CLINICA_CRITERIO[c.condicao] && ` (${CONDICAO_CLINICA_CRITERIO[c.condicao]})`}:
                </span>{' '}
                {c.descricao}
                <br />
                <span className="italic">Conduta: {c.conduta}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {resultado.interacoesEncontradas.length > 0 && (
        <div>
          <h4 className="font-semibold mb-1">Interações com medicamentos em uso</h4>
          <ul className="space-y-2">
            {resultado.interacoesEncontradas.map((e, i) => (
              <li key={i} className="text-sm bg-white/60 rounded p-2">
                <span className="font-medium">
                  [{GRAVIDADE_INTERACAO_LABEL[e.interacao.gravidade]}] com{' '}
                  {farmacoNomesPorId[e.outroFarmacoId] ?? e.outroFarmacoId}:
                </span>{' '}
                {e.interacao.efeitoClinico}
                <br />
                <span className="italic">Conduta: {e.interacao.conduta}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {resultado.patologiasParentaisEncontradas.length > 0 && (
        <div>
          <h4 className="font-semibold mb-1">Alertas relacionados a patologias parentais</h4>
          <ul className="space-y-2">
            {resultado.patologiasParentaisEncontradas.map((e, i) => (
              <li key={i} className="text-sm bg-white/60 rounded p-2">
                <span className="font-medium">
                  [{GRAVIDADE_LABEL[e.implicacao.implicacao]}] {e.patologia.nome}:
                </span>{' '}
                {e.implicacao.conduta}
              </li>
            ))}
          </ul>
        </div>
      )}

      {resultado.nivelConfianca === 'adequado' && (
        <p className="text-sm italic opacity-70">
          Nenhuma contraindicação, interação ou alerta parental foi encontrado na base de dados cadastrada para
          este perfil de paciente. Isso reflete o conteúdo cadastrado, não uma garantia absoluta de segurança —
          mantenha o julgamento clínico.
        </p>
      )}
    </div>
  )
}

export function FonteInfo({ farmaco }: { farmaco: Farmaco }) {
  return (
    <div className="text-xs text-slate-500 mt-2">
      <p>
        Nível de evidência geral do fármaco: <strong>{farmaco.nivelEvidenciaGeral}</strong> —{' '}
        {NIVEL_EVIDENCIA_LABEL[farmaco.nivelEvidenciaGeral]}
      </p>
      <p>Última revisão: {farmaco.ultimaRevisao.data} por {farmaco.ultimaRevisao.revisadoPor}</p>
    </div>
  )
}
