import type { ResultadoVerificacao as ResultadoVerificacaoType, NivelConfianca } from '../engine/verificarFarmaco'
import type { Farmaco } from '../types/farmaco'
import { useLocale } from '../i18n/LocaleContext'
import type { Traducao } from '../i18n/traducoes'

function estiloNivel(nivel: NivelConfianca, t: Traducao): { titulo: string; classes: string } {
  switch (nivel) {
    case 'adequado':
      return { titulo: t.resultado.nivelAdequado, classes: 'bg-emerald-50 border-emerald-400 text-emerald-900' }
    case 'usar_com_cautela':
      return { titulo: t.resultado.nivelCautela, classes: 'bg-amber-50 border-amber-400 text-amber-900' }
    case 'contraindicado':
      return { titulo: t.resultado.nivelContraindicado, classes: 'bg-red-50 border-red-500 text-red-900' }
    case 'sem_dados_suficientes':
      return { titulo: t.resultado.nivelSemDados, classes: 'bg-slate-100 border-slate-400 text-slate-700' }
  }
}

/** Painel da aba "Interações": contraindicações por condição clínica, interações medicamentosas e patologias parentais. */
export function PainelInteracoes({
  resultado,
  farmacoNomesPorId,
}: {
  resultado: ResultadoVerificacaoType
  farmacoNomesPorId: Record<string, string>
}) {
  const { t } = useLocale()
  const estilo = estiloNivel(resultado.nivelConfianca, t)
  const semAlertas =
    resultado.contraindicacoesEncontradas.length === 0 &&
    resultado.interacoesEncontradas.length === 0 &&
    resultado.patologiasParentaisEncontradas.length === 0

  return (
    <div className={`border-2 rounded-lg p-4 space-y-4 ${estilo.classes}`}>
      <h3 className="font-bold text-lg">{estilo.titulo}</h3>

      {resultado.contraindicacoesEncontradas.length > 0 && (
        <div>
          <h4 className="font-semibold mb-1">{t.resultado.alertasCondicoes}</h4>
          <ul className="space-y-2">
            {resultado.contraindicacoesEncontradas.map((c, i) => (
              <li key={i} className="text-sm bg-white/60 rounded p-2">
                <span className="font-medium">
                  [{t.gravidade[c.gravidade]}] {t.condicoes[c.condicao]}
                  {t.criterios[c.condicao] && ` (${t.criterios[c.condicao]})`}:
                </span>{' '}
                {c.descricao}
                <br />
                <span className="italic">
                  {t.resultado.conduta}: {c.conduta}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {resultado.interacoesEncontradas.length > 0 && (
        <div>
          <h4 className="font-semibold mb-1">{t.resultado.interacoesComEmUso}</h4>
          <ul className="space-y-2">
            {resultado.interacoesEncontradas.map((e, i) => (
              <li key={i} className="text-sm bg-white/60 rounded p-2">
                <span className="font-medium">
                  [{t.gravidadeInteracao[e.interacao.gravidade]}] {farmacoNomesPorId[e.outroFarmacoId] ?? e.outroFarmacoId}:
                </span>{' '}
                {e.interacao.efeitoClinico}
                <br />
                <span className="italic">
                  {t.resultado.conduta}: {e.interacao.conduta}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {resultado.patologiasParentaisEncontradas.length > 0 && (
        <div>
          <h4 className="font-semibold mb-1">{t.resultado.alertasPatologiasParentais}</h4>
          <ul className="space-y-2">
            {resultado.patologiasParentaisEncontradas.map((e, i) => (
              <li key={i} className="text-sm bg-white/60 rounded p-2">
                <span className="font-medium">
                  [{t.gravidade[e.implicacao.implicacao]}] {e.patologia.nome}:
                </span>{' '}
                {e.implicacao.conduta}
              </li>
            ))}
          </ul>
        </div>
      )}

      {semAlertas && <p className="text-sm italic opacity-70">{t.resultado.semAlertas}</p>}
    </div>
  )
}

/** Painel da aba "Posologia": faixa de dose recomendada e divergência com a posologia informada. */
export function PainelPosologia({ resultado }: { resultado: ResultadoVerificacaoType }) {
  const { t } = useLocale()
  const estilo = estiloNivel(resultado.nivelConfianca, t)

  return (
    <div className={`border-2 rounded-lg p-4 space-y-4 ${estilo.classes}`}>
      <h3 className="font-bold text-lg">{estilo.titulo}</h3>

      {resultado.faixaDoseAplicavel ? (
        <div>
          <h4 className="font-semibold mb-1">{t.resultado.doseRecomendada}</h4>
          <p className="text-sm">
            {resultado.faixaDoseAplicavel.doseValor} {resultado.faixaDoseAplicavel.doseUnidade}
            {resultado.faixaDoseAplicavel.intervaloHoras > 0 && ` — ${resultado.faixaDoseAplicavel.intervaloHoras}h`} —{' '}
            {resultado.faixaDoseAplicavel.viaAdministracao}
          </p>
          {resultado.faixaDoseAplicavel.observacoes && (
            <p className="text-sm italic opacity-80">{resultado.faixaDoseAplicavel.observacoes}</p>
          )}
        </div>
      ) : (
        <p className="text-sm">{t.resultado.semFaixaDose}</p>
      )}

      {resultado.divergenciasPosologia.length > 0 && (
        <div>
          <h4 className="font-semibold mb-1">{t.resultado.divergenciasPosologia}</h4>
          <ul className="space-y-2">
            {resultado.divergenciasPosologia.map((d, i) => (
              <li key={i} className="text-sm bg-white/60 rounded p-2">
                {d}
              </li>
            ))}
          </ul>
        </div>
      )}

      {resultado.contraindicacoesEncontradas.some((c) => c.gravidade === 'ajustar_dose') && (
        <div>
          <h4 className="font-semibold mb-1">{t.resultado.ajustesFuncaoOrgao}</h4>
          <ul className="space-y-2">
            {resultado.contraindicacoesEncontradas
              .filter((c) => c.gravidade === 'ajustar_dose')
              .map((c, i) => (
                <li key={i} className="text-sm bg-white/60 rounded p-2">
                  <span className="font-medium">{t.condicoes[c.condicao]}:</span> {c.conduta}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function FonteInfo({ farmaco }: { farmaco: Farmaco }) {
  const { t } = useLocale()
  return (
    <div className="text-xs text-slate-500 mt-2">
      <p>
        {t.resultado.nivelEvidenciaGeral}: <strong>{farmaco.nivelEvidenciaGeral}</strong> —{' '}
        {t.nivelEvidencia[farmaco.nivelEvidenciaGeral]}
      </p>
      <p>
        {t.resultado.ultimaRevisao}: {farmaco.ultimaRevisao.data} — {farmaco.ultimaRevisao.revisadoPor}
      </p>
    </div>
  )
}
