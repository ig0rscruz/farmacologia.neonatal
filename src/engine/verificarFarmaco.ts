import type { ContraindicacaoFarmaco, FaixaDose, Farmaco } from '../types/farmaco'
import type { InteracaoMedicamentosa } from '../types/interacao'
import type { ImplicacaoTratamento, PatologiaParental } from '../types/patologiaParental'
import type { Paciente } from '../types/paciente'

export type NivelConfianca = 'adequado' | 'usar_com_cautela' | 'contraindicado' | 'sem_dados_suficientes'

export interface PatologiaParentalEncontrada {
  patologia: PatologiaParental
  implicacao: ImplicacaoTratamento
}

export interface InteracaoEncontrada {
  interacao: InteracaoMedicamentosa
  outroFarmacoId: string
}

export interface ResultadoVerificacao {
  nivelConfianca: NivelConfianca
  faixaDoseAplicavel?: FaixaDose
  contraindicacoesEncontradas: ContraindicacaoFarmaco[]
  interacoesEncontradas: InteracaoEncontrada[]
  patologiasParentaisEncontradas: PatologiaParentalEncontrada[]
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

function classeCorresponde(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase()
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
    patologiasParentaisEncontradas.length > 0
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

  const nivelConfianca = decidirNivelConfianca(
    contraindicacoesEncontradas,
    interacoesEncontradas,
    patologiasParentaisEncontradas,
    faixaDoseAplicavel,
  )

  return {
    nivelConfianca,
    faixaDoseAplicavel,
    contraindicacoesEncontradas,
    interacoesEncontradas,
    patologiasParentaisEncontradas,
  }
}
