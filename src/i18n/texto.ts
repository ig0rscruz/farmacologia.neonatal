import type { TextoMultilingue, TextoMultilinguaArray } from '../types/comum'
import type { Idioma } from './idiomas'

/** Resolve um campo de texto multilíngue para o idioma atual (fallback pt-BR). */
export function texto(campo: TextoMultilingue, idioma: Idioma): string {
  return campo[idioma] ?? campo['pt-BR']
}

/** Resolve um campo de lista de texto multilíngue para o idioma atual (fallback pt-BR). */
export function textoLista(campo: TextoMultilinguaArray, idioma: Idioma): string[] {
  return campo[idioma] ?? campo['pt-BR']
}
