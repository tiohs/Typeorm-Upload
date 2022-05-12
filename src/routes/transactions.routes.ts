import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const transaction = await transactionRepository.find();
  const balance = await transactionRepository.getBalance();

  return response.json({transaction, balance});
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category
  });
  return response.json(transaction);
});

// transactionsRouter.delete('/:id', async (request, response) => {
//   TODO
// });

// transactionsRouter.post('/import', async (request, response) => {
//   TODO
// });

export default transactionsRouter;
