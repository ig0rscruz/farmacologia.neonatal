import { z } from 'zod'
import { Fonte, Gravidade, NivelEvidencia, TextoMultilingue, TextoMultilinguaArray } from './comum'

export const Parentesco = z.enum(['mae', 'pai', 'ambos'])
export type Parentesco = z.infer<typeof Parentesco>

/**
 * Implicação de uma patologia parental sobre o tratamento do neonato.
 * Referencia um fármaco específico (farmacoId) OU uma classe farmacológica
 * inteira (classeFarmacologica, comparada pelo valor pt-BR — ver
 * classeCorresponde em src/engine/verificarFarmaco.ts), para não obrigar
 * cadastro par-a-par.
 */
export const ImplicacaoTratamento = z.object({
  farmacoId: z.string().optional(),
  classeFarmacologica: TextoMultilingue.optional(),
  implicacao: Gravidade,
  conduta: TextoMultilingue,
  fontes: z.array(Fonte).min(1),
})
export type ImplicacaoTratamento = z.infer<typeof ImplicacaoTratamento>

export const PatologiaParental = z.object({
  id: z.string().min(1),
  nome: TextoMultilingue,
  parentesco: Parentesco,
  descricaoTransmissao: TextoMultilingue,
  riscosNeonato: TextoMultilinguaArray,
  implicacoesTratamento: z.array(ImplicacaoTratamento),
  nivelEvidencia: NivelEvidencia,
  fontes: z.array(Fonte).min(1),
})
export type PatologiaParental = z.infer<typeof PatologiaParental>
