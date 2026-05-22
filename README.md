# nhác — Registro de Calorias e Jejum

Aplicação web full-stack para acompanhamento de consumo calórico e jejum intermitente. Permite registrar refeições, definir metas diárias, acompanhar ciclos de jejum e visualizar progresso semanal em gráficos.

> **Aviso:** Este aplicativo é um exercício acadêmico e não substitui orientação médica ou nutricional profissional.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript |
| Banco de dados | SQLite via Prisma 7 + better-sqlite3 |
| Autenticação | JWT (jose) + bcryptjs, cookie httpOnly |
| Estilização | Tailwind CSS |
| Gráficos | Chart.js (via canvas) |

---

## Funcionalidades

- **Autenticação** — cadastro, login, logout e recuperação de senha
- **Refeições (CRUD)** — criar, listar (com filtro por data), editar e excluir refeições
- **Meta calórica** — definir e editar meta diária; barra de progresso no dashboard
- **Jejum** — iniciar/encerrar ciclos (16:8, 18:6, 20:4, 24h ou personalizado), apenas um ativo por vez
- **Histórico de jejuns** — listagem com status, duração e protocolo
- **Resumo semanal** — gráfico de calorias por dia, indicador de horas de jejum, médias agregadas
- **Exportação** — download dos dados em CSV (em Configurações)

---

## Setup local

### Pré-requisitos

- Node.js 20+
- npm 10+

### Passos

```bash
# 1. Clone o repositório
git clone <url-do-repo>
cd nhac

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite .env e defina um JWT_SECRET seguro

# 4. Crie o banco de dados e execute as migrations
npx prisma migrate dev

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## Variáveis de ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | Caminho do arquivo SQLite | `file:./dev.db` |
| `JWT_SECRET` | Chave secreta para assinar tokens JWT | `minha-chave-secreta` |

Veja `.env.example` para referência. **Nunca commite o arquivo `.env`** — ele já está no `.gitignore`.

---

## Aplicação em produção

> Link será adicionado após o deploy na Vercel.

---

## Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Refeições
![Refeições](docs/screenshots/meals.png)

### Jejum
![Jejum](docs/screenshots/fasting.png)

### Estatísticas
![Estatísticas](docs/screenshots/stats.png)
