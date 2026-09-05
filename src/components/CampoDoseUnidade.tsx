interface Props {
  doseValor: number | undefined
  doseUnidade: string | undefined
  onChangeDose: (v: number | undefined) => void
  onChangeUnidade: (v: string | undefined) => void
  placeholderDose: string
  placeholderUnidade: string
  className?: string
}

/** Campo único de dose + unidade, para que os dois fiquem visualmente conectados em vez de duas caixas soltas. */
export function CampoDoseUnidade({
  doseValor,
  doseUnidade,
  onChangeDose,
  onChangeUnidade,
  placeholderDose,
  placeholderUnidade,
  className,
}: Props) {
  return (
    <div
      className={`flex items-stretch rounded-lg border border-brand-teal-light bg-white dark:bg-slate-800 dark:border-slate-600
        focus-within:ring-2 focus-within:ring-brand-teal transition-shadow ${className ?? ''}`}
    >
      <input
        type="number"
        className="w-16 min-w-0 px-2 py-1.5 text-sm bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none"
        placeholder={placeholderDose}
        value={doseValor ?? ''}
        onChange={(e) => onChangeDose(e.target.value ? Number(e.target.value) : undefined)}
      />
      <span className="w-px my-1.5 bg-brand-teal-light dark:bg-slate-600" />
      <input
        type="text"
        className="flex-1 min-w-0 px-2 py-1.5 text-sm bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none"
        placeholder={placeholderUnidade}
        value={doseUnidade ?? ''}
        onChange={(e) => onChangeUnidade(e.target.value || undefined)}
      />
    </div>
  )
}
