# Farmacologia Neonatal

Ferramenta de apoio à decisão clínica para verificação de adequação de fármacos em
pacientes neonatais: idade gestacional/pós-natal, peso, sinais vitais e condições
clínicas do paciente, cruzados com uma base de dados de fármacos, interações
medicamentosas e implicações de patologias parentais.

> **Este aplicativo não substitui o julgamento clínico.** Ele organiza e cruza
> informações previamente cadastradas; a responsabilidade pela decisão terapêutica é
> sempre do profissional assistente. Todo o conteúdo cadastrado em `src/data/` deve
> ser revisado por um profissional responsável antes de qualquer uso clínico real —
> os dados incluídos inicialmente estão marcados como `EXEMPLO` e servem apenas para
> validar o formato.

## Privacidade

Os dados do paciente preenchidos na tela existem **apenas em memória** durante o uso
(estado React) — não são salvos em localStorage, em nenhum backend, nem no
repositório Git. Recarregar a página apaga os dados. Isso é intencional: são dados
sensíveis de paciente e não devem ser persistidos sem uma solução de prontuário
eletrônico adequada (LGPD, controle de acesso, auditoria, etc.). **Nunca** adicione
dados reais de pacientes aos arquivos versionados em `src/data/`.

## Rodando localmente

Requer [Node.js](https://nodejs.org/) (LTS).

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173/farmacologia.neonatal/`.

```bash
npm run build   # build de produção em dist/
npm run preview # serve o build de produção localmente
```

## Estrutura do banco de dados

Todo o conteúdo clínico fica em `src/data/`, como arquivos JSON validados por
[Zod](https://zod.dev/) contra os schemas em `src/types/`. Basta adicionar um
arquivo novo na pasta correta — não é preciso editar nenhum outro arquivo para ele
aparecer no app (`src/data/farmacos/*.json` é carregado automaticamente).

### Fármacos (`src/data/farmacos/*.json`)

Um arquivo por fármaco. Schema completo em [`src/types/farmaco.ts`](src/types/farmaco.ts).
Campos principais:

- `faixasDose`: lista de faixas de dose, cada uma delimitada por idade
  pós-menstrual (`pmaMinSemanas`/`pmaMaxSemanas` = idade gestacional ao nascer +
  idade pós-natal), idade pós-natal (`dolMinDias`/`dolMaxDias`, dias de vida) e/ou
  peso (`pesoMinG`/`pesoMaxG`). Todos os limites são opcionais; a primeira faixa
  cujos limites incluem o paciente é usada.
- `contraindicacoes`: lista de `{ condicao, descricao, gravidade, conduta }`, onde
  `condicao` vem do vocabulário fechado `CondicaoClinica` (`src/types/comum.ts`) —
  isso é o que permite o cruzamento automático com as condições marcadas no
  paciente. Condições hemodinâmicas/respiratórias (bradicardia, taquicardia,
  hipotensão, hipertensão, hipoxemia, taquipneia, apneia) têm um critério numérico
  de referência em `CONDICAO_CLINICA_CRITERIO` — ajuste esses limiares ao protocolo
  da sua unidade antes de uso clínico.
- `fontes`: sempre cite a origem (bula ANVISA, protocolo institucional, artigo,
  diretriz de sociedade). Use o campo `descricao` para detalhar; `url` é opcional.
- `nivelEvidenciaGeral`: A (ensaio clínico/revisão sistemática em neonatos), B
  (observacional em neonatos ou consenso), C (extrapolado de crianças
  maiores/adultos) ou D (opinião de especialista / bula sem estudo formal).

### Interações medicamentosas (`src/data/interacoes/interacoes.json`)

Lista única de pares `{ farmacoAId, farmacoBId, gravidade, mecanismo, efeitoClinico,
conduta, ... }`. A ordem do par não importa — o motor de verificação checa nos dois
sentidos. Schema em [`src/types/interacao.ts`](src/types/interacao.ts).

### Patologias parentais (`src/data/patologias-parentais/patologias.json`)

Lista única de patologias maternas/paternas com `implicacoesTratamento`: cada
implicação referencia um fármaco específico (`farmacoId`) **ou** uma classe
farmacológica inteira (`classeFarmacologica`, comparada por nome ao
`classeFarmacologica` do fármaco candidato) — use classe quando a implicação vale
para vários fármacos da mesma família. Schema em
[`src/types/patologiaParental.ts`](src/types/patologiaParental.ts).

## Motor de verificação

Toda a lógica de cruzamento fica em [`src/engine/verificarFarmaco.ts`](src/engine/verificarFarmaco.ts):
calcula a idade pós-menstrual, encontra a faixa de dose aplicável, verifica
contraindicações por condição clínica, interações com os medicamentos em uso e
implicações de patologias parentais selecionadas, e resume tudo em um nível de
confiança (`adequado` / `usar_com_cautela` / `contraindicado` /
`sem_dados_suficientes`). `sem_dados_suficientes` significa apenas que nenhuma
faixa de dose cadastrada cobre o perfil do paciente — não deve ser lido como "sem
risco".

[`src/engine/sinaisVitais.ts`](src/engine/sinaisVitais.ts) sugere condições
clínicas a partir dos sinais vitais informados (ex.: FC < 100 bpm sugere
bradicardia), mas a confirmação da condição continua manual — o profissional
decide se aplica a sugestão.

## Status do conteúdo cadastrado

Este repositório inclui atualmente um conjunto inicial de fármacos comumente
usados em UTI neonatal (antibióticos, drogas vasoativas, sedoanalgesia,
anticonvulsivante, fechamento de canal arterial, eletrólitos), todos marcados
como `EXEMPLO` nos campos de fonte/revisão. Popular uma base mais ampla (o objetivo
é cobrir os fármacos mais usados em neonatologia geral e em UTI neonatal) é um
trabalho contínuo de curadoria clínica — siga o formato acima para adicionar
fármacos, interações e patologias parentais adicionais.
