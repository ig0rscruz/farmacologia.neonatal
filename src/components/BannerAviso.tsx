import { useLocale } from '../i18n/LocaleContext'

export function BannerAviso() {
  const { t } = useLocale()
  return (
    <div className="bg-brand-peach-light dark:bg-amber-950/40 border-b-2 border-brand-peach dark:border-amber-800 text-[#7a4a1e] dark:text-amber-200 px-4 py-3 text-sm">
      <p className="max-w-4xl mx-auto">
        <strong>{t.banner.titulo}</strong> {t.banner.texto}
      </p>
    </div>
  )
}
