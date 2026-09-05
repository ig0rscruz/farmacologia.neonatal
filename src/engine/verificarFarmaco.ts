import type { ContraindicacaoFarmaco, FaixaDose, Farmaco } from '../types/farmaco'
import type { InteracaoMedicamentosa } from '../types/interacao'
import type { ImplicacaoTratamento, PatologiaParental } from '../types/patologiaParental'
import type { Paciente, PosologiaInformada } from '../types/paciente'

export type NivelConfianca = 'adequado' | 'usar_com_cautela' | 'contraindicado' | 'sem_dados_suficientes'

export interface PatologiaParentalEncontrada {
  patologia: PatologiaParental
  implicacao: ImplicacaoTratamento
}

export interface InteracaoEncontrada {
  interacao: InteracaoMedicamentosa
  outroFarmacoId: string
}

/**
 * Divergência entre a posologia informada e a faixa recomendada. Sem texto
 * pré-formatado de propósito — a tradução/formatação para o idioma atual fica
 * a cargo do componente de exibição (ver PainelPosologia), mantendo o motor
 * de verificação independente de idioma.
 */
export type DivergenciaPosologia =
  | { tipo: 'sem_faixa' }
  | { tipo: 'dose'; informado: number; unidadeInformada?: string; recomendado: number; unidadeRecomendada: string; direcao: 'acima' | 'abaixo' }
  | { tipo: 'intervalo'; informado: number; recomendado: number }
  | { tipo: 'via'; informado: string; recomendado: string }

export interface ResultadoVerificacao {
  nivelConfianca: NivelConfianca
  faixaDoseAplicavel?: FaixaDose
  contraindicacoesEncontradas: ContraindicacaoFarmaco[]
  interacoesEncontradas: InteracaoEncontrada[]
  patologiasParentaisEncontradas: PatologiaParentalEncontrada[]
  divergenciasPosologia: DivergenciaPosologia[]
}

/** Tolerância de divergência de dose antes de sinalizar (20%). */
const TOLERANCIA_DOSE = 0.2

/**
 * Compara a posologia informada (o que está/será efetivamente prescrito) com a
 * faixa de dose recomendada para o perfil do paciente. Não substitui os ajustes
 * de função renal/hepática já cadastrados em `contraindicacoes` (gravidade
 * `ajustar_dose`) — esses continuam aparecendo separadamente; esta função só
 * aponta divergência numérica/categórica entre o prescrito e o recomendado.
 */
export function compararPosologia(
  informada: PosologiaInformada | undefined,
  faixa: FaixaDose | undefined,
): DivergenciaPosologia[] {
  if (!informada) return []
  const divergencias: DivergenciaPosologia[] = []

  if (!faixa) {
    if (informada.doseValor !== undefined || informada.intervaloHoras !== undefined) {
      divergencias.push({ tipo: 'sem_faixa' })
    }
    return divergencias
  }

  if (informada.doseValor !== undefined) {
    const diferenca = Math.abs(informada.doseValor - faixa.doseValor) / faixa.doseValor
    if (diferenca > TOLERANCIA_DOSE) {
      divergencias.push({
        tipo: 'dose',
        informado: informada.doseValor,
        unidadeInformada: informada.doseUnidade,
        recomendado: faixa.doseValor,
        unidadeRecomendada: faixa.doseUnidade,
        direcao: informada.doseValor > faixa.doseValor ? 'acima' : 'abaixo',
      })
    }
  }

  if (informada.intervaloHoras !== undefined && faixa.intervaloHoras > 0 && informada.intervaloHoras !== faixa.intervaloHoras) {
    divergencias.push({ tipo: 'intervalo', informado: informada.intervaloHoras, recomendado: faixa.intervaloHoras })
  }

  if (informada.viaAdministracao && informada.viaAdministracao !== faixa.viaAdministracao) {
    divergencias.push({ tipo: 'via', informado: informada.viaAdministracao, recomendado: faixa.viaAdministracao })
  }

  return divergencias
}

/** Idade pós-menstrual em semanas = idade gestacional ao nascer + idade pós-natal (convertida em semanas). */
export function calcularIdadePosMenstrualSemanas(paciente: Paciente): number {
  return paciente.idadeGestacionalSemanas + paciente.idadePosNatalDias / 7
}

export function encontrarFaixaDoseAplicavel(farmaco: Farmaco, paciente: Paciente): FaixaDose | undefined {
  const pma = calcularIdadePosMenstrualSemanas(paciente)
  return farmaco.faixasDose.find((faixa) => {
    if (faixa.pmaMinSemanas !== undefined && pma < faixa.pmaMinSemanas) return false
    if (faixa.pmaMaxSemanas !== undefined && pma > faixa.pmaMaxSemanas) return false
    if (faixa.dolMinDias !== undefined && paciente.idadePosNatalDias < faixa.dolMinDias) return false
    if (faixa.dolMaxDias !== undefined && paciente.idadePosNatalDias > faixa.dolMaxDias) return false
    if (faixa.pesoMinG !== undefined && paciente.pesoAtualG < faixa.pesoMinG) return false
    if (faixa.pesoMaxG !== undefined && paciente.pesoAtualG > faixa.pesoMaxG) return false
    return true
  })
}

export function verificarContraindicacoes(farmaco: Farmaco, paciente: Paciente): ContraindicacaoFarmaco[] {
  const condicoesPaciente = new Set(paciente.condicoesClinicas)
  return farmaco.contraindicacoes.filter((c) => condicoesPaciente.has(c.condicao))
}

export function verificarInteracoes(
  candidatoId: string,
  medicamentosEmUsoIds: string[],
  interacoes: InteracaoMedicamentosa[],
): InteracaoEncontrada[] {
  const encontradas: InteracaoEncontrada[] = []
  for (const emUsoId of medicamentosEmUsoIds) {
    if (emUsoId === candidatoId) continue
    const interacao = interacoes.find(
      (i) =>
        (i.farmacoAId === candidatoId && i.farmacoBId === emUsoId) ||
        (i.farmacoBId === candidatoId && i.farmacoAId === emUsoId),
    )
    if (interacao) encontradas.push({ interacao, outroFarmacoId: emUsoId })
  }
  return encontradas
}

/**
 * Compara classes farmacológicas pelo valor pt-BR (fonte primária), não pelo
 * idioma de exibição atual — garante que o cruzamento de dados funcione
 * igual independente do idioma selecionado na interface.
 */
function classeCorresponde(a: { 'pt-BR': string }, b: { 'pt-BR': string }): boolean {
  return a['pt-BR'].trim().toLowerCase() === b['pt-BR'].trim().toLowerCase()
}

export function verificarPatologiasParentais(
  farmacoCandidato: Farmaco,
  patologiasSelecionadasIds: string[],
  patologias: PatologiaParental[],
): PatologiaParentalEncontrada[] {
  const encontradas: PatologiaParentalEncontrada[] = []
  for (const patologiaId of patologiasSelecionadasIds) {
    const patologia = patologias.find((p) => p.id === patologiaId)
    if (!patologia) continue
    for (const implicacao of patologia.implicacoesTratamento) {
      const corresponde =
        implicacao.farmacoId === farmacoCandidato.id ||
        (implicacao.classeFarmacologica !== undefined &&
          classeCorresponde(implicacao.classeFarmacologica, farmacoCandidato.classeFarmacologica))
      if (corresponde) encontradas.push({ patologia, implicacao })
    }
  }
  return encontradas
}

function decidirNivelConfianca(
  contraindicacoesEncontradas: ContraindicacaoFarmaco[],
  interacoesEncontradas: InteracaoEncontrada[],
  patologiasParentaisEncontradas: PatologiaParentalEncontrada[],
  faixaDoseAplicavel: FaixaDose | undefined,
  divergenciasPosologia: DivergenciaPosologia[],
): NivelConfianca {
  const temContraindicacaoAbsoluta = contraindicacoesEncontradas.some((c) => c.gravidade === 'contraindicado')
  const temInteracaoContraindicada = interacoesEncontradas.some((e) => e.interacao.gravidade === 'contraindicada')
  const temPatologiaContraindica = patologiasParentaisEncontradas.some((e) => e.implicacao.implicacao === 'contraindicado')
  if (temContraindicacaoAbsoluta || temInteracaoContraindicada || temPatologiaContraindica) {
    return 'contraindicado'
  }

  const temAlertaCautela =
    contraindicacoesEncontradas.length > 0 ||
    interacoesEncontradas.some((e) => e.interacao.gravidade === 'grave' || e.interacao.gravidade === 'moderada') ||
    patologiasParentaisEncontradas.length > 0 ||
    divergenciasPosologia.length > 0
  if (temAlertaCautela) {
    return 'usar_com_cautela'
  }

  if (!faixaDoseAplicavel) {
    return 'sem_dados_suficientes'
  }

  return 'adequado'
}

export function verificarFarmaco(
  paciente: Paciente,
  candidatoId: string,
  contexto: { farmacos: Farmaco[]; interacoes: InteracaoMedicamentosa[]; patologias: PatologiaParental[] },
  posologiaInformada?: PosologiaInformada,
): ResultadoVerificacao {
  const farmaco = contexto.farmacos.find((f) => f.id === candidatoId)
  if (!farmaco) {
    throw new Error(`Fármaco "${candidatoId}" não encontrado na base de dados.`)
  }

  const faixaDoseAplicavel = encontrarFaixaDoseAplicavel(farmaco, paciente)
  const contraindicacoesEncontradas = verificarContraindicacoes(farmaco, paciente)
  const interacoesEncontradas = verificarInteracoes(
    candidatoId,
    paciente.medicamentosEmUso.map((m) => m.farmacoId),
    contexto.interacoes,
  )
  const patologiasParentaisEncontradas = verificarPatologiasParentais(
    farmaco,
    paciente.patologiasParentais.map((p) => p.patologiaId),
    contexto.patologias,
  )
  const divergenciasPosologia = compararPosologia(posologiaInformada, faixaDoseAplicavel)

  const nivelConfianca = decidirNivelConfianca(
    contraindicacoesEncontradas,
    interacoesEncontradas,
    patologiasParentaisEncontradas,
    faixaDoseAplicavel,
    divergenciasPosologia,
  )

  return {
    nivelConfianca,
    faixaDoseAplicavel,
    contraindicacoesEncontradas,
    interacoesEncontradas,
    patologiasParentaisEncontradas,
    divergenciasPosologia,
  }
}
