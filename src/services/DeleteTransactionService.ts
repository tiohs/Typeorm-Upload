// import AppError from '../errors/AppError';

import { getCustomRepository } from "typeorm";
import AppError from "../errors/AppError";
import TransactionsRepository from "../repositories/TransactionsRepository";

interface IRequest {
  id: string
}
class DeleteTransactionService {
  public async execute({ id } : IRequest): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionRepository.findOne(id);

    if(!transaction) {
      throw new AppError('Transaction does not exist');
    }

    await transactionRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
