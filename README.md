# NeoDose

Ferramenta de apoio à decisão clínica para verificação de adequação de fármacos em
pacientes neonatais: idade gestacional/pós-natal, peso, sinais vitais, exames de
função renal/hepática e condições clínicas do paciente, cruzados com uma base de
dados de fármacos, interações medicamentosas e implicações de patologias parentais.
Disponível em português (Brasil), inglês (EUA) e espanhol.

> **Este aplicativo não substitui o julgamento clínico.** Ele organiza e cruza
> informações previamente cadastradas; a responsabilidade pela decisão terapêutica é
> sempre do profissional assistente. Todo o conteúdo cadastrado em `src/data/` deve
> ser revisado por um profissional responsável antes de qualquer uso clínico real.

## Idiomas

O idioma inicial é detectado a partir das preferências do navegador
(`navigator.languages`), com português (Brasil) como padrão de fallback — ver
[`src/i18n/idiomas.ts`](src/i18n/idiomas.ts). Optamos por preferência de idioma do
navegador em vez de geolocalização por IP: não depende de nenhum serviço de
terceiros (evita enviar o IP do profissional a uma API externa) e funciona sem
requisição de rede adicional. Um seletor no cabeçalho permite trocar de idioma
manualmente a qualquer momento.

Os textos de interface (rótulos, botões, avisos, nomes de condições clínicas,
níveis de evidência, vias de administração etc.) estão traduzidos nos 3 idiomas em
[`src/i18n/traducoes.ts`](src/i18n/traducoes.ts). **O conteúdo clínico** em
`src/data/` (nome do fármaco, indicações, contraindicações, condutas, patologias
parentais) **também é multilíngue**: cada campo de texto é um objeto
`{ "pt-BR": ..., "en-US": ..., "es": ... }` (tipo `TextoMultilingue`, ver
`src/types/comum.ts`), resolvido para o idioma atual pelo helper `texto()`/`textoLista()`
em [`src/i18n/texto.ts`](src/i18n/texto.ts). A exceção são as citações em `fontes`
(campo `descricao`), que permanecem no idioma original da referência — bibliografia
não é traduzida.

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

## Fontes científicas

Fármacos, interações e patologias parentais são referenciados com fontes reais
sempre que possível: ensaios clínicos randomizados, metanálises, revisões
sistemáticas e estudos observacionais indexados no PubMed (preferencialmente do
período 2010-2025), e — para interações medicamentosas — dados de referência tipo
DrugBank e literatura correlata. Cada entrada tem um campo `fontes` com a citação
completa (autores, título, periódico, ano, DOI/URL quando disponível) e um
`nivelEvidenciaGeral`/`nivelEvidencia` (A: ECR/revisão sistemática em neonatos: B:
observacional/consenso; C: extrapolado de crianças maiores/adultos; D: opinião de
especialista/bula). Entradas ainda sem fonte real conferida ficam marcadas
`EXEMPLO` no campo de fonte — substitua antes de uso clínico.

## Interface: abas "Interações" e "Posologia"

Após preencher os dados do paciente e selecionar o fármaco a ser administrado (com
posologia planejada opcional), o resultado é dividido em duas abas:

- **Interações**: contraindicações por condição clínica do paciente, interações
  com os medicamentos já em uso e alertas de patologias parentais.
- **Posologia**: faixa de dose recomendada para o perfil do paciente, divergências
  entre a posologia informada e a recomendada (dose, intervalo, via — tolerância de
  20% na dose antes de sinalizar), e ajustes recomendados quando há condição
  clínica que exige ajuste de dose (ex.: insuficiência renal/hepática).

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
  cujos limites incluem o paciente é usada. `viaAdministracao` é um valor fechado
  de `ViaAdministracao` (`src/types/comum.ts`) — se o mesmo fármaco/dose vale por
  mais de uma via (ex.: oral e intravenosa), cadastre uma faixa por via (a dose
  numérica pode ser repetida). `doseUnidade` é notação universal (ex.: "mg/kg/dose")
  e não é traduzida; `observacoes` é `TextoMultilingue`.
- `contraindicacoes`: lista de `{ condicao, descricao, gravidade, conduta }`, onde
  `condicao` vem do vocabulário fechado `CondicaoClinica` (`src/types/comum.ts`) —
  isso é o que permite o cruzamento automático com as condições marcadas no
  paciente. `descricao` e `conduta` são `TextoMultilingue`. Condições
  hemodinâmicas/respiratórias (bradicardia, taquicardia, hipotensão, hipertensão,
  hipoxemia, taquipneia, apneia) têm um critério numérico de referência em
  `criterios` (`src/i18n/traducoes.ts`) — ajuste esses limiares ao protocolo da sua
  unidade antes de uso clínico.
- `fontes`: sempre cite a origem real (artigo científico, bula ANVISA, protocolo
  institucional, diretriz de sociedade) — ver seção "Fontes científicas" acima.
  `descricao` aqui **não** é `TextoMultilingue` — citações não são traduzidas.
- `nivelEvidenciaGeral`: A/B/C/D conforme descrito acima.

### Interações medicamentosas (`src/data/interacoes/interacoes.json`)

Lista única de pares `{ farmacoAId, farmacoBId, gravidade, mecanismo, efeitoClinico,
conduta, ... }`. A ordem do par não importa — o motor de verificação checa nos dois
sentidos. Schema em [`src/types/interacao.ts`](src/types/interacao.ts).

### Patologias parentais (`src/data/patologias-parentais/patologias.json`)

Lista única de patologias maternas/paternas com `implicacoesTratamento`: cada
implicação referencia um fármaco específico (`farmacoId`) **ou** uma classe
farmacológica inteira (`classeFarmacologica`, `TextoMultilingue` comparado pelo
valor `pt-BR` — a comparação usa sempre o texto em português como chave canônica,
independente do idioma exibido na interface, para que o cruzamento de dados não
dependa do idioma selecionado) — use classe quando a implicação vale para vários
fármacos da mesma família, mesmo que ainda não haja um fármaco cadastrado dessa
classe (a implicação passa a valer automaticamente quando um for adicionado; **use
exatamente o mesmo texto em pt-BR** cadastrado em `classeFarmacologica` do(s)
fármaco(s) correspondente(s)). Schema em
[`src/types/patologiaParental.ts`](src/types/patologiaParental.ts).
Inclui atualmente: diabetes gestacional, uso materno de opioides, HIV/AIDS,
hepatites virais (A, B, C, D), sífilis, toxoplasmose, citomegalovírus, rubéola,
doença de Chagas e tuberculose materna.

## Motor de verificação

Toda a lógica de cruzamento fica em [`src/engine/verificarFarmaco.ts`](src/engine/verificarFarmaco.ts):
calcula a idade pós-menstrual, encontra a faixa de dose aplicável, verifica
contraindicações por condição clínica, interações com os medicamentos em uso,
implicações de patologias parentais selecionadas e divergências entre a posologia
informada e a recomendada (`compararPosologia`), e resume tudo em um nível de
confiança (`adequado` / `usar_com_cautela` / `contraindicado` /
`sem_dados_suficientes`). `sem_dados_suficientes` significa apenas que nenhuma
faixa de dose cadastrada cobre o perfil do paciente — não deve ser lido como "sem
risco".

[`src/engine/sinaisVitais.ts`](src/engine/sinaisVitais.ts) sugere condições
clínicas a partir dos sinais vitais informados (ex.: FC < 100 bpm sugere
bradicardia), mas a confirmação da condição continua manual — o profissional
decide se aplica a sugestão. O mesmo vale para os exames de função renal/hepática
informados no formulário: os valores são exibidos para contextualizar a decisão,
mas não classificam automaticamente "insuficiência renal/hepática" (os valores de
referência normais variam com idade gestacional e pós-natal).

## Status do conteúdo cadastrado

Este repositório inclui atualmente 18 fármacos comuns em UTI neonatal
(antibióticos, drogas vasoativas, sedoanalgesia, anticonvulsivante, fechamento de
canal arterial, eletrólitos/vitaminas) e 13 patologias parentais. Popular uma base
mais ampla (o objetivo é cobrir os fármacos mais usados em neonatologia geral e em
UTI neonatal) é um trabalho contínuo de curadoria clínica — siga o formato acima
para adicionar fármacos, interações e patologias parentais adicionais, sempre
citando fontes reais.
