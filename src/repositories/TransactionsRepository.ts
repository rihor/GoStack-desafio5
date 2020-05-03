import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const balance: Balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    transactions.forEach(transaction => {
      switch (transaction.type) {
        case 'income':
          balance.income += transaction.value;
          break;
        case 'outcome':
          balance.outcome += transaction.value;
          break;
        default:
          break;
      }
    });

    balance.total = balance.income - balance.outcome;

    return balance;
  }
}

export default TransactionsRepository;
