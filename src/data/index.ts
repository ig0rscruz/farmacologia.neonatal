import { Farmaco } from '../types/farmaco'
import { InteracaoMedicamentosa } from '../types/interacao'
import { PatologiaParental } from '../types/patologiaParental'

import interacoesRaw from './interacoes/interacoes.json'
import patologiasRaw from './patologias-parentais/patologias.json'

// Carrega automaticamente todo arquivo .json em data/farmacos — basta adicionar
// um novo arquivo nessa pasta seguindo o schema (ver Farmaco em src/types/farmaco.ts)
// para que ele apareça no app, sem precisar editar este arquivo.
const farmacosModules = import.meta.glob('./farmacos/*.json', { eager: true }) as Record<
  string,
  { default: unknown }
>
const farmacosRaw = Object.values(farmacosModules).map((m) => m.default)

function validarLista<T>(schema: { parse: (v: unknown) => T }, itens: unknown[], origem: string): T[] {
  return itens.map((item, i) => {
    try {
      return schema.parse(item)
    } catch (erro) {
      throw new Error(
        `Falha ao validar item #${i} em "${origem}": ${erro instanceof Error ? erro.message : String(erro)}`,
      )
    }
  })
}

export const FARMACOS: Farmaco[] = validarLista(Farmaco, farmacosRaw, 'data/farmacos')
export const INTERACOES: InteracaoMedicamentosa[] = validarLista(
  InteracaoMedicamentosa,
  interacoesRaw,
  'data/interacoes/interacoes.json',
)
export const PATOLOGIAS_PARENTAIS: PatologiaParental[] = validarLista(
  PatologiaParental,
  patologiasRaw,
  'data/patologias-parentais/patologias.json',
)

export function buscarFarmacoPorId(id: string): Farmaco | undefined {
  return FARMACOS.find((f) => f.id === id)
}
