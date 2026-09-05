import { z } from 'zod'
import { Fonte, GravidadeInteracao, NivelEvidencia, TextoMultilingue } from './comum'

export const InteracaoMedicamentosa = z.object({
  id: z.string().min(1),
  farmacoAId: z.string().min(1),
  farmacoBId: z.string().min(1),
  gravidade: GravidadeInteracao,
  mecanismo: TextoMultilingue,
  efeitoClinico: TextoMultilingue,
  conduta: TextoMultilingue,
  nivelEvidencia: NivelEvidencia,
  fontes: z.array(Fonte).min(1),
})
export type InteracaoMedicamentosa = z.infer<typeof InteracaoMedicamentosa>
