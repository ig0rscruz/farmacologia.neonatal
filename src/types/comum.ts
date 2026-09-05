import { z } from 'zod'

/**
 * Vocabulário fechado de condições clínicas do neonato.
 * Mantido fechado (em vez de texto livre) para permitir cruzamento automático
 * entre paciente <-> contraindicações de fármaco <-> implicações de patologia parental.
 *
 * Condições hemodinâmicas/respiratórias (bradicardia, taquicardia, hipotensão,
 * hipertensão, hipoxemia, taquipneia, apneia) são ancoradas em critérios
 * numéricos explícitos — ver `criterios` em src/i18n/traducoes.ts — em vez de
 * depender apenas do nome do sintoma, para que o alerta mostrado ao
 * profissional sempre inclua o parâmetro vital de referência (FC, PA, SatO2 etc.).
 *
 * Os rótulos exibidos ao usuário (em pt-BR/en-US/es) ficam em
 * src/i18n/traducoes.ts, não aqui — os valores do enum são identificadores
 * internos usados para casar dados, não texto de exibição.
 */
export const CondicaoClinica = z.enum([
  'prematuridade_extrema',
  'baixo_peso_extremo',
  'insuficiencia_renal',
  'insuficiencia_hepatica',
  'hiperbilirrubinemia',
  'sepse',
  'bradicardia',
  'taquicardia',
  'hipotensao',
  'hipertensao',
  'hipoxemia',
  'taquipneia',
  'apneia',
  'risco_ototoxicidade',
  'risco_neurotoxicidade',
  'distúrbio_coagulacao',
  'outra',
])
export type CondicaoClinica = z.infer<typeof CondicaoClinica>

/** Escala de nível de evidência usada em todo o app (rótulos em src/i18n/traducoes.ts). */
export const NivelEvidencia = z.enum(['A', 'B', 'C', 'D'])
export type NivelEvidencia = z.infer<typeof NivelEvidencia>

export const Fonte = z.object({
  tipo: z.enum([
    'bula_anvisa',
    'artigo_cientifico',
    'protocolo_institucional',
    'diretriz_sociedade',
    'livro_texto',
    'outro',
  ]),
  descricao: z.string().min(1),
  url: z.string().url().optional(),
  dataAcesso: z.string().optional(),
})
export type Fonte = z.infer<typeof Fonte>

export const Gravidade = z.enum(['contraindicado', 'usar_com_cautela', 'ajustar_dose', 'monitorar'])
export type Gravidade = z.infer<typeof Gravidade>

export const GravidadeInteracao = z.enum(['contraindicada', 'grave', 'moderada', 'leve'])
export type GravidadeInteracao = z.infer<typeof GravidadeInteracao>

/**
 * Vocabulário fechado de vias de administração. Fechado (em vez de texto
 * livre) por dois motivos: permite comparação exata entre a via recomendada e
 * a via informada/prescrita (ver compararPosologia em
 * src/engine/verificarFarmaco.ts) independente do idioma da interface, e
 * dispensa tradução manual — os rótulos ficam em `vias` (src/i18n/traducoes.ts).
 */
export const ViaAdministracao = z.enum([
  'intravenosa',
  'oral',
  'intramuscular',
  'subcutanea',
  'retal',
  'intraossea',
  'endotraqueal',
  'inalatoria',
  'topica',
  'outra',
])
export type ViaAdministracao = z.infer<typeof ViaAdministracao>

/**
 * Campo de texto livre traduzido nos 3 idiomas suportados. Usado em todo o
 * conteúdo clínico (indicações, contraindicações, condutas, etc.) — ao
 * contrário dos vocabulários fechados acima (CondicaoClinica, Gravidade,
 * ViaAdministracao), aqui não há como evitar tradução manual do texto.
 * pt-BR é a fonte primária; en-US/es devem sempre ser preenchidos também
 * (sem fallback automático) para que o conteúdo clínico acompanhe o idioma
 * da interface.
 */
export const TextoMultilingue = z.object({
  'pt-BR': z.string().min(1),
  'en-US': z.string().min(1),
  es: z.string().min(1),
})
export type TextoMultilingue = z.infer<typeof TextoMultilingue>

export const TextoMultilinguaArray = z.object({
  'pt-BR': z.array(z.string().min(1)).min(1),
  'en-US': z.array(z.string().min(1)).min(1),
  es: z.array(z.string().min(1)).min(1),
})
export type TextoMultilinguaArray = z.infer<typeof TextoMultilinguaArray>
