import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(transactionId: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionsRepository.findOne({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new AppError('This transaction does not exist.');
    }

    await transactionsRepository.delete(transactionId);
  }
}

export default DeleteTransactionService;
