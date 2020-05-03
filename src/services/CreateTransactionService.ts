import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction, { TransactionTypeEnum } from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  title: string;
  value: number;
  type: TransactionTypeEnum;
  categoryTitle: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    categoryTitle,
  }: RequestDTO): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && balance.income < value) {
      throw new AppError('Could not make transaction! Insuficient reserves.');
    }

    let category = await categoriesRepository.findOne({
      where: { title: categoryTitle },
    });

    if (!category) {
      category = categoriesRepository.create({ title: categoryTitle });

      await categoriesRepository.save(category);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
