import Image from "next/image";
import Link from "next/link";

/* ─────────────────────────────────────────── helpers ── */
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold
      bg-brand-light text-brand border border-brand/20">
      {children}
    </span>
  );
}

function SectionTitle({ label, title, sub }: { label: string; title: React.ReactNode; sub?: string }) {
  return (
    <div className="flex flex-col gap-2 mb-8">
      <span className="text-xs font-bold uppercase tracking-widest text-brand">{label}</span>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 leading-tight">{title}</h2>
      {sub && <p className="text-base text-zinc-500 font-medium max-w-xl">{sub}</p>}
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-zinc-100 rounded-2xl shadow-[0_2px_16px_rgb(0,0,0,0.04)] ${className}`}>
      {children}
    </div>
  );
}

function FlowStep({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="shrink-0 w-9 h-9 rounded-xl bg-brand text-white flex items-center justify-center
        text-xs font-extrabold shadow-sm shadow-brand/30">
        {n}
      </div>
      <div>
        <p className="text-sm font-extrabold text-zinc-900">{title}</p>
        <p className="text-sm text-zinc-500 font-medium mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── page ── */
export default function TechPage() {
  return (
    <div className="min-h-screen bg-zinc-50/60 font-sans">

      {/* ── nav ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-zinc-100
        shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/auth/login" className="transition-transform hover:scale-105 active:scale-95">
            <Image src="/logo.svg" alt="nhác" width={72} height={24} priority />
          </Link>
          <Link
            href="/auth/register"
            className="bg-brand hover:bg-brand-dark text-white text-sm font-bold
              px-4 py-2 rounded-xl transition-all duration-200 shadow-sm shadow-brand/25
              hover:shadow-md hover:shadow-brand/30 hover:-translate-y-0.5 active:scale-95"
          >
            Criar conta
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 flex flex-col gap-20">

        {/* ── hero ── */}
        <section className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 bg-brand-light border border-brand/20
            text-brand text-xs font-bold px-3 py-1.5 rounded-full w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            Documentação técnica
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900
            tracking-tight leading-[1.1]">
            nhác —<br />
            <span className="text-brand">como foi construído</span>
          </h1>
          <p className="text-lg text-zinc-500 font-medium max-w-2xl leading-relaxed">
            Aplicação web full-stack de rastreamento alimentar e jejum intermitente.
            Autenticação própria com JWT, banco relacional PostgreSQL via Supabase e
            deploy serverless na Vercel.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {["Next.js 16","TypeScript","PostgreSQL","Prisma 7","Tailwind CSS 4",
              "Zod 4","JWT / jose","Vercel","Supabase"].map(t => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        </section>

        {/* ── stack ── */}
        <section>
          <SectionTitle
            label="Stack"
            title={<>Tecnologias <span className="text-brand">utilizadas</span></>}
            sub="Cada escolha tecnológica foi feita com um motivo específico."
          />
          <Card>
            <div className="divide-y divide-zinc-50">
              {[
                { camada: "Framework",      tech: "Next.js 16.2",              motivo: "Full-stack em único repositório — frontend e API Route Handlers juntos no mesmo projeto" },
                { camada: "Linguagem",      tech: "TypeScript 5",              motivo: "Tipagem estática elimina erros de runtime e garante contratos entre frontend e API" },
                { camada: "Banco de dados", tech: "PostgreSQL · Supabase",     motivo: "Banco relacional gerenciado com SSL, free tier, suporte a IPv4 via connection pooler" },
                { camada: "ORM",            tech: "Prisma 7",                  motivo: "Geração automática de tipos TypeScript a partir do schema e migrações versionadas em SQL" },
                { camada: "Driver de BD",   tech: "pg + @prisma/adapter-pg",   motivo: "Conexão direta ao PostgreSQL sem query engine binária — essencial para ambientes serverless" },
                { camada: "Estilização",    tech: "Tailwind CSS 4",            motivo: "CSS utilitário com zero arquivos CSS separados; design tokens via variáveis CSS nativas" },
                { camada: "Autenticação",   tech: "JWT · jose · bcryptjs",     motivo: "Implementação própria stateless: sem sessão no servidor, hash bcrypt salt=10 para senhas" },
                { camada: "Validação",      tech: "Zod 4",                     motivo: "Schema validation com inferência de tipos TypeScript — mesma lógica no servidor e no cliente" },
                { camada: "Deploy",         tech: "Vercel (serverless)",       motivo: "Plataforma nativa para Next.js com deploy automático a cada push no GitHub" },
              ].map(({ camada, tech, motivo }) => (
                <div key={camada} className="grid grid-cols-1 sm:grid-cols-[140px_180px_1fr] gap-1 sm:gap-4
                  px-5 py-4 hover:bg-zinc-50/80 transition-colors">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 sm:pt-0.5">
                    {camada}
                  </span>
                  <span className="text-sm font-extrabold text-brand font-mono">{tech}</span>
                  <span className="text-sm text-zinc-500 font-medium leading-relaxed">{motivo}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* ── arquitetura ── */}
        <section>
          <SectionTitle
            label="Arquitetura"
            title={<>Estrutura <span className="text-brand">do projeto</span></>}
            sub="App Router do Next.js 16 dividido em três zonas bem definidas."
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                zone: "Pública",
                path: "app/auth/",
                color: "bg-zinc-100 text-zinc-600",
                dot: "bg-zinc-400",
                items: ["Página de login", "Página de cadastro", "Layout com foto split-screen"],
              },
              {
                zone: "Autenticada",
                path: "app/(protected)/",
                color: "bg-brand-light text-brand",
                dot: "bg-brand",
                items: ["Dashboard", "Refeições", "Jejum + Histórico", "Estatísticas", "Configurações"],
              },
              {
                zone: "API REST",
                path: "app/api/",
                color: "bg-zinc-900 text-white",
                dot: "bg-green-400",
                items: ["Auth (register/login/logout/me)", "Meals (CRUD)", "Fasting (start/stop/history)", "Stats, Settings, Export"],
              },
            ].map(({ zone, path, color, dot, items }) => (
              <Card key={zone} className="p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${color}`}>{zone}</span>
                  <span className={`w-2 h-2 rounded-full ${dot}`} />
                </div>
                <code className="text-xs font-mono text-zinc-400 bg-zinc-50 px-2.5 py-1.5 rounded-lg">
                  {path}
                </code>
                <ul className="flex flex-col gap-1.5">
                  {items.map(i => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 font-medium">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-zinc-300 shrink-0" />
                      {i}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
          <Card className="mt-4 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Route Group</p>
            <p className="text-sm text-zinc-600 font-medium leading-relaxed">
              O parêntese em <code className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-brand text-xs">(protected)</code> é
              uma <strong className="text-zinc-800">Route Group</strong> do Next.js — agrupa rotas sem afetar a URL, permitindo
              aplicar um layout compartilhado (navbar + nav mobile) exclusivamente para usuários autenticados,
              sem qualquer lógica adicional nas páginas filhas.
            </p>
          </Card>
        </section>

        {/* ── autenticação ── */}
        <section>
          <SectionTitle
            label="Autenticação"
            title={<>Sistema <span className="text-brand">JWT próprio</span></>}
            sub="Sem NextAuth, Firebase ou Auth0. Implementação completa do zero com controle total do fluxo."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Card className="p-5 flex flex-col gap-4">
              <p className="text-xs font-bold uppercase tracking-widest text-brand">Registro</p>
              <div className="flex flex-col gap-3">
                <FlowStep n="1" title="Validação Zod" desc="Nome ≥2 chars, email válido, senha ≥6 chars" />
                <FlowStep n="2" title="Hash bcrypt" desc="Senha hasheada com salt rounds = 10" />
                <FlowStep n="3" title="Salvar no banco" desc="INSERT na tabela User via Prisma" />
                <FlowStep n="4" title="Gerar JWT" desc="HS256, expira em 7 dias, payload: userId + email" />
                <FlowStep n="5" title="Cookie httpOnly" desc="nhac_token, sameSite: lax, sem acesso JS" />
              </div>
            </Card>
            <Card className="p-5 flex flex-col gap-4">
              <p className="text-xs font-bold uppercase tracking-widest text-brand">Login</p>
              <div className="flex flex-col gap-3">
                <FlowStep n="1" title="Validação Zod" desc="Email e senha presentes e válidos" />
                <FlowStep n="2" title="Buscar usuário" desc="SELECT WHERE email = ? via Prisma" />
                <FlowStep n="3" title="Comparar senha" desc="bcrypt.compare(input, hash)" />
                <FlowStep n="4" title="Gerar JWT" desc="Mesmo algoritmo HS256, novo token" />
                <FlowStep n="5" title="Cookie httpOnly" desc="Mesmas flags de segurança" />
              </div>
            </Card>
          </div>
          <Card className="p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Proteção de rotas — proxy.ts</p>
            <p className="text-sm text-zinc-600 font-medium leading-relaxed mb-4">
              O arquivo <code className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-brand text-xs">proxy.ts</code> é
              o equivalente ao <code className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-xs">middleware.ts</code> do
              Next.js 15, renomeado na versão 16. Executa <strong className="text-zinc-800">antes de qualquer página ou API</strong> carregar,
              interceptando todas as requisições:
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                { cond: "Rota pública (/auth/*)", action: "→ passa direto", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                { cond: "API sem cookie JWT válido", action: "→ retorna 401 Unauthorized", color: "text-red-600 bg-red-50 border-red-100" },
                { cond: "Página sem cookie JWT válido", action: "→ redireciona para /auth/login", color: "text-amber-600 bg-amber-50 border-amber-100" },
                { cond: "Qualquer rota com JWT válido", action: "→ passa para a página/API", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
              ].map(({ cond, action, color }) => (
                <div key={cond} className={`flex flex-col sm:flex-row sm:items-center sm:justify-between
                  gap-1 px-4 py-2.5 rounded-xl border text-sm font-medium ${color}`}>
                  <span className="font-mono text-xs">{cond}</span>
                  <span className="font-bold">{action}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* ── banco de dados ── */}
        <section>
          <SectionTitle
            label="Banco de dados"
            title={<>Modelagem <span className="text-brand">relacional</span></>}
            sub="Três entidades com relações de chave estrangeira e deleção em cascata."
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                model: "User",
                rel: "1",
                fields: [
                  { name: "id", type: "String", note: "cuid()" },
                  { name: "name", type: "String", note: "" },
                  { name: "email", type: "String", note: "@unique" },
                  { name: "password", type: "String", note: "bcrypt hash" },
                  { name: "calorieGoal", type: "Int", note: "default 2000" },
                  { name: "resetToken", type: "String?", note: "" },
                  { name: "createdAt / updatedAt", type: "DateTime", note: "auto" },
                ],
              },
              {
                model: "Meal",
                rel: "N → User",
                fields: [
                  { name: "id", type: "String", note: "cuid()" },
                  { name: "type", type: "String", note: "enum 5 tipos" },
                  { name: "description", type: "String", note: "" },
                  { name: "calories", type: "Int", note: "" },
                  { name: "date", type: "DateTime", note: "" },
                  { name: "userId", type: "String", note: "FK → User" },
                  { name: "createdAt / updatedAt", type: "DateTime", note: "auto" },
                ],
              },
              {
                model: "FastingSession",
                rel: "N → User",
                fields: [
                  { name: "id", type: "String", note: "cuid()" },
                  { name: "protocol", type: "String", note: 'ex: "16:8"' },
                  { name: "targetHours", type: "Int", note: "" },
                  { name: "startTime", type: "DateTime", note: "" },
                  { name: "endTime", type: "DateTime?", note: "nullable" },
                  { name: "status", type: "String", note: "active/completed/interrupted" },
                  { name: "userId", type: "String", note: "FK → User" },
                ],
              },
            ].map(({ model, rel, fields }) => (
              <Card key={model} className="overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-50 flex items-center justify-between">
                  <span className="font-extrabold text-zinc-900 font-mono text-sm">{model}</span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{rel}</span>
                </div>
                <div className="divide-y divide-zinc-50">
                  {fields.map(({ name, type, note }) => (
                    <div key={name} className="px-4 py-2 flex items-center justify-between gap-2">
                      <span className="text-xs font-mono text-zinc-700 truncate">{name}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-bold text-brand font-mono">{type}</span>
                        {note && (
                          <span className="text-[9px] font-medium text-zinc-400 bg-zinc-50 px-1.5 py-0.5 rounded">
                            {note}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
          <Card className="mt-4 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Cascade Delete</p>
            <p className="text-sm text-zinc-600 font-medium leading-relaxed">
              Ambas as relações usam <code className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-brand text-xs">onDelete: Cascade</code>.
              Ao deletar um usuário, todas as suas refeições e sessões de jejum são automaticamente
              removidas pelo próprio banco de dados, sem necessidade de lógica adicional na aplicação.
            </p>
          </Card>
        </section>

        {/* ── api ── */}
        <section>
          <SectionTitle
            label="API REST"
            title={<>Endpoints <span className="text-brand">da aplicação</span></>}
            sub="Route Handlers do Next.js 16. Toda entrada de dados passa por validação Zod antes de tocar o banco."
          />
          <Card className="overflow-hidden">
            <div className="divide-y divide-zinc-50">
              {[
                { method: "POST",   path: "/api/auth/register",        desc: "Criar conta — valida, hasheia senha, gera JWT" },
                { method: "POST",   path: "/api/auth/login",           desc: "Login — compara bcrypt, gera JWT, define cookie" },
                { method: "POST",   path: "/api/auth/logout",          desc: "Logout — apaga o cookie nhac_token" },
                { method: "GET",    path: "/api/auth/me",              desc: "Retorna dados do usuário logado via JWT" },
                { method: "GET",    path: "/api/meals",                desc: "Lista refeições; suporta ?date=YYYY-MM-DD" },
                { method: "POST",   path: "/api/meals",                desc: "Cria nova refeição com validação Zod" },
                { method: "PUT",    path: "/api/meals/[id]",           desc: "Edita refeição — verifica ownership" },
                { method: "DELETE", path: "/api/meals/[id]",           desc: "Deleta refeição — verifica ownership" },
                { method: "GET",    path: "/api/fasting",              desc: "Retorna sessão de jejum ativa ou null" },
                { method: "POST",   path: "/api/fasting",              desc: "Inicia jejum; interrompe qualquer sessão ativa anterior" },
                { method: "PUT",    path: "/api/fasting/[id]",         desc: "Finaliza sessão — calcula completed vs interrupted" },
                { method: "GET",    path: "/api/fasting/history",      desc: "Histórico de jejuns concluídos e interrompidos" },
                { method: "GET",    path: "/api/stats",                desc: "Estatísticas dos últimos 7 dias: calorias, jejuns, médias" },
                { method: "GET",    path: "/api/settings",             desc: "Retorna perfil e meta calórica do usuário" },
                { method: "PUT",    path: "/api/settings",             desc: "Atualiza nome, email ou meta calórica" },
                { method: "PUT",    path: "/api/auth/change-password", desc: "Troca senha — verifica hash atual, grava novo hash" },
                { method: "GET",    path: "/api/export",               desc: "Exporta todos os dados em JSON ou CSV (?format=csv)" },
              ].map(({ method, path, desc }) => {
                const colors: Record<string, string> = {
                  GET:    "bg-blue-50 text-blue-600",
                  POST:   "bg-emerald-50 text-emerald-600",
                  PUT:    "bg-amber-50 text-amber-600",
                  DELETE: "bg-red-50 text-red-600",
                };
                return (
                  <div key={`${method}-${path}`}
                    className="grid grid-cols-1 sm:grid-cols-[64px_260px_1fr] gap-1 sm:gap-4
                      px-5 py-3 hover:bg-zinc-50/80 transition-colors items-center">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md w-fit ${colors[method]}`}>
                      {method}
                    </span>
                    <code className="text-xs font-mono text-zinc-700">{path}</code>
                    <span className="text-sm text-zinc-500 font-medium">{desc}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </section>

        {/* ── deploy ── */}
        <section>
          <SectionTitle
            label="Deploy"
            title={<>Pipeline de <span className="text-brand">produção</span></>}
            sub="Deploy automático a cada push no GitHub, com geração do cliente Prisma incluída."
          />
          <Card className="p-5 sm:p-8">
            <div className="flex flex-col gap-5">
              <FlowStep
                n="1" title="git push → GitHub (branch: main)"
                desc="Vercel detecta o push automaticamente via webhook"
              />
              <div className="w-px h-4 bg-zinc-200 ml-4" />
              <FlowStep
                n="2" title="npm install"
                desc="Instala as 470 dependências do package-lock.json"
              />
              <div className="w-px h-4 bg-zinc-200 ml-4" />
              <FlowStep
                n="3" title="postinstall: prisma generate"
                desc="Gera o cliente Prisma em app/generated/prisma/ — necessário pois o diretório não é commitado"
              />
              <div className="w-px h-4 bg-zinc-200 ml-4" />
              <FlowStep
                n="4" title="next build (Turbopack)"
                desc="Compila todas as páginas e API routes; serverExternalPackages exclui pg e Prisma do bundle"
              />
              <div className="w-px h-4 bg-zinc-200 ml-4" />
              <FlowStep
                n="5" title="Deploy como funções serverless"
                desc="Cada API route vira uma função Lambda isolada; páginas estáticas viram CDN assets"
              />
            </div>
          </Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Card className="p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                serverExternalPackages
              </p>
              <p className="text-sm text-zinc-600 font-medium leading-relaxed">
                Configurado em <code className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-brand text-xs">next.config.ts</code> para{" "}
                <code className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-xs">pg</code>,{" "}
                <code className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-xs">@prisma/client</code> e{" "}
                <code className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-xs">@prisma/adapter-pg</code>.
                Sem isso, o Turbopack tenta fazer bundle de módulos nativos Node.js e a build falha.
              </p>
            </Card>
            <Card className="p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                Supabase Connection Pooler
              </p>
              <p className="text-sm text-zinc-600 font-medium leading-relaxed">
                A connection string da Vercel usa o <strong className="text-zinc-800">pooler do Supabase</strong> (porta 6543),
                não a conexão direta (porta 5432). A conexão direta usa IPv6 — incompatível com
                os servidores serverless da Vercel que só suportam IPv4.
              </p>
            </Card>
          </div>
        </section>

        {/* ── decisões técnicas ── */}
        <section>
          <SectionTitle
            label="Decisões de projeto"
            title={<>Por que <span className="text-brand">essas escolhas</span></>}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                n: "01",
                title: "Auth manual com JWT",
                body: "Em vez de NextAuth ou Clerk, o sistema de autenticação foi implementado do zero. Isso demonstra entendimento do protocolo JWT, do fluxo de cookies httpOnly e do hashing de senhas — sem abstrações que escondem a complexidade.",
              },
              {
                n: "02",
                title: "Zod em server e client",
                body: "O mesmo schema de validação é reutilizado no frontend (feedback imediato ao usuário) e no backend (garantia de integridade antes de tocar o banco). Zero duplicação de regras de validação.",
              },
              {
                n: "03",
                title: "Prisma driver adapter",
                body: "O uso de @prisma/adapter-pg com pg.Pool elimina a query engine binária do Prisma. Isso reduz o tamanho do bundle, simplifica o deploy serverless e evita problemas de compatibilidade de binários entre macOS e Linux.",
              },
              {
                n: "04",
                title: "proxy.ts no Next.js 16",
                body: "O arquivo proxy.ts (renomeado de middleware.ts no Next.js 16) executa no runtime Node.js antes de qualquer página. Centraliza toda a lógica de autenticação em um único lugar, sem repetir verificações em cada página.",
              },
              {
                n: "05",
                title: "Route Group (protected)",
                body: "O agrupamento (protected) aplica o layout com navbar a todas as páginas autenticadas sem afetar as URLs. É uma feature do App Router que mantém o código organizado sem criar rotas desnecessárias.",
              },
              {
                n: "06",
                title: "Pool max: 1 no serverless",
                body: "Funções serverless podem ter múltiplas instâncias simultâneas. Limitar pg.Pool a 1 conexão por instância evita estourar o limite de conexões do Supabase (25 no free tier), enquanto o singleton globalThis reutiliza a conexão dentro da mesma execução.",
              },
            ].map(({ n, title, body }) => (
              <Card key={n} className="p-5 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-extrabold text-zinc-100 font-mono leading-none">{n}</span>
                  <p className="text-sm font-extrabold text-zinc-900">{title}</p>
                </div>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed">{body}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* ── cta ── */}
        <section className="border-t border-zinc-100 pt-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xl font-extrabold text-zinc-900">Pronto para experimentar?</p>
              <p className="text-sm text-zinc-500 font-medium mt-1">
                Crie uma conta gratuita e comece a rastrear sua alimentação agora.
              </p>
            </div>
            <Link
              href="/auth/register"
              className="shrink-0 bg-brand hover:bg-brand-dark text-white font-bold
                px-8 py-3.5 rounded-2xl transition-all duration-200 shadow-sm shadow-brand/25
                hover:shadow-md hover:shadow-brand/30 hover:-translate-y-0.5 active:scale-95 text-sm"
            >
              Criar conta grátis
            </Link>
          </div>
        </section>

      </main>

      <footer className="border-t border-zinc-100 mt-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
          <Image src="/logo.svg" alt="nhác" width={56} height={19} />
          <p className="text-xs font-medium text-zinc-400">
            Este aplicativo não substitui orientação médica ou nutricional profissional.
          </p>
        </div>
      </footer>

    </div>
  );
}
