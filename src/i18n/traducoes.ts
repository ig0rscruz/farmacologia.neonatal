import type { Idioma } from './idiomas'

/** Deve refletir TOLERANCIA_DOSE de src/engine/verificarFarmaco.ts (0.2 = 20%). */
const TOLERANCIA_DOSE_PERCENT = 20

export interface Traducao {
  app: {
    subtitulo: string
  }
  rodape: {
    construidoPor: string
    telefone: string
    email: string
  }
  nav: {
    calculadora: string
    resumos: string
  }
  resumos: {
    titulo: string
    subtitulo: string
    buscarPlaceholder: string
    nenhumFarmaco: string
    selecioneFarmaco: string
    nomeGenerico: string
    classeFarmacologica: string
    indicacoesNeonatais: string
    viasAdministracao: string
    faixasDose: string
    intervalo: string
    contraindicacoes: string
    alertasGerais: string
  }
  banner: {
    titulo: string
    texto: string
  }
  form: {
    dadosNeonato: string
    identificador: string
    identificadorPlaceholder: string
    idadeGestacional: string
    idadePosNatal: string
    pesoAtual: string
    pesoNascimento: string
    comprimento: string
    sinaisVitais: string
    fc: string
    fr: string
    paSistolica: string
    paDiastolica: string
    paMedia: string
    satO2: string
    temperatura: string
    sugestoesTitulo: string
    sugestaoJaMarcada: string
    sugestaoConfirmar: string
    examesOrgao: string
    examesOrgaoAviso: string
    creatinina: string
    clearance: string
    diurese: string
    bilirrubina: string
    tgo: string
    tgp: string
    condicoesClinicas: string
    medicamentosEmUso: string
    medicamentosEmUsoAviso: string
    selecionarFarmaco: string
    dose: string
    unidade: string
    aCada: string
    via: string
    adicionar: string
    remover: string
    nenhumMedicamento: string
    patologiasParentais: string
    selecionarPatologia: string
    mae: string
    pai: string
    nenhumaPatologia: string
  }
  candidato: {
    titulo: string
    posologiaAviso: string
    verificar: string
    dadosDesatualizados: string
  }
  abas: {
    interacoes: string
    posologia: string
  }
  resultado: {
    nivelAdequado: string
    nivelCautela: string
    nivelContraindicado: string
    nivelSemDados: string
    alertasCondicoes: string
    conduta: string
    interacoesComEmUso: string
    alertasPatologiasParentais: string
    semAlertas: string
    doseRecomendada: string
    semFaixaDose: string
    divergenciasPosologia: string
    divergenciaSemFaixa: string
    direcaoAcima: string
    direcaoAbaixo: string
    divergenciaDose: (informado: string, recomendado: string, direcao: string) => string
    divergenciaIntervalo: (informado: number, recomendado: number) => string
    divergenciaVia: (informado: string, recomendado: string) => string
    ajustesFuncaoOrgao: string
    nivelEvidenciaGeral: string
    ultimaRevisao: string
    fontes: string
    verFonte: string
  }
  condicoes: Record<string, string>
  criterios: Partial<Record<string, string>>
  gravidade: Record<string, string>
  gravidadeInteracao: Record<string, string>
  nivelEvidencia: Record<string, string>
  vias: Record<string, string>
  fonteTipo: Record<string, string>
}

const pt: Traducao = {
  app: {
    subtitulo:
      'Verificação de adequação de fármacos, interações medicamentosas e implicações de patologias parentais para o paciente neonatal.',
  },
  rodape: {
    construidoPor: 'Construído por: Igor Santana Cruz',
    telefone: 'Telefone para contato: +55 92 98170-3592',
    email: 'E-mail: igorscruz.am@gmail.com',
  },
  nav: {
    calculadora: 'Calculadora',
    resumos: 'Resumos',
  },
  resumos: {
    titulo: 'Resumos de fármacos',
    subtitulo: 'Consulte a ficha completa de cada fármaco da base — indicações, vias, faixas de dose, contraindicações, alertas e fontes.',
    buscarPlaceholder: 'Buscar fármaco…',
    nenhumFarmaco: 'Nenhum fármaco encontrado.',
    selecioneFarmaco: 'Selecione um fármaco na lista para ver o resumo completo.',
    nomeGenerico: 'Nome genérico',
    classeFarmacologica: 'Classe farmacológica',
    indicacoesNeonatais: 'Indicações neonatais',
    viasAdministracao: 'Vias de administração',
    faixasDose: 'Faixas de dose',
    intervalo: 'Intervalo',
    contraindicacoes: 'Contraindicações',
    alertasGerais: 'Alertas gerais',
  },
  banner: {
    titulo: 'Ferramenta de apoio à decisão clínica.',
    texto:
      'As informações exibidas são baseadas em uma base de dados estruturada que precisa ser revisada e mantida por profissionais responsáveis. Este aplicativo não substitui o julgamento clínico, a avaliação individualizada do paciente nem as diretrizes institucionais vigentes. Em caso de dúvida, consulte fontes primárias atualizadas (bula vigente, farmacêutico clínico, protocolo institucional).',
  },
  form: {
    dadosNeonato: 'Dados do neonato',
    identificador: 'Identificador (opcional)',
    identificadorPlaceholder: 'Iniciais / nº prontuário',
    idadeGestacional: 'Idade gestacional ao nascer (semanas)',
    idadePosNatal: 'Idade pós-natal (dias de vida)',
    pesoAtual: 'Peso atual (g)',
    pesoNascimento: 'Peso ao nascer (g, opcional)',
    comprimento: 'Comprimento (cm, opcional)',
    sinaisVitais: 'Sinais vitais atuais (opcional)',
    fc: 'FC (bpm)',
    fr: 'FR (irpm)',
    paSistolica: 'PA sistólica (mmHg)',
    paDiastolica: 'PA diastólica (mmHg)',
    paMedia: 'PA média (mmHg)',
    satO2: 'SatO2 (%)',
    temperatura: 'Temperatura axilar (°C)',
    sugestoesTitulo: 'Sugestões automáticas com base nos sinais vitais informados (confirme antes de aplicar):',
    sugestaoJaMarcada: 'já marcada',
    sugestaoConfirmar: 'Confirmar',
    examesOrgao: 'Exames de função renal/hepática (opcional)',
    examesOrgaoAviso:
      'Os valores de referência normais variam com idade gestacional e pós-natal — o app não classifica automaticamente "insuficiência renal/hepática" a partir deles; use os valores para embasar sua confirmação manual na lista de condições clínicas abaixo.',
    creatinina: 'Creatinina sérica (mg/dL)',
    clearance: 'Clearance de creatinina estimado (mL/min/1.73m²)',
    diurese: 'Diurese (mL/kg/hora)',
    bilirrubina: 'Bilirrubina total (mg/dL)',
    tgo: 'TGO/AST (U/L)',
    tgp: 'TGP/ALT (U/L)',
    condicoesClinicas: 'Condições clínicas identificadas (anamnese / exames)',
    medicamentosEmUso: 'Medicamentos já em uso pelo neonato',
    medicamentosEmUsoAviso:
      'Informar a posologia real (dose, intervalo, via) permite comparar com a faixa recomendada na aba "Posologia".',
    selecionarFarmaco: 'Selecionar fármaco…',
    dose: 'Dose',
    unidade: 'Unidade (mg/kg/dose)',
    aCada: 'A cada (h)',
    via: 'Via',
    adicionar: 'Adicionar',
    remover: 'remover',
    nenhumMedicamento: 'Nenhum medicamento em uso adicionado.',
    patologiasParentais: 'Patologias parentais (pai/mãe)',
    selecionarPatologia: 'Selecionar patologia…',
    mae: 'Mãe',
    pai: 'Pai',
    nenhumaPatologia: 'Nenhuma patologia parental adicionada.',
  },
  candidato: {
    titulo: 'Fármaco a ser administrado',
    posologiaAviso:
      'Posologia planejada/prescrita para este fármaco (opcional) — será comparada com a faixa recomendada na aba "Posologia".',
    verificar: 'Verificar',
    dadosDesatualizados: 'Os dados foram alterados desde a última verificação. Clique em "Verificar" novamente para atualizar o resultado.',
  },
  abas: {
    interacoes: 'Interações',
    posologia: 'Posologia',
  },
  resultado: {
    nivelAdequado: 'Adequado conforme critérios cadastrados',
    nivelCautela: 'Usar com cautela — há ressalvas a considerar',
    nivelContraindicado: 'Contraindicado para este paciente',
    nivelSemDados: 'Dados insuficientes — nenhuma faixa de dose cadastrada para este perfil',
    alertasCondicoes: 'Alertas relacionados às condições clínicas do paciente',
    conduta: 'Conduta',
    interacoesComEmUso: 'Interações com medicamentos em uso',
    alertasPatologiasParentais: 'Alertas relacionados a patologias parentais',
    semAlertas:
      'Nenhuma contraindicação, interação ou alerta parental foi encontrado na base de dados cadastrada para este perfil de paciente. Isso reflete o conteúdo cadastrado, não uma garantia absoluta de segurança — mantenha o julgamento clínico.',
    doseRecomendada: 'Dose recomendada para este perfil',
    semFaixaDose: 'Nenhuma faixa de dose cadastrada cobre a idade pós-menstrual/peso deste paciente para este fármaco.',
    divergenciasPosologia: 'Divergências entre a posologia informada e a recomendada',
    divergenciaSemFaixa:
      'Não há faixa de dose cadastrada para o perfil deste paciente — não é possível comparar a posologia informada com uma recomendação.',
    direcaoAcima: 'acima',
    direcaoAbaixo: 'abaixo',
    divergenciaDose: (informado, recomendado, direcao) =>
      `Dose informada (${informado}) está ${direcao} da faixa recomendada (${recomendado}) em mais de ${TOLERANCIA_DOSE_PERCENT}%.`,
    divergenciaIntervalo: (informado, recomendado) =>
      `Intervalo informado (a cada ${informado}h) difere do recomendado (a cada ${recomendado}h).`,
    divergenciaVia: (informado, recomendado) => `Via informada ("${informado}") difere da recomendada ("${recomendado}").`,
    ajustesFuncaoOrgao: 'Ajustes recomendados por condição clínica do paciente',
    nivelEvidenciaGeral: 'Nível de evidência geral do fármaco',
    ultimaRevisao: 'Última revisão',
    fontes: 'Fontes',
    verFonte: 'Ver fonte',
  },
  condicoes: {
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
    'distúrbio_coagulacao': 'Distúrbio de coagulação',
    outra: 'Outra condição',
  },
  criterios: {
    bradicardia: 'FC < 100 bpm (RN termo); em prematuros, considerar < 100-120 bpm conforme idade gestacional',
    taquicardia: 'FC > 180 bpm em repouso',
    hipotensao: 'PAM (mmHg) inferior à idade gestacional em semanas — regra prática usual em UTI neonatal',
    hipertensao: 'PA sistólica acima do percentil 95 para idade pós-natal e comprimento',
    hipoxemia: 'SatO2 < 90% (pré-termo: alvo usual de saturação 90-95%, individualizar)',
    taquipneia: 'FR > 60 incursões respiratórias por minuto',
    apneia: 'Pausa respiratória > 20 segundos, ou pausa mais curta acompanhada de bradicardia/dessaturação',
  },
  gravidade: {
    contraindicado: 'Contraindicado',
    usar_com_cautela: 'Usar com cautela',
    ajustar_dose: 'Necessita ajuste de dose',
    monitorar: 'Necessita monitorização adicional',
  },
  gravidadeInteracao: {
    contraindicada: 'Contraindicada',
    grave: 'Grave',
    moderada: 'Moderada',
    leve: 'Leve',
  },
  nivelEvidencia: {
    A: 'Ensaio clínico randomizado ou revisão sistemática em neonatos',
    B: 'Estudo observacional em neonatos ou consenso de especialistas em neonatologia',
    C: 'Extrapolado de estudos em crianças maiores ou adultos',
    D: 'Opinião de especialista / uso consagrado sem estudo formal (bula)',
  },
  vias: {
    intravenosa: 'Intravenosa',
    oral: 'Oral',
    intramuscular: 'Intramuscular',
    subcutanea: 'Subcutânea',
    intradermica: 'Intradérmica',
    retal: 'Retal',
    intraossea: 'Intraóssea',
    endotraqueal: 'Endotraqueal',
    inalatoria: 'Inalatória',
    topica: 'Tópica',
    outra: 'Outra',
  },
  fonteTipo: {
    bula_anvisa: 'Bula (ANVISA)',
    artigo_cientifico: 'Artigo científico',
    protocolo_institucional: 'Protocolo institucional',
    diretriz_sociedade: 'Diretriz de sociedade',
    livro_texto: 'Livro-texto',
    outro: 'Outra fonte',
  },
}

const en: Traducao = {
  app: {
    subtitulo:
      'Checks drug appropriateness, drug-drug interactions, and parental pathology implications for the neonatal patient.',
  },
  rodape: {
    construidoPor: 'Built by: Igor Santana Cruz',
    telefone: 'Contact phone: +55 92 98170-3592',
    email: 'Email: igorscruz.am@gmail.com',
  },
  nav: {
    calculadora: 'Calculator',
    resumos: 'Summaries',
  },
  resumos: {
    titulo: 'Drug summaries',
    subtitulo: 'Browse the full record for each drug in the database — indications, routes, dose ranges, contraindications, alerts, and sources.',
    buscarPlaceholder: 'Search drug…',
    nenhumFarmaco: 'No drug found.',
    selecioneFarmaco: 'Select a drug from the list to see the full summary.',
    nomeGenerico: 'Generic name',
    classeFarmacologica: 'Pharmacologic class',
    indicacoesNeonatais: 'Neonatal indications',
    viasAdministracao: 'Routes of administration',
    faixasDose: 'Dose ranges',
    intervalo: 'Interval',
    contraindicacoes: 'Contraindications',
    alertasGerais: 'General alerts',
  },
  banner: {
    titulo: 'Clinical decision support tool.',
    texto:
      'The information shown is based on a structured database that must be reviewed and maintained by responsible clinicians. This application does not replace clinical judgment, individualized patient assessment, or applicable institutional guidelines. When in doubt, consult up-to-date primary sources (current package insert, clinical pharmacist, institutional protocol).',
  },
  form: {
    dadosNeonato: 'Newborn data',
    identificador: 'Identifier (optional)',
    identificadorPlaceholder: 'Initials / chart number',
    idadeGestacional: 'Gestational age at birth (weeks)',
    idadePosNatal: 'Postnatal age (days of life)',
    pesoAtual: 'Current weight (g)',
    pesoNascimento: 'Birth weight (g, optional)',
    comprimento: 'Length (cm, optional)',
    sinaisVitais: 'Current vital signs (optional)',
    fc: 'HR (bpm)',
    fr: 'RR (breaths/min)',
    paSistolica: 'Systolic BP (mmHg)',
    paDiastolica: 'Diastolic BP (mmHg)',
    paMedia: 'Mean BP (mmHg)',
    satO2: 'SpO2 (%)',
    temperatura: 'Axillary temperature (°C)',
    sugestoesTitulo: 'Automatic suggestions based on the vital signs entered (confirm before applying):',
    sugestaoJaMarcada: 'already marked',
    sugestaoConfirmar: 'Confirm',
    examesOrgao: 'Renal/hepatic function tests (optional)',
    examesOrgaoAviso:
      'Normal reference ranges vary with gestational and postnatal age — the app does not automatically classify "renal/hepatic impairment" from these values; use them to inform your manual confirmation in the clinical conditions list below.',
    creatinina: 'Serum creatinine (mg/dL)',
    clearance: 'Estimated creatinine clearance (mL/min/1.73m²)',
    diurese: 'Urine output (mL/kg/hour)',
    bilirrubina: 'Total bilirubin (mg/dL)',
    tgo: 'AST (U/L)',
    tgp: 'ALT (U/L)',
    condicoesClinicas: 'Clinical conditions identified (history / tests)',
    medicamentosEmUso: 'Medications already in use by the newborn',
    medicamentosEmUsoAviso:
      'Entering the actual dosing regimen (dose, interval, route) allows comparison with the recommended range in the "Dosing" tab.',
    selecionarFarmaco: 'Select drug…',
    dose: 'Dose',
    unidade: 'Unit (mg/kg/dose)',
    aCada: 'Every (h)',
    via: 'Route',
    adicionar: 'Add',
    remover: 'remove',
    nenhumMedicamento: 'No medication in use added yet.',
    patologiasParentais: 'Parental pathologies (mother/father)',
    selecionarPatologia: 'Select pathology…',
    mae: 'Mother',
    pai: 'Father',
    nenhumaPatologia: 'No parental pathology added yet.',
  },
  candidato: {
    titulo: 'Drug to be administered',
    posologiaAviso:
      'Planned/prescribed dosing regimen for this drug (optional) — will be compared with the recommended range in the "Dosing" tab.',
    verificar: 'Check',
    dadosDesatualizados: 'Data has changed since the last check. Click "Check" again to update the result.',
  },
  abas: {
    interacoes: 'Interactions',
    posologia: 'Dosing',
  },
  resultado: {
    nivelAdequado: 'Appropriate per registered criteria',
    nivelCautela: 'Use with caution — some concerns to consider',
    nivelContraindicado: 'Contraindicated for this patient',
    nivelSemDados: 'Insufficient data — no dosing range registered for this profile',
    alertasCondicoes: 'Alerts related to the patient’s clinical conditions',
    conduta: 'Management',
    interacoesComEmUso: 'Interactions with medications in use',
    alertasPatologiasParentais: 'Alerts related to parental pathologies',
    semAlertas:
      'No contraindication, interaction, or parental alert was found in the registered database for this patient profile. This reflects the registered content, not an absolute safety guarantee — keep exercising clinical judgment.',
    doseRecomendada: 'Recommended dose for this profile',
    semFaixaDose: 'No dosing range registered covers this patient’s postmenstrual age/weight for this drug.',
    divergenciasPosologia: 'Differences between the entered and recommended dosing regimen',
    divergenciaSemFaixa:
      'No dosing range is registered for this patient’s profile — cannot compare the entered dosing regimen with a recommendation.',
    direcaoAcima: 'above',
    direcaoAbaixo: 'below',
    divergenciaDose: (informado, recomendado, direcao) =>
      `Entered dose (${informado}) is ${direcao} the recommended range (${recomendado}) by more than ${TOLERANCIA_DOSE_PERCENT}%.`,
    divergenciaIntervalo: (informado, recomendado) =>
      `Entered interval (every ${informado}h) differs from the recommended one (every ${recomendado}h).`,
    divergenciaVia: (informado, recomendado) => `Entered route ("${informado}") differs from the recommended one ("${recomendado}").`,
    ajustesFuncaoOrgao: 'Adjustments recommended for the patient’s clinical condition',
    nivelEvidenciaGeral: 'Overall evidence level for this drug',
    ultimaRevisao: 'Last reviewed',
    fontes: 'Sources',
    verFonte: 'View source',
  },
  condicoes: {
    prematuridade_extrema: 'Extreme prematurity (GA < 28 weeks)',
    baixo_peso_extremo: 'Extremely low birth weight (< 1000 g)',
    insuficiencia_renal: 'Renal impairment',
    insuficiencia_hepatica: 'Hepatic impairment',
    hiperbilirrubinemia: 'Hyperbilirubinemia',
    sepse: 'Sepsis',
    bradicardia: 'Bradycardia',
    taquicardia: 'Tachycardia',
    hipotensao: 'Hypotension',
    hipertensao: 'Hypertension',
    hipoxemia: 'Hypoxemia',
    taquipneia: 'Tachypnea',
    apneia: 'Apnea',
    risco_ototoxicidade: 'Ototoxicity risk',
    risco_neurotoxicidade: 'Neurotoxicity risk',
    'distúrbio_coagulacao': 'Coagulation disorder',
    outra: 'Other condition',
  },
  criterios: {
    bradicardia: 'HR < 100 bpm (term newborn); in preterm infants, consider < 100-120 bpm depending on gestational age',
    taquicardia: 'HR > 180 bpm at rest',
    hipotensao: 'MAP (mmHg) below gestational age in weeks — common rule of thumb used in the NICU',
    hipertensao: 'Systolic BP above the 95th percentile for postnatal age and length',
    hipoxemia: 'SpO2 < 90% (preterm: usual saturation target 90-95%, individualize)',
    taquipneia: 'RR > 60 breaths per minute',
    apneia: 'Respiratory pause > 20 seconds, or a shorter pause accompanied by bradycardia/desaturation',
  },
  gravidade: {
    contraindicado: 'Contraindicated',
    usar_com_cautela: 'Use with caution',
    ajustar_dose: 'Dose adjustment needed',
    monitorar: 'Additional monitoring needed',
  },
  gravidadeInteracao: {
    contraindicada: 'Contraindicated',
    grave: 'Severe',
    moderada: 'Moderate',
    leve: 'Mild',
  },
  nivelEvidencia: {
    A: 'Randomized controlled trial or systematic review in neonates',
    B: 'Observational study in neonates or neonatology expert consensus',
    C: 'Extrapolated from studies in older children or adults',
    D: 'Expert opinion / established use without formal study (package insert)',
  },
  vias: {
    intravenosa: 'Intravenous',
    oral: 'Oral',
    intramuscular: 'Intramuscular',
    subcutanea: 'Subcutaneous',
    intradermica: 'Intradermal',
    retal: 'Rectal',
    intraossea: 'Intraosseous',
    endotraqueal: 'Endotracheal',
    inalatoria: 'Inhaled',
    topica: 'Topical',
    outra: 'Other',
  },
  fonteTipo: {
    bula_anvisa: 'Package insert (ANVISA)',
    artigo_cientifico: 'Scientific article',
    protocolo_institucional: 'Institutional protocol',
    diretriz_sociedade: 'Society guideline',
    livro_texto: 'Textbook',
    outro: 'Other source',
  },
}

const es: Traducao = {
  app: {
    subtitulo:
      'Verificación de la idoneidad de fármacos, interacciones medicamentosas e implicaciones de patologías parentales para el paciente neonatal.',
  },
  rodape: {
    construidoPor: 'Construido por: Igor Santana Cruz',
    telefone: 'Teléfono de contacto: +55 92 98170-3592',
    email: 'Correo electrónico: igorscruz.am@gmail.com',
  },
  nav: {
    calculadora: 'Calculadora',
    resumos: 'Resúmenes',
  },
  resumos: {
    titulo: 'Resúmenes de fármacos',
    subtitulo: 'Consulte la ficha completa de cada fármaco de la base — indicaciones, vías, rangos de dosis, contraindicaciones, alertas y fuentes.',
    buscarPlaceholder: 'Buscar fármaco…',
    nenhumFarmaco: 'Ningún fármaco encontrado.',
    selecioneFarmaco: 'Seleccione un fármaco de la lista para ver el resumen completo.',
    nomeGenerico: 'Nombre genérico',
    classeFarmacologica: 'Clase farmacológica',
    indicacoesNeonatais: 'Indicaciones neonatales',
    viasAdministracao: 'Vías de administración',
    faixasDose: 'Rangos de dosis',
    intervalo: 'Intervalo',
    contraindicacoes: 'Contraindicaciones',
    alertasGerais: 'Alertas generales',
  },
  banner: {
    titulo: 'Herramienta de apoyo a la decisión clínica.',
    texto:
      'La información mostrada se basa en una base de datos estructurada que debe ser revisada y mantenida por profesionales responsables. Esta aplicación no sustituye el juicio clínico, la evaluación individualizada del paciente ni las directrices institucionales vigentes. En caso de duda, consulte fuentes primarias actualizadas (prospecto vigente, farmacéutico clínico, protocolo institucional).',
  },
  form: {
    dadosNeonato: 'Datos del neonato',
    identificador: 'Identificador (opcional)',
    identificadorPlaceholder: 'Iniciales / nº de historia',
    idadeGestacional: 'Edad gestacional al nacer (semanas)',
    idadePosNatal: 'Edad posnatal (días de vida)',
    pesoAtual: 'Peso actual (g)',
    pesoNascimento: 'Peso al nacer (g, opcional)',
    comprimento: 'Longitud (cm, opcional)',
    sinaisVitais: 'Signos vitales actuales (opcional)',
    fc: 'FC (lpm)',
    fr: 'FR (rpm)',
    paSistolica: 'PA sistólica (mmHg)',
    paDiastolica: 'PA diastólica (mmHg)',
    paMedia: 'PA media (mmHg)',
    satO2: 'SatO2 (%)',
    temperatura: 'Temperatura axilar (°C)',
    sugestoesTitulo: 'Sugerencias automáticas basadas en los signos vitales indicados (confirme antes de aplicar):',
    sugestaoJaMarcada: 'ya marcada',
    sugestaoConfirmar: 'Confirmar',
    examesOrgao: 'Exámenes de función renal/hepática (opcional)',
    examesOrgaoAviso:
      'Los valores de referencia normales varían según la edad gestacional y posnatal — la aplicación no clasifica automáticamente "insuficiencia renal/hepática" a partir de ellos; use los valores para respaldar su confirmación manual en la lista de condiciones clínicas de abajo.',
    creatinina: 'Creatinina sérica (mg/dL)',
    clearance: 'Aclaramiento de creatinina estimado (mL/min/1.73m²)',
    diurese: 'Diuresis (mL/kg/hora)',
    bilirrubina: 'Bilirrubina total (mg/dL)',
    tgo: 'TGO/AST (U/L)',
    tgp: 'TGP/ALT (U/L)',
    condicoesClinicas: 'Condiciones clínicas identificadas (anamnesis / exámenes)',
    medicamentosEmUso: 'Medicamentos ya en uso por el neonato',
    medicamentosEmUsoAviso:
      'Indicar la posología real (dosis, intervalo, vía) permite compararla con el rango recomendado en la pestaña "Posología".',
    selecionarFarmaco: 'Seleccionar fármaco…',
    dose: 'Dosis',
    unidade: 'Unidad (mg/kg/dosis)',
    aCada: 'Cada (h)',
    via: 'Vía',
    adicionar: 'Agregar',
    remover: 'quitar',
    nenhumMedicamento: 'Ningún medicamento en uso agregado.',
    patologiasParentais: 'Patologías parentales (madre/padre)',
    selecionarPatologia: 'Seleccionar patología…',
    mae: 'Madre',
    pai: 'Padre',
    nenhumaPatologia: 'Ninguna patología parental agregada.',
  },
  candidato: {
    titulo: 'Fármaco a administrar',
    posologiaAviso:
      'Posología planificada/prescrita para este fármaco (opcional) — se comparará con el rango recomendado en la pestaña "Posología".',
    verificar: 'Verificar',
    dadosDesatualizados: 'Los datos cambiaron desde la última verificación. Haga clic en "Verificar" de nuevo para actualizar el resultado.',
  },
  abas: {
    interacoes: 'Interacciones',
    posologia: 'Posología',
  },
  resultado: {
    nivelAdequado: 'Adecuado según los criterios registrados',
    nivelCautela: 'Usar con precaución — hay consideraciones a tener en cuenta',
    nivelContraindicado: 'Contraindicado para este paciente',
    nivelSemDados: 'Datos insuficientes — no hay rango de dosis registrado para este perfil',
    alertasCondicoes: 'Alertas relacionadas con las condiciones clínicas del paciente',
    conduta: 'Conducta',
    interacoesComEmUso: 'Interacciones con medicamentos en uso',
    alertasPatologiasParentais: 'Alertas relacionadas con patologías parentales',
    semAlertas:
      'No se encontró ninguna contraindicación, interacción o alerta parental en la base de datos registrada para este perfil de paciente. Esto refleja el contenido registrado, no una garantía absoluta de seguridad — mantenga el juicio clínico.',
    doseRecomendada: 'Dosis recomendada para este perfil',
    semFaixaDose: 'Ningún rango de dosis registrado cubre la edad posmenstrual/peso de este paciente para este fármaco.',
    divergenciasPosologia: 'Diferencias entre la posología indicada y la recomendada',
    divergenciaSemFaixa:
      'No hay rango de dosis registrado para el perfil de este paciente — no es posible comparar la posología indicada con una recomendación.',
    direcaoAcima: 'por encima',
    direcaoAbaixo: 'por debajo',
    divergenciaDose: (informado, recomendado, direcao) =>
      `La dosis indicada (${informado}) está ${direcao} del rango recomendado (${recomendado}) en más de ${TOLERANCIA_DOSE_PERCENT}%.`,
    divergenciaIntervalo: (informado, recomendado) =>
      `El intervalo indicado (cada ${informado}h) difiere del recomendado (cada ${recomendado}h).`,
    divergenciaVia: (informado, recomendado) => `La vía indicada ("${informado}") difiere de la recomendada ("${recomendado}").`,
    ajustesFuncaoOrgao: 'Ajustes recomendados según la condición clínica del paciente',
    nivelEvidenciaGeral: 'Nivel de evidencia general del fármaco',
    ultimaRevisao: 'Última revisión',
    fontes: 'Fuentes',
    verFonte: 'Ver fuente',
  },
  condicoes: {
    prematuridade_extrema: 'Prematuridad extrema (EG < 28 semanas)',
    baixo_peso_extremo: 'Bajo peso extremo (< 1000 g)',
    insuficiencia_renal: 'Insuficiencia renal',
    insuficiencia_hepatica: 'Insuficiencia hepática',
    hiperbilirrubinemia: 'Hiperbilirrubinemia',
    sepse: 'Sepsis',
    bradicardia: 'Bradicardia',
    taquicardia: 'Taquicardia',
    hipotensao: 'Hipotensión arterial',
    hipertensao: 'Hipertensión arterial',
    hipoxemia: 'Hipoxemia',
    taquipneia: 'Taquipnea',
    apneia: 'Apnea',
    risco_ototoxicidade: 'Riesgo de ototoxicidad',
    risco_neurotoxicidade: 'Riesgo de neurotoxicidad',
    'distúrbio_coagulacao': 'Trastorno de la coagulación',
    outra: 'Otra condición',
  },
  criterios: {
    bradicardia: 'FC < 100 lpm (RN a término); en prematuros, considerar < 100-120 lpm según edad gestacional',
    taquicardia: 'FC > 180 lpm en reposo',
    hipotensao: 'PAM (mmHg) inferior a la edad gestacional en semanas — regla práctica habitual en UCIN',
    hipertensao: 'PA sistólica por encima del percentil 95 para la edad posnatal y longitud',
    hipoxemia: 'SatO2 < 90% (pretérmino: objetivo habitual de saturación 90-95%, individualizar)',
    taquipneia: 'FR > 60 respiraciones por minuto',
    apneia: 'Pausa respiratoria > 20 segundos, o pausa más corta acompañada de bradicardia/desaturación',
  },
  gravidade: {
    contraindicado: 'Contraindicado',
    usar_com_cautela: 'Usar con precaución',
    ajustar_dose: 'Requiere ajuste de dosis',
    monitorar: 'Requiere monitorización adicional',
  },
  gravidadeInteracao: {
    contraindicada: 'Contraindicada',
    grave: 'Grave',
    moderada: 'Moderada',
    leve: 'Leve',
  },
  nivelEvidencia: {
    A: 'Ensayo clínico aleatorizado o revisión sistemática en neonatos',
    B: 'Estudio observacional en neonatos o consenso de expertos en neonatología',
    C: 'Extrapolado de estudios en niños mayores o adultos',
    D: 'Opinión de experto / uso consagrado sin estudio formal (prospecto)',
  },
  vias: {
    intravenosa: 'Intravenosa',
    oral: 'Oral',
    intramuscular: 'Intramuscular',
    subcutanea: 'Subcutánea',
    intradermica: 'Intradérmica',
    retal: 'Rectal',
    intraossea: 'Intraósea',
    endotraqueal: 'Endotraqueal',
    inalatoria: 'Inhalatoria',
    topica: 'Tópica',
    outra: 'Otra',
  },
  fonteTipo: {
    bula_anvisa: 'Prospecto (ANVISA)',
    artigo_cientifico: 'Artículo científico',
    protocolo_institucional: 'Protocolo institucional',
    diretriz_sociedade: 'Directriz de sociedad',
    livro_texto: 'Libro de texto',
    outro: 'Otra fuente',
  },
}

export const TRADUCOES: Record<Idioma, Traducao> = { 'pt-BR': pt, 'en-US': en, es }
