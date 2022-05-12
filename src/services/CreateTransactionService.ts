// import AppError from '../errors/AppError';
import { response } from 'express';
import { getCustomRepository  } from 'typeorm';
import Transaction from '../models/Transaction';
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
    const transaction = transactionsRepository.create({
        title, value, type
    })

    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
