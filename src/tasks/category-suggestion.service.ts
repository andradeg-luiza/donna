import { Injectable } from '@nestjs/common';

export enum TaskCategory {
  Compras = 'Compras',
  Trabalho = 'Trabalho',
  Estudos = 'Estudos',
  Saúde = 'Saúde',
  Financeiro = 'Financeiro',
  Casa = 'Casa',
  Pessoal = 'Pessoal',
  Outros = 'Outros',
}

@Injectable()
export class CategorySuggestionService {
  suggestCategory(text: string): TaskCategory {
    const normalized = text.toLowerCase();

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
      return TaskCategory.Saúde;
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
