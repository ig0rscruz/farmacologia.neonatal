export type Idioma = 'pt-BR' | 'en-US' | 'es'

export const IDIOMA_PADRAO: Idioma = 'pt-BR'

export const IDIOMAS_DISPONIVEIS: { codigo: Idioma; rotulo: string }[] = [
  { codigo: 'pt-BR', rotulo: 'Português (Brasil)' },
  { codigo: 'en-US', rotulo: 'English (US)' },
  { codigo: 'es', rotulo: 'Español' },
]

/**
 * Detecta o idioma inicial a partir das preferências do navegador
 * (`navigator.languages`/`navigator.language`). Optamos por preferência de
 * idioma do navegador em vez de geolocalização por IP: não depende de
 * serviço de terceiros (evita enviar o IP do profissional a uma API externa)
 * e funciona offline/sem requisição de rede adicional. O seletor de idioma na
 * interface permite corrigir manualmente quando a detecção não reflete o
 * idioma desejado.
 */
export function detectarIdiomaNavegador(): Idioma {
  if (typeof navigator === 'undefined') return IDIOMA_PADRAO
  const candidatos = navigator.languages && navigator.languages.length > 0 ? navigator.languages : [navigator.language]
  for (const candidato of candidatos) {
    const codigo = candidato.toLowerCase()
    if (codigo.startsWith('en')) return 'en-US'
    if (codigo.startsWith('es')) return 'es'
    if (codigo.startsWith('pt')) return 'pt-BR'
  }
  return IDIOMA_PADRAO
}
