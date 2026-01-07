# Donna — Assistente Pessoal Inteligente via WhatsApp

Donna é um assistente pessoal conversacional que funciona pelo WhatsApp, focado em:

* 📅 **Agenda e compromissos**
* ⏰ **Lembretes inteligentes**
* 📝 **Tarefas**
* 🛒 **Listas** (compras, afazeres, etc.)
* 💬 **Conversa em linguagem natural**
* 🧠 **Memória contextual por usuário**

O objetivo é ajudar pessoas a organizarem sua vida pessoal de forma simples, natural e contínua, usando o canal que elas já usam todos os dias: **WhatsApp**.

---

## 1. Visão Geral do Produto

* **Público-alvo inicial:** Uso pessoal (organização da vida individual).
* **Futuro:** Evolução para uso profissional (times, squads, empresas).

### Principais Capacidades

* **Entender mensagens em linguagem natural:** (Ex: “me lembra de pagar o cartão amanhã às 10h”).
* **Identificar intenção:** Criar lembrete, compromisso, tarefa, atualizar lista, etc.
* **Extrair entidades:** Data, hora, título, prioridade, recorrência.
* **Executar ações seguras:** Apenas após validação das regras de negócio.
* **Responder de forma amigável:** Comunicação clara e natural.
* **Manter memória contextual:** Entender referências como “depois”, “amanhã”, “isso”, “aquele compromisso”.

---

## 2. Arquitetura

### 2.1. Estilo Arquitetural

* **Clean Architecture**
* **Arquitetura Modular**
* **Separação de Preocupações:** Presentation, Application, Domain e Infrastructure.

### 2.2. Camadas

| Camada | Responsabilidades |
| --- | --- |
| **Presentation** | Webhooks WhatsApp API, Controllers, Adaptadores de canal e DTOs. |
| **Application** | Casos de Uso (CRUDs, consultas), Orquestração de fluxos e Validação. |
| **Domain** | Entidades (User, Task, etc), Value Objects e Interfaces (Contratos). |
| **Infrastructure** | PostgreSQL, OpenAI API (LLM), Persistência e Logs. |

---

## 3. Stack Tecnológica

### Backend

* **Node.js + TypeScript**
* **Framework:** **NestJS**
* *Motivos:* Arquitetura modular nativa, injeção de dependência e ecossistema maduro.



### IA / NLP

* **OpenAI API (LLM):** Prompt engineering estruturado.
* **Pipelines:** Classificação de intenção, extração de entidades e memória contextual.

### WhatsApp

* **WhatsApp Business Cloud API (Meta):** Webhooks e envio de mensagens estruturadas.

### Persistência & Infra

* **Banco de Dados:** PostgreSQL (Prisma ou TypeORM).
* **Infraestrutura:** Docker e deploy via Railway.
* **Qualidade:** Testes unitários, integração e testes de fluxo conversacional (E2E).

---

## 4. Modelo de Dados (Visão Conceitual)

### Entidades Principais

* **User:** `id`, `whatsapp_id`, `name`, `timestamps`.
* **Appointment:** `user_id`, `title`, `description`, `start_datetime`, `end_datetime`, `recurrence`.
* **Reminder:** `user_id`, `title`, `remind_at`, `recurrence`.
* **Task:** `user_id`, `title`, `priority`, `due_datetime`, `status`.
* **List / ListItem:** `name`, `type`, `description`, `quantity`, `checked`.

> **Nota:** Toda mensagem recebida é vinculada a um `user_id` através do `whatsapp_id`. A memória contextual pode ser armazenada em uma tabela dedicada ou campo `JSONB` no usuário.

---

## 5. Fluxo: Mensagem → Intenção → Ação → Resposta

1. **Entrada:** Mensagem chega via Webhook (Presentation).
2. **Normalização:** Extração do texto e metadados do usuário.
3. **Identificação:** Localização do `User` no banco de dados.
4. **Interpretação (NLP):** OpenAI analisa o texto e retorna **intenção** e **entidades** (A IA sugere, não executa).
5. **Execução (Application):** O Caso de Uso (ex: `CreateReminderUseCase`) valida e persiste os dados.
6. **Resposta:** Geração de confirmação (estática ou via LLM) enviada ao WhatsApp.
7. **Contexto:** Atualização do histórico de conversação do usuário.

---

## 6. Organização de Pastas (Proposta Inicial)

```text
/donna
  /src
    /presentation      # Controllers e DTOs WhatsApp
    /application       # Use cases (regras de aplicação)
    /domain            # Entidades, Value Objects e Interfaces
    /infrastructure    # Implementações (DB, OpenAI, WhatsApp API)
    /config            # Variáveis e Módulos NestJS
  /test                # Unitários, Integração e Conversação

```

---

## 7. Como rodar o projeto (Visão Inicial)

### Pré-requisitos

* Node.js LTS & Docker
* API Keys: WhatsApp Business Cloud & OpenAI

### Passos Gerais

1. Clonar o repositório.
2. Configurar o arquivo `.env` (Tokens e Database URL).
3. Subir o banco via Docker: `docker-compose up -d`.
4. Rodar migrações e iniciar o servidor: `npm run start:dev`.
5. Configurar o webhook no painel da Meta.

---

## 8. Git e Versionamento

* **Branches:** `main` (estável), `develop` (desenvolvimento), `feature/*`, `fix/*`.
* **Fluxo:** Pull Requests para `develop` -> Homologação -> Merge em `main`.

---

## 9. Roadmap Macro

1. **Fase 0:** Descoberta e Requisitos ✅
2. **Fase 1:** Arquitetura Base
3. **Fase 2:** Integração WhatsApp
4. **Fase 3:** IA e NLP (OpenAI)
5. **Fase 4:** Domínio e Regras de Negócio
6. **Fase 5:** Persistência
7. **Fase 6:** Fluxos Conversacionais Complexos
8. **Fase 7:** Qualidade e Testes
9. **Fase 8:** Deploy e Evolução

---
