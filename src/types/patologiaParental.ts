import { z } from 'zod'
import { Fonte, Gravidade, NivelEvidencia } from './comum'

export const Parentesco = z.enum(['mae', 'pai', 'ambos'])
export type Parentesco = z.infer<typeof Parentesco>

/**
 * Implicação de uma patologia parental sobre o tratamento do neonato.
 * Referencia um fármaco específico (farmacoId) OU uma classe farmacológica
 * inteira (classeFarmacologica), para não obrigar cadastro par-a-par.
 */
export const ImplicacaoTratamento = z.object({
  farmacoId: z.string().optional(),
  classeFarmacologica: z.string().optional(),
  implicacao: Gravidade,
  conduta: z.string().min(1),
  fontes: z.array(Fonte).min(1),
})
export type ImplicacaoTratamento = z.infer<typeof ImplicacaoTratamento>

export const PatologiaParental = z.object({
  id: z.string().min(1),
  nome: z.string().min(1),
  parentesco: Parentesco,
  descricaoTransmissao: z.string().min(1),
  riscosNeonato: z.array(z.string().min(1)).min(1),
  implicacoesTratamento: z.array(ImplicacaoTratamento),
  nivelEvidencia: NivelEvidencia,
  fontes: z.array(Fonte).min(1),
})
export type PatologiaParental = z.infer<typeof PatologiaParental>
