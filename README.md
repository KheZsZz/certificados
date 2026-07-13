<div align="center">
  <h1>🛡️ Certificados — API Backend</h1>
  <p><i>Backend robusto, altamente seguro e escalável construído com o ecossistema Fastify.</i></p>

  <!-- Badges de Tecnologia e Status Animados/Estilizados -->
  <img src="https://img.shields.io/badge/Runtime-Node.js%20v24+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Framework-Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Security-RBAC%20%26%20JWT-red?style=for-the-badge&logo=json-web-tokens&logoColor=white" alt="JWT Security" />
</div>

---

## 🚀 Sobre o Projeto

Backend escalável e seguro desenvolvido em **Node.js** com **Fastify** e **Prisma ORM**, conectado a um banco de dados relacional **PostgreSQL (Neon/Supabase)**. O sistema conta com arquitetura de rotas modular, controle de acesso baseado em papéis (RBAC) com hierarquia de pesos e autenticação via JWT com rotação de Refresh Tokens utilizando Cookies seguros (`HttpOnly`).

---

## 🛠️ Tecnologias Utilizadas

> O projeto foi construído utilizando as ferramentas mais modernas do ecossistema JavaScript/TypeScript focado em performance de processamento I/O.

* 🟢 **Runtime:** Node.js (v24+)
* ⚡ **Framework Web:** Fastify
* 🐘 **Banco de Dados:** PostgreSQL (Serverless via Neon/Supabase)
* ⬢ **ORM:** Prisma ORM
* 🔑 **Autenticação:** `@fastify/jwt` & `bcrypt`
* 🍪 **Gerenciamento de Cookies:** `@fastify/cookie`
* 🔷 **Linguagem & Tipagem:** TypeScript

---

## 🛡️ Mecânicas de Segurança & Arquitetura

### 1. Autenticação de Duas Camadas (Tokens Separados)
* **Access Token (JWT):** Token de vida curta (**15 minutos**) carregado na memória do frontend. É enviado no cabeçalho HTTP `Authorization: Bearer <token>` para validar as requisições normais de dados.
* **Refresh Token (JWT):** Token de vida longa (**7 dias**). **Nunca** é exposto no corpo do JSON ou salvo no `localStorage`. Ele é injetado pelo backend diretamente em um cookie HTTP com as propriedades de segurança `httpOnly` (bloqueia leitura via scripts JavaScript/XSS), `secure` (exige HTTPS) e `sameSite: 'lax'` (proteção contra CSRF).

### 2. Rotação de Tokens (Anti-Replay Attack)
Toda vez que o Access Token expira e o cliente consome a rota `/refresh`, o `authService` invalida e deleta o Refresh Token antigo do banco de dados e gera um novo par de tokens (Access + Refresh). Se um token antigo for interceptado e reutilizado maliciosamente, o backend detecta a ausência dele no banco de dados e derruba a sessão imediatamente.

### 3. Sistema de Permissões Hierárquicas (RBAC)
Em vez de validar strings fixas em listas, o sistema adota um padrão de peso numérico para os cargos definidos no banco de dados:

```typescript
export const ROLE_HIERARCHY: Record<string, number> = {
  STUDENT: 1,
  TEACHER: 2,
  SECRETARY: 3,
  FINANCER: 4,
  ADM: 5,
  DEVELOPERMENT: 6, // Nível máximo e irrestrito
}
