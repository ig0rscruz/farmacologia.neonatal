import { z } from 'zod'
import { Fonte, GravidadeInteracao, NivelEvidencia } from './comum'

export const InteracaoMedicamentosa = z.object({
  id: z.string().min(1),
  farmacoAId: z.string().min(1),
  farmacoBId: z.string().min(1),
  gravidade: GravidadeInteracao,
  mecanismo: z.string().min(1),
  efeitoClinico: z.string().min(1),
  conduta: z.string().min(1),
  nivelEvidencia: NivelEvidencia,
  fontes: z.array(Fonte).min(1),
})
export type InteracaoMedicamentosa = z.infer<typeof InteracaoMedicamentosa>
