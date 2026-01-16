# 📊 Diagramas do Sistema Donna

Este documento reúne todos os diagramas oficiais do projeto Donna, incluindo:

- Fluxo de criação de tasks  
- Fluxo de itens  
- Fluxo de lembretes  
- Fluxo de categorias  
- Arquitetura geral do sistema  

Todos os diagramas estão em **Mermaid**, permitindo visualização direta no GitHub.

---

## 📝 1. Fluxo de Criação de Tasks

```mermaid
flowchart TD
    A[Usuário envia requisição POST /tasks] --> B[TasksController]
    B --> C[TasksService]
    C --> D[Valida dados]
    D --> E[CategoriesService - Sugestão automática]
    E --> F[Prisma - Cria Task no banco]
    F --> G[HistoryService - Registra ação]
    G --> H[Retorna Task criada]
```

---

## 🧩 2. Fluxo de Itens (TaskItems)

```mermaid
flowchart TD
    A[Usuário adiciona item à Task] --> B[TaskItemsController]
    B --> C[TaskItemsService]
    C --> D[Prisma - Cria Item]
    D --> E[HistoryService - Registra ação]

    F[Usuário marca item como concluído] --> G[TaskItemsService]
    G --> H[Prisma - Atualiza Item]
    H --> I[HistoryService - Registra conclusão]
```

---

## ⏰ 3. Fluxo de Lembretes

```mermaid
flowchart TD
    A[Usuário cria lembrete] --> B[RemindersController]
    B --> C[RemindersService]
    C --> D[Prisma - Salva lembrete]
    D --> E[HistoryService - Registra criação]

    subgraph CronJob
        F[Verifica lembretes pendentes]
        F --> G[Envia notificação]
        G --> H[Atualiza status do lembrete]
    end

    I[Task concluída] --> J[RemindersService - Cancela lembretes]
```

---

## 🏷️ 4. Fluxo de Categorias

```mermaid
flowchart TD
    A[Usuário cria Task] --> B[CategoriesService]
    B --> C{IA habilitada?}

    C -->|Sim| D[IA sugere categoria]
    C -->|Não| E[Regra manual sugere categoria]

    D --> F[Retorna categoria sugerida]
    E --> F
```

---

## 🏗️ 5. Arquitetura Geral do Sistema

```mermaid
flowchart LR
    subgraph API
        A[AuthModule]
        B[TasksModule]
        C[TaskItemsModule]
        D[RemindersModule]
        E[CategoriesModule]
        F[HistoryModule]
    end

    subgraph Infra
        G[(PostgreSQL)]
        H[Prisma ORM]
        I[Cron Jobs]
    end

    subgraph Futuro
        J[WhatsApp Integration]
        K[AI Module - Cohere]
        L[Payments & Subscriptions]
    end

    A --> H
    B --> H
    C --> H
    D --> H
    E --> H
    F --> H

    H --> G

    D --> I
    J --> B
    K --> E
    L --> A
```

---

## 📌 Observações

- Todos os fluxos representam o comportamento atual do backend.  
- Módulos futuros já estão mapeados para facilitar evolução.  
- Diagramas podem ser atualizados conforme novas US forem concluídas.