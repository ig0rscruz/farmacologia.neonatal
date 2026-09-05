import { useMemo, useState, type ReactNode } from 'react'
import { SeletorComBusca } from '../components/SeletorComBusca'
import { FonteInfo } from '../components/ResultadoVerificacao'
import { FARMACOS } from '../data'
import type { FaixaDose } from '../types/farmaco'
import { useLocale } from '../i18n/LocaleContext'
import type { Traducao } from '../i18n/traducoes'
import { texto, textoLista } from '../i18n/texto'

function descreverFaixa(f: FaixaDose, t: Traducao): string {
  const criterios: string[] = []
  if (f.pmaMinSemanas !== undefined || f.pmaMaxSemanas !== undefined) {
    if (f.pmaMinSemanas !== undefined && f.pmaMaxSemanas !== undefined) criterios.push(`PMA ${f.pmaMinSemanas}–${f.pmaMaxSemanas} sem`)
    else if (f.pmaMinSemanas !== undefined) criterios.push(`PMA ≥ ${f.pmaMinSemanas} sem`)
    else criterios.push(`PMA ≤ ${f.pmaMaxSemanas} sem`)
  }
  if (f.dolMinDias !== undefined || f.dolMaxDias !== undefined) {
    if (f.dolMinDias !== undefined && f.dolMaxDias !== undefined) criterios.push(`DOL ${f.dolMinDias}–${f.dolMaxDias}d`)
    else if (f.dolMinDias !== undefined) criterios.push(`DOL ≥ ${f.dolMinDias}d`)
    else criterios.push(`DOL ≤ ${f.dolMaxDias}d`)
  }
  if (f.pesoMinG !== undefined || f.pesoMaxG !== undefined) {
    if (f.pesoMinG !== undefined && f.pesoMaxG !== undefined) criterios.push(`${f.pesoMinG}–${f.pesoMaxG} g`)
    else if (f.pesoMinG !== undefined) criterios.push(`≥ ${f.pesoMinG} g`)
    else criterios.push(`≤ ${f.pesoMaxG} g`)
  }
  const cabecalho = criterios.length > 0 ? criterios.join(' · ') : t.resumos.faixasDose
  const intervalo = f.intervaloHoras > 0 ? ` — ${t.resumos.intervalo.toLowerCase()}: ${f.intervaloHoras}h` : ''
  return `${cabecalho}: ${f.doseValor} ${f.doseUnidade}${intervalo} — ${t.vias[f.viaAdministracao]}`
}

export function PaginaResumos() {
  const { t, idioma } = useLocale()
  const [farmacoId, setFarmacoId] = useState('')

  const opcoesFarmacos = useMemo(
    () => FARMACOS.map((f) => ({ id: f.id, rotulo: texto(f.nome, idioma), grupo: texto(f.classeFarmacologica, idioma) })),
    [idioma],
  )
  const farmaco = FARMACOS.find((f) => f.id === farmacoId)

  return (
    <div className="space-y-4">
      <div className="card-surface p-4 space-y-3">
        <div>
          <h2 className="font-semibold text-brand-blue-dark dark:text-brand-teal-light">{t.resumos.titulo}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.resumos.subtitulo}</p>
        </div>
        <SeletorComBusca
          className="w-full sm:w-96"
          opcoes={opcoesFarmacos}
          valor={farmacoId}
          onSelecionar={setFarmacoId}
          placeholder={t.resumos.buscarPlaceholder}
        />
      </div>

      {!farmaco ? (
        <div className="card-surface p-6 text-center text-sm text-slate-400 dark:text-slate-500 italic">
          {t.resumos.selecioneFarmaco}
        </div>
      ) : (
        <div key={farmaco.id} className="card-surface p-4 space-y-4 animate-fade-in">
          <div>
            <h3 className="text-xl font-bold text-brand-blue-dark dark:text-brand-teal-light">{texto(farmaco.nome, idioma)}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t.resumos.nomeGenerico}: {texto(farmaco.nomeGenerico, idioma)}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t.resumos.classeFarmacologica}: {texto(farmaco.classeFarmacologica, idioma)}
            </p>
          </div>

          <Secao titulo={t.resumos.indicacoesNeonatais}>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {textoLista(farmaco.indicacoesNeonatais, idioma).map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          </Secao>

          <Secao titulo={t.resumos.viasAdministracao}>
            <p className="text-sm">{farmaco.viasAdministracao.map((v) => t.vias[v]).join(', ')}</p>
          </Secao>

          <Secao titulo={t.resumos.faixasDose}>
            <ul className="space-y-1.5">
              {farmaco.faixasDose.map((f, idx) => (
                <li key={idx} className="text-sm bg-slate-50 dark:bg-slate-800 rounded p-2">
                  {descreverFaixa(f, t)}
                  {f.observacoes && <p className="text-xs italic text-slate-500 dark:text-slate-400 mt-1">{texto(f.observacoes, idioma)}</p>}
                </li>
              ))}
            </ul>
          </Secao>

          {farmaco.contraindicacoes.length > 0 && (
            <Secao titulo={t.resumos.contraindicacoes}>
              <ul className="space-y-1.5">
                {farmaco.contraindicacoes.map((c, idx) => (
                  <li key={idx} className="text-sm bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded p-2">
                    <span className="font-medium">
                      [{t.gravidade[c.gravidade]}] {t.condicoes[c.condicao]}
                    </span>
                    : {texto(c.descricao, idioma)}
                    <br />
                    <span className="italic">
                      {t.resultado.conduta}: {texto(c.conduta, idioma)}
                    </span>
                  </li>
                ))}
              </ul>
            </Secao>
          )}

          <Secao titulo={t.resumos.alertasGerais}>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {textoLista(farmaco.alertasGerais, idioma).map((a, idx) => (
                <li key={idx}>{a}</li>
              ))}
            </ul>
          </Secao>

          <FonteInfo farmaco={farmaco} />
        </div>
      )}
    </div>
  )
}

function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-1.5">{titulo}</h4>
      {children}
    </div>
  )
}
