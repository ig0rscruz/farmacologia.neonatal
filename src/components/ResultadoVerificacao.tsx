import type { DivergenciaPosologia, ResultadoVerificacao as ResultadoVerificacaoType, NivelConfianca } from '../engine/verificarFarmaco'
import type { Farmaco } from '../types/farmaco'
import type { Fonte } from '../types/comum'
import { useLocale } from '../i18n/LocaleContext'
import type { Traducao } from '../i18n/traducoes'
import { texto } from '../i18n/texto'

function estiloNivel(nivel: NivelConfianca, t: Traducao): { titulo: string; classes: string } {
  switch (nivel) {
    case 'adequado':
      return {
        titulo: t.resultado.nivelAdequado,
        classes: 'bg-emerald-50 border-emerald-400 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-700 dark:text-emerald-100',
      }
    case 'usar_com_cautela':
      return {
        titulo: t.resultado.nivelCautela,
        classes: 'bg-amber-50 border-amber-400 text-amber-900 dark:bg-amber-950/40 dark:border-amber-700 dark:text-amber-100',
      }
    case 'contraindicado':
      return {
        titulo: t.resultado.nivelContraindicado,
        classes: 'bg-red-50 border-red-500 text-red-900 dark:bg-red-950/40 dark:border-red-700 dark:text-red-100',
      }
    case 'sem_dados_suficientes':
      return {
        titulo: t.resultado.nivelSemDados,
        classes: 'bg-slate-100 border-slate-400 text-slate-700 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100',
      }
  }
}

function formatarDivergencia(d: DivergenciaPosologia, t: Traducao): string {
  switch (d.tipo) {
    case 'sem_faixa':
      return t.resultado.divergenciaSemFaixa
    case 'dose': {
      const direcao = d.direcao === 'acima' ? t.resultado.direcaoAcima : t.resultado.direcaoAbaixo
      const informado = `${d.informado} ${d.unidadeInformada ?? d.unidadeRecomendada}`
      const recomendado = `${d.recomendado} ${d.unidadeRecomendada}`
      return t.resultado.divergenciaDose(informado, recomendado, direcao)
    }
    case 'intervalo':
      return t.resultado.divergenciaIntervalo(d.informado, d.recomendado)
    case 'via':
      return t.resultado.divergenciaVia(t.vias[d.informado] ?? d.informado, t.vias[d.recomendado] ?? d.recomendado)
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
  const { t, idioma } = useLocale()
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
              <li key={i} className="text-sm bg-white/60 dark:bg-black/25 rounded p-2">
                <span className="font-medium">
                  [{t.gravidade[c.gravidade]}] {t.condicoes[c.condicao]}
                  {t.criterios[c.condicao] && ` (${t.criterios[c.condicao]})`}:
                </span>{' '}
                {texto(c.descricao, idioma)}
                <br />
                <span className="italic">
                  {t.resultado.conduta}: {texto(c.conduta, idioma)}
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
              <li key={i} className="text-sm bg-white/60 dark:bg-black/25 rounded p-2">
                <span className="font-medium">
                  [{t.gravidadeInteracao[e.interacao.gravidade]}] {farmacoNomesPorId[e.outroFarmacoId] ?? e.outroFarmacoId}:
                </span>{' '}
                {texto(e.interacao.efeitoClinico, idioma)}
                <br />
                <span className="italic">
                  {t.resultado.conduta}: {texto(e.interacao.conduta, idioma)}
                </span>
                <div className="mt-1.5 pt-1.5 border-t border-slate-200 dark:border-white/10">
                  <FontesLista fontes={e.interacao.fontes} />
                </div>
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
              <li key={i} className="text-sm bg-white/60 dark:bg-black/25 rounded p-2">
                <span className="font-medium">
                  [{t.gravidade[e.implicacao.implicacao]}] {texto(e.patologia.nome, idioma)}:
                </span>{' '}
                {texto(e.implicacao.conduta, idioma)}
                <div className="mt-1.5 pt-1.5 border-t border-slate-200 dark:border-white/10">
                  <FontesLista fontes={e.implicacao.fontes} />
                </div>
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
  const { t, idioma } = useLocale()
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
            {t.vias[resultado.faixaDoseAplicavel.viaAdministracao]}
          </p>
          {resultado.faixaDoseAplicavel.observacoes && (
            <p className="text-sm italic opacity-80">{texto(resultado.faixaDoseAplicavel.observacoes, idioma)}</p>
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
              <li key={i} className="text-sm bg-white/60 dark:bg-black/25 rounded p-2">
                {formatarDivergencia(d, t)}
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
                <li key={i} className="text-sm bg-white/60 dark:bg-black/25 rounded p-2">
                  <span className="font-medium">{t.condicoes[c.condicao]}:</span> {texto(c.conduta, idioma)}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}

/** Lista as fontes/referências de um item (fármaco, interação ou implicação de patologia parental). */
export function FontesLista({ fontes }: { fontes: Fonte[] }) {
  const { t } = useLocale()
  return (
    <ul className="space-y-1">
      {fontes.map((f, i) => (
        <li key={i} className="text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium">{t.fonteTipo[f.tipo]}:</span> {f.descricao}
          {f.url && (
            <>
              {' — '}
              <a href={f.url} target="_blank" rel="noopener noreferrer" className="underline text-brand-blue-dark dark:text-brand-teal-light">
                {t.resultado.verFonte}
              </a>
            </>
          )}
          {f.dataAcesso && <span> ({f.dataAcesso})</span>}
        </li>
      ))}
    </ul>
  )
}

export function FonteInfo({ farmaco }: { farmaco: Farmaco }) {
  const { t, idioma } = useLocale()
  return (
    <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 space-y-1.5">
      <p>
        {t.resultado.nivelEvidenciaGeral}: <strong>{farmaco.nivelEvidenciaGeral}</strong> —{' '}
        {t.nivelEvidencia[farmaco.nivelEvidenciaGeral]}
      </p>
      <p>
        {t.resultado.ultimaRevisao}: {farmaco.ultimaRevisao.data} — {texto(farmaco.ultimaRevisao.revisadoPor, idioma)}
      </p>
      <div>
        <p className="font-medium">{t.resultado.fontes}:</p>
        <FontesLista fontes={farmaco.fontes} />
      </div>
    </div>
  )
}

