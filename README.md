# Gerenciador de Estoque de Laboratório

Sistema para controle de substâncias, vidrarias e equipamentos de laboratório escolar. Professores cadastram e gerenciam o estoque; alunos e outros usuários consultam o que está disponível.

## Visão Geral

| Role | O que pode fazer |
|------|-----------------|
| **Técnico** | Gerenciar usuários, categorias, aprovar ordens de serviço, receber devoluções |
| **Professor** | Cadastrar/editar substâncias, solicitar alocações, concluir uso |
| **Aluno** | Visualizar catálogo (somente leitura) |

## Fluxo de Alocação

```
Professor solicita OS → Técnico aprova → Professor conclui uso → Técnico recebe devolução
```

## Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend | Java 21 + Spring Boot 3 + Spring Security (JWT) |
| Banco | PostgreSQL (Docker) |
| Mobile | React Native (Expo) |
| Frontend Web | Next.js 15 |

## Estrutura

```
projeto-gerenciador-estoque/
├── backend/        # API REST Spring Boot
├── frontend/       # Painel web (Next.js) — técnico/professor
└── mobile/         # App mobile (React Native) — consulta + OS
```

## Como Rodar

### 1. Banco de Dados

```bash
cd backend
docker-compose up -d
```

### 2. Backend

```bash
cd backend
./mvnw.cmd spring-boot:run   # Windows
./mvnw spring-boot:run       # Linux/Mac
```

API disponível em `http://localhost:8080`

### 3. Frontend Web

```bash
cd frontend
npm install
npm run dev
```

App disponível em `http://localhost:3000`

### 4. Mobile

```bash
cd mobile
npm install
npx expo start
```

## Endpoints Principais

| Método | Rota | Role | Descrição |
|--------|------|------|-----------|
| GET | `/api/produtos` | TECNICO, PROFESSOR, ALUNO | Lista produtos disponíveis |
| POST | `/api/produtos` | PROFESSOR | Cadastra produto |
| GET | `/api/produtos/vencendo` | TECNICO, PROFESSOR | Produtos perto do vencimento |
| GET | `/api/produtos/estoque-baixo` | TECNICO, PROFESSOR | Produtos abaixo do mínimo |
| POST | `/api/ordens-servico/alocar` | PROFESSOR | Solicita alocação |
| PUT | `/api/ordens-servico/aprovar/{id}` | TECNICO | Aprova OS |

## Variáveis de Ambiente

Configuradas em `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/estoque
spring.datasource.username=postgres
spring.datasource.password=postgres
```

## Usuários Padrão (seed)

Criados automaticamente pelo `DataInitializer` na primeira execução:

| Email | Senha | Role |
|-------|-------|------|
| `tecnico@etec.com` | `123456` | TECNICO |
| `professor@etec.com` | `123456` | PROFESSOR |
