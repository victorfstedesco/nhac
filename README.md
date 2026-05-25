# nhác — Registro de Calorias e Jejum

Aplicação web full-stack para acompanhamento de consumo calórico e jejum intermitente. Permite registrar refeições, definir metas diárias, acompanhar ciclos de jejum e visualizar progresso semanal em gráficos.

> **Aviso:** Este aplicativo é um exercício acadêmico e não substitui orientação médica ou nutricional profissional.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript |
| Banco de dados | PostgreSQL (Supabase) via Prisma 7 + @prisma/adapter-pg |
| Autenticação | JWT (jose) + bcryptjs, cookie httpOnly |
| Validação | Zod (client + server) |
| Estilização | Tailwind CSS |
| Gráficos | Barras CSS customizadas |

---

## Funcionalidades

- **Autenticação** — cadastro, login, logout e troca de senha
- **Refeições (CRUD)** — criar, listar (com filtro por data), editar e excluir refeições
- **Meta calórica** — definir e editar meta diária; barra de progresso no dashboard
- **Jejum** — iniciar/encerrar ciclos (12:12, 14:10, 16:8, 18:6, 24h), apenas um ativo por vez
- **Histórico de jejuns** — listagem com status, duração e protocolo
- **Resumo semanal** — gráfico de calorias por dia, indicador de horas de jejum, médias agregadas
- **Exportação** — download dos dados em CSV (em Configurações)

---

## Setup local

### Pré-requisitos

- Node.js 20+
- npm 10+
- Conta no [Supabase](https://supabase.com) (gratuita)

### Passos

```bash
# 1. Clone o repositório
git clone <url-do-repo>
cd nhac

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Preencha DATABASE_URL e JWT_SECRET conforme instruções abaixo

# 4. Execute as migrations no banco de dados
npx prisma migrate dev --name init

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## Configurando o banco de dados (Supabase)

1. Acesse [supabase.com](https://supabase.com) e crie um projeto gratuito.
2. No painel do projeto, vá em **Settings → Database**.
3. Em **Connection string → URI**, copie a string de conexão direta (porta **5432**).
4. Cole no `.env` como `DATABASE_URL`, substituindo `[YOUR-PASSWORD]` pela sua senha.
5. Execute `npx prisma migrate dev --name init` para criar as tabelas.

---

## Variáveis de ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | Connection string do Supabase (PostgreSQL) | `postgresql://postgres:senha@ref.supabase.co:5432/postgres` |
| `JWT_SECRET` | Chave secreta para assinar tokens JWT | `minha-chave-secreta-longa` |

Veja `.env.example` para referência. **Nunca commite o arquivo `.env`** — ele já está no `.gitignore`.

---

## Deploy (Vercel)

1. Importe o repositório na Vercel.
2. Em **Settings → Environment Variables**, adicione `DATABASE_URL` e `JWT_SECRET`.
3. Faça o deploy normalmente — a Vercel detecta Next.js automaticamente.

---

## Screenshots

### Dashboard
![Dashboard](docs/dashboard.png)

### Refeições
![Refeições](docs/refeicoes.png)

### Jejum
![Jejum](docs/jejum.png)

### Estatísticas
![Estatísticas](docs/estatisticas.png)
