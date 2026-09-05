import type { CondicaoClinica } from '../types/comum'
import type { Paciente } from '../types/paciente'

export interface SugestaoCondicao {
  condicao: CondicaoClinica
  motivo: string
}

/**
 * Sugere condições clínicas a partir dos sinais vitais informados, usando os
 * mesmos critérios numéricos documentados em CONDICAO_CLINICA_CRITERIO
 * (src/types/comum.ts). Apenas sugere — o profissional decide se confirma a
 * condição (ver uso em FormularioPaciente).
 */
export function sugerirCondicoesPorSinaisVitais(paciente: Paciente): SugestaoCondicao[] {
  const { sinaisVitais, idadeGestacionalSemanas } = paciente
  const sugestoes: SugestaoCondicao[] = []

  const fc = sinaisVitais.frequenciaCardiacaBpm
  if (fc !== undefined) {
    if (fc < 100) sugestoes.push({ condicao: 'bradicardia', motivo: `FC informada: ${fc} bpm (< 100 bpm)` })
    if (fc > 180) sugestoes.push({ condicao: 'taquicardia', motivo: `FC informada: ${fc} bpm (> 180 bpm)` })
  }

  const fr = sinaisVitais.frequenciaRespiratoriaIrpm
  if (fr !== undefined && fr > 60) {
    sugestoes.push({ condicao: 'taquipneia', motivo: `FR informada: ${fr} irpm (> 60 irpm)` })
  }

  const spo2 = sinaisVitais.saturacaoOxigenioPercent
  if (spo2 !== undefined && spo2 < 90) {
    sugestoes.push({ condicao: 'hipoxemia', motivo: `SatO2 informada: ${spo2}% (< 90%)` })
  }

  const pam = sinaisVitais.pressaoArterialMediaMmHg
  if (pam !== undefined && pam < idadeGestacionalSemanas) {
    sugestoes.push({
      condicao: 'hipotensao',
      motivo: `PAM informada: ${pam} mmHg (< ${idadeGestacionalSemanas} semanas de idade gestacional)`,
    })
  }

  return sugestoes
}
