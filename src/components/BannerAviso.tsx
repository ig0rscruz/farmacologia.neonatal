import { useLocale } from '../i18n/LocaleContext'

export function BannerAviso() {
  const { t } = useLocale()
  return (
    <div className="bg-amber-50 border-b-2 border-amber-400 text-amber-900 px-4 py-3 text-sm">
      <p className="max-w-4xl mx-auto">
        <strong>{t.banner.titulo}</strong> {t.banner.texto}
      </p>
    </div>
  )
}
