import { useLocale } from '../i18n/LocaleContext'
import { IDIOMAS_DISPONIVEIS } from '../i18n/idiomas'

export function SeletorIdioma() {
  const { idioma, definirIdioma } = useLocale()
  return (
    <select
      className="input text-xs py-1"
      value={idioma}
      onChange={(e) => definirIdioma(e.target.value as typeof idioma)}
      aria-label="Idioma / Language / Idioma"
    >
      {IDIOMAS_DISPONIVEIS.map((op) => (
        <option key={op.codigo} value={op.codigo}>
          {op.rotulo}
        </option>
      ))}
    </select>
  )
}
