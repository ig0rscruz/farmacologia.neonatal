import { z } from 'zod'
import { CondicaoClinica } from './comum'

/**
 * Dados do paciente preenchidos pelo profissional durante o atendimento.
 * IMPORTANTE: estes dados existem apenas em memória (estado React) durante a
 * sessão de uso — não são salvos em localStorage, backend ou no repositório
 * Git. Recarregar a página limpa os dados. Isso é intencional: são dados
 * sensíveis de paciente e não devem ser persistidos sem uma solução de
 * armazenamento clínico adequada (prontuário eletrônico, LGPD, etc.).
 */
export const MedicamentoEmUso = z.object({
  farmacoId: z.string().min(1),
  doseAtual: z.string().optional(),
  inicioUso: z.string().optional(),
})
export type MedicamentoEmUso = z.infer<typeof MedicamentoEmUso>

export const PatologiaParentalSelecionada = z.object({
  patologiaId: z.string().min(1),
  parentesco: z.enum(['mae', 'pai']),
})
export type PatologiaParentalSelecionada = z.infer<typeof PatologiaParentalSelecionada>

/**
 * Sinais vitais medidos no momento da avaliação. Todos opcionais — usados para
 * sugerir automaticamente condições clínicas (ex.: FC < 100 sugere bradicardia),
 * mas a confirmação final da condição continua a cargo do profissional.
 */
export const SinaisVitais = z.object({
  frequenciaCardiacaBpm: z.number().positive().optional(),
  frequenciaRespiratoriaIrpm: z.number().positive().optional(),
  pressaoArterialSistolicaMmHg: z.number().positive().optional(),
  pressaoArterialDiastolicaMmHg: z.number().positive().optional(),
  pressaoArterialMediaMmHg: z.number().positive().optional(),
  saturacaoOxigenioPercent: z.number().min(0).max(100).optional(),
  temperaturaAxilarC: z.number().optional(),
})
export type SinaisVitais = z.infer<typeof SinaisVitais>

export const Paciente = z.object({
  identificador: z.string().optional(), // opcional: iniciais/prontuário, nunca dado sensível completo
  idadeGestacionalSemanas: z.number().min(20).max(45),
  idadePosNatalDias: z.number().min(0),
  pesoAtualG: z.number().positive(),
  pesoNascimentoG: z.number().positive().optional(),
  comprimentoCm: z.number().positive().optional(),
  sinaisVitais: SinaisVitais,
  condicoesClinicas: z.array(CondicaoClinica),
  medicamentosEmUso: z.array(MedicamentoEmUso),
  patologiasParentais: z.array(PatologiaParentalSelecionada),
})
export type Paciente = z.infer<typeof Paciente>

export function pacienteVazio(): Paciente {
  return {
    identificador: '',
    idadeGestacionalSemanas: 40,
    idadePosNatalDias: 0,
    pesoAtualG: 3000,
    pesoNascimentoG: undefined,
    comprimentoCm: undefined,
    sinaisVitais: {},
    condicoesClinicas: [],
    medicamentosEmUso: [],
    patologiasParentais: [],
  }
}
