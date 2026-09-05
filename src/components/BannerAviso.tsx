import { useLocale } from '../i18n/LocaleContext'

export function BannerAviso() {
  const { t } = useLocale()
  return (
    <div className="bg-white border-b-2 border-brand-peach text-[#7a4a1e] px-4 py-3 text-sm">
      <p className="max-w-4xl mx-auto">
        <strong>{t.banner.titulo}</strong> {t.banner.texto}
      </p>
    </div>
  )
}
