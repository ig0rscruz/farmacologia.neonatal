import { z } from 'zod'
import { CondicaoClinica, Fonte, Gravidade, NivelEvidencia, TextoMultilingue, TextoMultilinguaArray, ViaAdministracao } from './comum'

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
  doseUnidade: z.string().min(1), // notação universal, ex: "mg/kg/dose" — não traduzido
  intervaloHoras: z.number().nonnegative(), // 0 = dose única (ex.: dose de ataque)
  viaAdministracao: ViaAdministracao,
  observacoes: TextoMultilingue.optional(),
})
export type FaixaDose = z.infer<typeof FaixaDose>

export const ContraindicacaoFarmaco = z.object({
  condicao: CondicaoClinica,
  descricao: TextoMultilingue,
  gravidade: Gravidade,
  conduta: TextoMultilingue,
})
export type ContraindicacaoFarmaco = z.infer<typeof ContraindicacaoFarmaco>

export const Farmaco = z.object({
  id: z.string().min(1),
  nome: TextoMultilingue,
  nomeGenerico: TextoMultilingue,
  classeFarmacologica: TextoMultilingue,
  indicacoesNeonatais: TextoMultilinguaArray,
  viasAdministracao: z.array(ViaAdministracao).min(1),
  faixasDose: z.array(FaixaDose).min(1),
  contraindicacoes: z.array(ContraindicacaoFarmaco),
  alertasGerais: TextoMultilinguaArray,
  nivelEvidenciaGeral: NivelEvidencia,
  fontes: z.array(Fonte).min(1),
  ultimaRevisao: z.object({
    data: z.string(),
    revisadoPor: TextoMultilingue,
  }),
})
export type Farmaco = z.infer<typeof Farmaco>
