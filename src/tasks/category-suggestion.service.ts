import { Injectable } from '@nestjs/common';
import { TaskCategory } from '@prisma/client';

@Injectable()
export class CategorySuggestionService {
  async suggestCategory(title: string): Promise<TaskCategory> {
    const normalized = title.toLowerCase();

    if (normalized.match(/comprar|mercado|lista|supermercado|compra/)) {
      return TaskCategory.Compras;
    }

    if (normalized.match(/trabalho|reunião|projeto|cliente|entrega/)) {
      return TaskCategory.Trabalho;
    }

    if (normalized.match(/estudar|prova|curso|aula|faculdade/)) {
      return TaskCategory.Estudos;
    }

    if (normalized.match(/médico|consulta|remédio|saúde|exame/)) {
      return TaskCategory.Saude;
    }

    if (normalized.match(/pagar|conta|boleto|fatura|dinheiro/)) {
      return TaskCategory.Financeiro;
    }

    if (normalized.match(/casa|faxina|limpar|arrumar|organizar/)) {
      return TaskCategory.Casa;
    }

    if (normalized.match(/aniversário|viagem|pessoal|lazer|família/)) {
      return TaskCategory.Pessoal;
    }

    return TaskCategory.Outros;
  }
}
