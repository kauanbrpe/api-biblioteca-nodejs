# 🚀 API - Biblioteca

> Como já é tradição minha, todas as férias da faculdade eu faço uma API de Biblioteca. Já foram feitos, até agora, com as linguagens Java e C Sharp (Julho de 2025 e Janeiro de 2026). Agora fiz com a linguagem TypeScript, utilizando Node.Js, Express, MongoDB e PostgreSQL.

---

## 🛠️ Tecnologias

- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) **Node.js** — Runtime JavaScript
- ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) **TypeScript** — Tipagem estática
- ![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white) **Express** — Framework HTTP
- ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) **MongoDB** — Banco de Dados NoSQL
- ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat&logo=mongoose&logoColor=white) **Mongoose** — ODM para MongoDB
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white) **PostgreSQL** — Banco de Dados Relacional
- ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white) **Prisma** — ORM para Banco de Dados Relacional
- ![Zod](https://img.shields.io/badge/Zod-2D3748?style=flat&logo=zod&logoColor=white) **Zod** — Validação de dados schema-first
- ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) **Docker** — Containerização local (Bancos de Dados)
- ![Scalar](https://img.shields.io/badge/Scalar-000000?style=flat&logo=scalar&logoColor=white) **Scalar** — Documentação interativa da API (OpenAPI)
- ![Render](https://img.shields.io/badge/Render-46E3B7?style=flat&logo=render&logoColor=white) **Render** — Hospedagem da API e do PostgreSQL
- ![MongoDB Atlas](https://img.shields.io/badge/MongoDB%20Atlas-47A248?style=flat&logo=mongodb&logoColor=white) **MongoDB Atlas** — Banco MongoDB gerenciado (produção)

---

## 📁 Estrutura do Projeto

```text
data/                 # Banco de Dados (uso local via Docker)
node_modules/         # Dependências do projeto
prisma/
└── schema.prisma     # Configurações do Prisma com o Postgres
src/
├── server.ts         # Entry point
├── app.ts            # Configuração do Express
├── routes.ts         # Definição de rotas
├── config/           # Configurações de instâncias (Prisma/Mongoose/env)
├── controllers/      # Lógica dos endpoints
├── models/           # Schemas do Mongoose
├── repositories/     # Acesso e persistência de dados (Separados por Banco de Dados)
│   ├── mongodb/
│   └── postgres/
├── services/          # Regras de negócio da aplicação
└── utils/             # Funções utilitárias e auxiliares
.env                   # Variáveis de ambiente (Não versionar)
.env.example            # Modelo das variáveis de ambiente necessárias
render.yaml               # Blueprint de configuração do Render
docker-compose.yml         # Configurações do Container Docker (uso local)
prisma.config.ts             # Configurações do Prisma (fora do schema.prisma)
package-lock.json             # Dependências do projeto
package.json                   # Configurações de comandos NPM
tsconfig.json                   # Configurações do TypeScript
```

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (veja `.env.example` como referência):

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/api-biblioteca

DB_USER=postgres
DB_PASSWORD=XXXXXX (senha que desejar)
DB_NAME=api_biblioteca

DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}?schema=public
```

> Em produção (Render), essas variáveis são preenchidas diretamente no painel do serviço, com `MONGODB_URI` apontando para o MongoDB Atlas e `DATABASE_URL` para o PostgreSQL gerenciado pelo Render.

## 🚀 Como Rodar Localmente

### Pré-requisitos

- Node.js
- NPM
- Docker e Docker Compose

#### Opcionais

- MongoDB Compass
- pgAdmin

Não são necessárias para o funcionamento da API. Elas são opcionais e sugeridas apenas caso deseje visualizar os dados diretamente nos bancos de dados.

### Infraestrutura (Bancos de Dados via Docker)

Este projeto utiliza o MongoDB e o PostgreSQL rodando em containers para garantir um ambiente consistente e isolado em desenvolvimento.

No terminal, na parte raiz do projeto, suba os containers `docker-compose.yml`:

```bash
docker-compose up -d
```

Verificar se os containers estão rodando:

```bash
docker ps
```

E deve mostrar algo assim:

```text
CONTAINER ID   IMAGE             COMMAND                  CREATED         STATUS         PORTS                                             NAMES
xxxxxxxxxxxx   postgres:latest   "docker-entrypoint.s…"   x seconds ago   Up x seconds   0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp       postgres_api_biblioteca
xxxxxxxxxxxx   mongo:latest      "docker-entrypoint.s…"   x seconds ago   Up x seconds   0.0.0.0:27017->27017/tcp, [::]:27017->27017/tcp   mongodb_api_biblioteca
```

### Desenvolvimento

```bash
npm install
npm run start:dev
```

### Modo watch (hot reload)

```bash
npm run start:watch
```

### Configuração do Prisma (PostgreSQL)

Para testar a sincronização com o Banco de Dados Postgres:

```bash
npx prisma db push
```

Após testar a sincronização, gere o cliente do Prisma e aplique as migrações no PostgreSQL:

```bash
npx prisma generate
npx prisma migrate dev
```

### Build e produção

```bash
npm run dist
npm run start:dist
```

---

## 📖 Documentação da API

**Localmente:**

```text
http://localhost:3000/docs
```

---

## 🌐 Deploy

A API está disponível em produção:

- **API / Documentação (Scalar):** [https://api-biblioteca.onrender.com/docs](https://api-biblioteca.onrender.com/docs)
- **Hospedagem:** [Render](https://render.com) (Web Service)
- **Banco relacional:** PostgreSQL gerenciado pelo Render
- **Banco não-relacional:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free Tier M0)

> ⚠️ **Nota:** por estar no plano gratuito do Render, a instância pode "dormir" após um período de inatividade. A primeira requisição após esse período pode levar alguns segundos a mais para responder (cold start).

---

## 📦 Documentação das Dependências (NPM)

| Pacote | Descrição | Link | Ambiente |
|---|---|---|---|
| TypeScript | Tipagem estática para JavaScript | [npmjs.com/package/typescript](https://www.npmjs.com/package/typescript) | Desenvolvimento |
| Express | Framework HTTP para Node.js | [npmjs.com/package/express](https://www.npmjs.com/package/express) | Produção |
| Mongoose | ODM para MongoDB | [npmjs.com/package/mongoose](https://www.npmjs.com/package/mongoose) | Produção |
| @scalar/express-api-reference | Documentação interativa da API (OpenAPI) | [npmjs.com/package/@scalar/express-api-reference](https://www.npmjs.com/package/@scalar/express-api-reference) | Produção |
| Prisma (CLI) | ORM para banco de dados relacional | [npmjs.com/package/prisma](https://www.npmjs.com/package/prisma) | Produção |
| @prisma/client | Client gerado pelo Prisma | [npmjs.com/package/@prisma/client](https://www.npmjs.com/package/@prisma/client) | Produção |
| dotenv | Carrega variáveis de ambiente do arquivo .env | [npmjs.com/package/dotenv](https://www.npmjs.com/package/dotenv) | Produção |
| @types/node | Tipagens do Node.js para TypeScript | [npmjs.com/package/@types/node](https://www.npmjs.com/package/@types/node) | Desenvolvimento |
| @types/express | Tipagens do Express para TypeScript | [npmjs.com/package/@types/express](https://www.npmjs.com/package/@types/express) | Desenvolvimento |
| Zod | Validação de dados schema-first | [npmjs.com/package/zod](https://www.npmjs.com/package/zod) | Produção |
| ESLint | Identificação e correção de erros de código | [npmjs.com/package/eslint](https://www.npmjs.com/package/eslint) | Desenvolvimento |
| Prettier | Formatador de código opinativo | [npmjs.com/package/prettier](https://www.npmjs.com/package/prettier) | Desenvolvimento |
| tsx | Executor TypeScript (dev/watch) | [npmjs.com/package/tsx](https://www.npmjs.com/package/tsx) | Desenvolvimento |
| tsup | Bundler para build de produção | [npmjs.com/package/tsup](https://www.npmjs.com/package/tsup) | Desenvolvimento |

> **Node.js**, **MongoDB**, **PostgreSQL**, **Docker**, **Render** e **MongoDB Atlas** não são pacotes **NPM**. Documentação oficial:
> - Node.js: [nodejs.org](https://nodejs.org)
> - MongoDB: [mongodb.com](https://www.mongodb.com)
> - PostgreSQL: [postgresql.org](https://www.postgresql.org)
> - Docker: [docker.com](https://www.docker.com/)
> - Render: [render.com](https://render.com)
> - MongoDB Atlas: [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

---

## 📄 Licença

Este projeto está sob a licença [ISC](./LICENSE).