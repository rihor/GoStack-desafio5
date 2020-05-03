/* eslint no-restricted-syntax: "off" */
/* eslint no-await-in-loop: "off" */

import csvParse from 'csv-parse';
import fileSystem from 'fs';

import Transaction, { TransactionTypeEnum } from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface TransactionRequest {
  title: string;
  type: string;
  value: string;
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const fileReadStream = fileSystem.createReadStream(filePath);

    const csvParser = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = fileReadStream.pipe(csvParser);
    const createTransaction = new CreateTransactionService();
    const transactionsToCreate: TransactionRequest[] = [];
    const transactions: Transaction[] = [];

    parseCSV.on('data', async (line: string[]) => {
      const [title, type, value, category] = line.map(cell => cell.trim());

      transactionsToCreate.push({ title, type, value, category });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    for (const { title, category, type, value } of transactionsToCreate) {
      transactions.push(
        await createTransaction.execute({
          title,
          type: type as TransactionTypeEnum,
          value: Number(value),
          categoryTitle: category,
        }),
      );
    }

    await fileSystem.promises.unlink(filePath);
    return transactions;
  }
}

export default ImportTransactionsService;
