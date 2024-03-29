import AppError from '../errors/AppError';
import { getCustomRepository, getRepository  } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionRepository from '../repositories/TransactionsRepository';
interface IRequest {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}
class CreateTransactionService {
  public async execute({ title, value, type, category} : IRequest ): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    if(type == 'outcome' && total < value) {
      throw new AppError('You do not have enough balance');
    }
    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: category
      },
    });
    if(!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category
      });

      await categoryRepository.save(transactionCategory);
    }

    const transaction = transactionsRepository.create({
        title, value, type, category: transactionCategory
    });

    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
