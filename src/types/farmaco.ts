import { z } from 'zod'
import { CondicaoClinica, Fonte, Gravidade, NivelEvidencia } from './comum'

/**
 * Faixa de dose aplicável conforme idade pós-menstrual (PMA = idade gestacional
 * ao nascer + idade pós-natal), idade pós-natal (DOL, dias de vida) e peso atual.
 * Todos os limites são opcionais e inclusivos; uma faixa sem limite mínimo/máximo
 * significa "sem piso/teto definido nessa dimensão".
 */
export const FaixaDose = z.object({
  pmaMinSemanas: z.number().nonnegative().optional(),
  pmaMaxSemanas: z.number().nonnegative().optional(),
  dolMinDias: z.number().nonnegative().optional(),
  dolMaxDias: z.number().nonnegative().optional(),
  pesoMinG: z.number().nonnegative().optional(),
  pesoMaxG: z.number().nonnegative().optional(),
  doseValor: z.number().positive(),
  doseUnidade: z.string().min(1), // ex: "mg/kg/dose"
  intervaloHoras: z.number().nonnegative(), // 0 = dose única (ex.: dose de ataque)
  viaAdministracao: z.string().min(1),
  observacoes: z.string().optional(),
})
export type FaixaDose = z.infer<typeof FaixaDose>

export const ContraindicacaoFarmaco = z.object({
  condicao: CondicaoClinica,
  descricao: z.string().min(1),
  gravidade: Gravidade,
  conduta: z.string().min(1),
})
export type ContraindicacaoFarmaco = z.infer<typeof ContraindicacaoFarmaco>

export const Farmaco = z.object({
  id: z.string().min(1),
  nome: z.string().min(1),
  nomeGenerico: z.string().min(1),
  classeFarmacologica: z.string().min(1),
  indicacoesNeonatais: z.array(z.string().min(1)).min(1),
  viasAdministracao: z.array(z.string().min(1)).min(1),
  faixasDose: z.array(FaixaDose).min(1),
  contraindicacoes: z.array(ContraindicacaoFarmaco),
  alertasGerais: z.array(z.string().min(1)),
  nivelEvidenciaGeral: NivelEvidencia,
  fontes: z.array(Fonte).min(1),
  ultimaRevisao: z.object({
    data: z.string(),
    revisadoPor: z.string().min(1),
  }),
})
export type Farmaco = z.infer<typeof Farmaco>
