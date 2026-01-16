# 📘 Donna — Assistente Inteligente de Produtividade

Donna é um backend moderno, escalável e inteligente para gerenciamento de tarefas, lembretes, listas e automações.  
Construída com **NestJS**, **Prisma**, **PostgreSQL** e preparada para integrações com **WhatsApp** e **IA generativa**, Donna é a base de um assistente pessoal completo.

---

## 🪪 Identidade da Donna

A Donna não é apenas um sistema — ela é uma **assistente inteligente com personalidade, propósito e coerência**.  
Para garantir consistência em todas as interações, existe um documento dedicado à identidade da Donna, cobrindo:

- missão  
- visão  
- valores  
- tom de voz  
- diretrizes de comunicação  
- persona e estilo  
- princípios de UX conversacional  
- orientações para evolução da marca  

📄 **Documento completo:**  
👉 [docs/DONNA-IDENTIDADE.md](docs/DONNA-IDENTIDADE.md)

Esse documento serve como referência para:

- desenvolvedores  
- designers  
- redatores  
- colaboradores externos  
- integrações futuras (WhatsApp, IA, UX conversacional)

---

## 🧭 Diagramas do Sistema

Os diagramas completos do fluxo de Tasks, lembretes, categorias e arquitetura geral estão disponíveis em:

👉 [docs/DIAGRAMAS.md](docs/DIAGRAMAS.md)

---

## 🏗️ Arquitetura do Projeto

A arquitetura segue princípios de **Clean Architecture**, **Domain‑Driven Design (DDD)** e **modularização do NestJS**.

### Tecnologias principais
- **NestJS** — framework modular e opinado para Node.js  
- **Prisma ORM** — acesso ao banco de dados com tipagem forte  
- **PostgreSQL** — banco relacional robusto  
- **Jest** — testes unitários e E2E  
- **GitHub Actions** — CI/CD com testes automatizados  
- **Docker (futuro)** — containerização  

### Camadas
| Camada | Responsabilidade |
|-------|------------------|
| **Controllers** | Recebem requisições HTTP e chamam os serviços |
| **Services** | Contêm regras de negócio |
| **Repositories (Prisma)** | Acesso ao banco de dados |
| **Modules** | Agrupam funcionalidades por domínio |
| **Middlewares / Guards** | Autenticação, MFA, autorização |
| **Cron Jobs** | Lembretes automáticos |

---

## 📦 Módulos do Sistema

### 1. AuthModule
- Registro de usuários  
- Login com MFA  
- Validação de sessão  
- Recuperação de senha (planejado)

### 2. TasksModule
- CRUD de tarefas  
- Prioridade manual  
- Prioridade automática (IA)  
- Histórico de ações

### 3. TaskItemsModule
- Itens dentro de uma task  
- Marcar como concluído  
- Listagem e exclusão

### 4. RemindersModule
- Criação de lembretes  
- Cancelamento automático  
- Envio automático (cron jobs)

### 5. CategoriesModule
- Sugestão automática de categorias  
- Classificação inteligente

### 6. HistoryModule
- Registro de todas as ações do usuário  
- Auditoria completa

### 7. WhatsAppModule (planejado)
- Webhook  
- Parser de linguagem natural  
- Criação de tasks via WhatsApp  
- Envio de lembretes pelo WhatsApp  

### 8. PaymentsModule (planejado)
- Assinaturas  
- Planos  
- Limites de uso  
- Eventos de pagamento  

### 9. AiModule (planejado)
- Cohere Command‑Light  
- Interpretação de mensagens  
- Criação de tasks por linguagem natural  
- Sugestão de categorias  
- Sugestão de prioridade  
- Respostas naturais  
- Controle de custos  

---

## 🔄 Fluxo de Tasks

O fluxo completo de uma Task no sistema:

1. **Usuário cria uma Task**  
   - Pode incluir título, descrição, prioridade e categoria  
   - Categoria pode ser sugerida automaticamente  
   - Prioridade pode ser sugerida automaticamente  

2. **Sistema registra histórico da ação**

3. **Usuário adiciona itens (TaskItems)**  
   - Cada item pode ser concluído individualmente  

4. **Usuário cria lembretes**  
   - Lembretes são monitorados por cron jobs  
   - Se a task for concluída, lembretes são cancelados automaticamente  

5. **Usuário atualiza ou exclui a Task**

6. **Sistema registra todas as ações no histórico**

---

## ▶️ Como rodar o projeto

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Crie um arquivo `.env`:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/donna"
JWT_SECRET="sua_chave_aqui"
```

### 3. Rodar migrations
```bash
npx prisma migrate dev
```

### 4. Gerar Prisma Client
```bash
npx prisma generate
```

### 5. Iniciar o servidor
```bash
npm run start:dev
```

O servidor iniciará em:

```
http://localhost:3000
```

---

## 🧪 Como rodar os testes

### Testes unitários
```bash
npm run test
```

### Testes end‑to‑end (E2E)
```bash
npm run test:e2e
```

### Cobertura de testes
```bash
npm run test -- --coverage
```

---

## 🤝 Como contribuir

1. Faça um fork do repositório  
2. Crie uma branch para sua feature:
   ```bash
   git checkout -b feature/nome-da-feature
   ```
3. Faça commits claros e pequenos  
4. Garanta que os testes passam:
   ```bash
   npm run test
   npm run test:e2e
   ```
5. Abra um Pull Request descrevendo:
   - O que foi feito  
   - Por que foi feito  
   - Como testar  

---

## 🗺️ Roadmap

### ÉPICO 8 — WhatsApp
- Criar tasks via WhatsApp  
- Listas via WhatsApp  
- Lembretes via WhatsApp  
- Outbound messages  

### ÉPICO 10 — Pagamentos
- Assinaturas  
- Planos  
- Limites de uso  
- Eventos de pagamento  
- Bloqueio automático  

### ÉPICO 11 — IA
- Interpretação de mensagens  
- Criação de tasks por linguagem natural  
- Sugestão de categorias  
- Sugestão de prioridade  
- Respostas naturais  
- Controle de custos  

### ÉPICO 12 — WhatsApp (Infraestrutura)
- Webhook  
- Verificação  
- Parser  
- Vincular número do usuário  

### ÉPICO 13 — Automação
- Evolução dos lembretes  
- Fluxos inteligentes  
- Ações automáticas  

---

## 📄 Licença
Este projeto é distribuído sob a licença MIT.