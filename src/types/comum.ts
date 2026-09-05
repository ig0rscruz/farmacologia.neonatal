import { z } from 'zod'

/**
 * Vocabulário fechado de condições clínicas do neonato.
 * Mantido fechado (em vez de texto livre) para permitir cruzamento automático
 * entre paciente <-> contraindicações de fármaco <-> implicações de patologia parental.
 *
 * Condições hemodinâmicas/respiratórias (bradicardia, taquicardia, hipotensão,
 * hipertensão, hipoxemia, taquipneia, apneia) são ancoradas em critérios
 * numéricos explícitos — ver CONDICAO_CLINICA_CRITERIO — em vez de depender
 * apenas do nome do sintoma, para que o alerta mostrado ao profissional sempre
 * inclua o parâmetro vital de referência (FC, PA, SatO2 etc.).
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

export const CONDICAO_CLINICA_LABEL: Record<CondicaoClinica, string> = {
  prematuridade_extrema: 'Prematuridade extrema (IG < 28 semanas)',
  baixo_peso_extremo: 'Baixo peso extremo (< 1000 g)',
  insuficiencia_renal: 'Insuficiência renal',
  insuficiencia_hepatica: 'Insuficiência hepática',
  hiperbilirrubinemia: 'Hiperbilirrubinemia',
  sepse: 'Sepse',
  bradicardia: 'Bradicardia',
  taquicardia: 'Taquicardia',
  hipotensao: 'Hipotensão arterial',
  hipertensao: 'Hipertensão arterial',
  hipoxemia: 'Hipoxemia',
  taquipneia: 'Taquipneia',
  apneia: 'Apneia',
  risco_ototoxicidade: 'Risco de ototoxicidade',
  risco_neurotoxicidade: 'Risco de neurotoxicidade',
  distúrbio_coagulacao: 'Distúrbio de coagulação',
  outra: 'Outra condição',
}

/**
 * Critério numérico de referência para cada condição hemodinâmica/respiratória.
 * EXEMPLO — valores amplamente citados na literatura de neonatologia geral;
 * limiares reais variam com idade gestacional, pós-natal e contexto clínico
 * (ex.: prematuros extremos toleram frequências e pressões diferentes de RN a
 * termo). Devem ser revisados e ajustados por profissional responsável antes
 * de uso clínico, idealmente alinhados ao protocolo da unidade.
 */
export const CONDICAO_CLINICA_CRITERIO: Partial<Record<CondicaoClinica, string>> = {
  bradicardia: 'FC < 100 bpm (RN termo); em prematuros, considerar < 100-120 bpm conforme idade gestacional',
  taquicardia: 'FC > 180 bpm em repouso',
  hipotensao: 'PAM (mmHg) inferior à idade gestacional em semanas — regra prática usual em UTI neonatal',
  hipertensao: 'PA sistólica acima do percentil 95 para idade pós-natal e comprimento',
  hipoxemia: 'SatO2 < 90% (pré-termo: alvo usual de saturação 90-95%, individualizar)',
  taquipneia: 'FR > 60 incursões respiratórias por minuto',
  apneia: 'Pausa respiratória > 20 segundos, ou pausa mais curta acompanhada de bradicardia/dessaturação',
}

/** Escala de nível de evidência usada em todo o app. */
export const NivelEvidencia = z.enum(['A', 'B', 'C', 'D'])
export type NivelEvidencia = z.infer<typeof NivelEvidencia>

export const NIVEL_EVIDENCIA_LABEL: Record<NivelEvidencia, string> = {
  A: 'Ensaio clínico randomizado ou revisão sistemática em neonatos',
  B: 'Estudo observacional em neonatos ou consenso de especialistas em neonatologia',
  C: 'Extrapolado de estudos em crianças maiores ou adultos',
  D: 'Opinião de especialista / uso consagrado sem estudo formal (bula)',
}

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

export const GRAVIDADE_LABEL: Record<Gravidade, string> = {
  contraindicado: 'Contraindicado',
  usar_com_cautela: 'Usar com cautela',
  ajustar_dose: 'Necessita ajuste de dose',
  monitorar: 'Necessita monitorização adicional',
}

export const GravidadeInteracao = z.enum(['contraindicada', 'grave', 'moderada', 'leve'])
export type GravidadeInteracao = z.infer<typeof GravidadeInteracao>

export const GRAVIDADE_INTERACAO_LABEL: Record<GravidadeInteracao, string> = {
  contraindicada: 'Contraindicada',
  grave: 'Grave',
  moderada: 'Moderada',
  leve: 'Leve',
}
