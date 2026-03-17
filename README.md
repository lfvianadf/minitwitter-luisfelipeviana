# 🐦 Mini Twitter — Frontend - Projeto b2bit - Luís Felipe Viana

Interface completa do Mini Twitter construída com React + TypeScript + Vite.

---

## 🚀 Setup rápido

```bash
# 1. Instale as dependências
npm install

# 2. as variáveis de ambiente do supabase (imagens) já estão no .env

# 3. Rode em dev
npm run dev
```

## ✅ Requisitos funcionais implementados

| 1 | Registro de usuário (POST /auth/register) | ✅ |
| 2 | Login com JWT salvo no localStorage | ✅ |
| 3 | Logout (POST /auth/logout + limpa store) | ✅ |
| 4 | Timeline com paginação + scroll infinito + skeleton de carregamento | ✅ |
| 5 | Busca de posts por título (no projeto diz termo ou título, mas o backend só está connfigurado para título - if (search) {queryStr += ` WHERE p.title LIKE ? `;params.push(`%${search}%`);})| ✅ |
| 6 | Criação de post com imagem (Integração direta com o bucket S3 no supabase) | ✅ |
| 7 | Edição e exclusão apenas dos próprios posts | ✅ |
| 8 | Like/unlike com atualização otimista | ✅ |

### Extras implementados
- 🌙 **Dark mode** via Tailwind `class` strategy + Zustand persistido
- 📜 **Scroll infinito** com `react-intersection-observer`
- 🧪 **Testes unitários** com Vitest + React Testing Library
- 🎭 **Testes E2E** com Playwright
- ⚡ **Estado global** com Zustand (auth + theme)

---

## 🧪 Testes

```bash
# Unitários
npm run test

# E2E (precisa do dev server rodando)
npm run test:e2e
```

## 🔑 Variáveis de ambiente

| Variável | Descrição | Padrão |
|---------|-----------|--------|
|VITE_API_URL | URL base da API backend | `http://localhost:3000` |
|VITE_SUPABASE_URL | URL do supabase | está apenas no .env por segurança. |
|VITE_SUPABASE_BUCKET | Nome do bucket (criado para o projeto) | b2bit
|VITE_SUPABASE_ANON_KEY | Conta criada para o projeto | a chave está no .env, não irei colocá-la aqui por segurança. |

