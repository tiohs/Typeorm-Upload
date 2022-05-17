import { getCustomRepository, getRepository, In } from 'typeorm';
import * as csvParse from 'csv-parse';
import fs from 'fs';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionRepository from '../repositories/TransactionsRepository';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}
class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoriesRepository = getRepository(Category);

    const contactsReadStream = fs.createReadStream(filePath );

    const parsers = csvParse.parse({
      from_line: 2,
    });

    const parseCSV = contactsReadStream.pipe(parsers);
    const transaction: CSVTransaction[] = [];
    const categories: string[] = [];

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );
      if (!title ||!type || !value ) {
        console.log(title);
        return;
      };
      categories.push(category);
      transaction.push({ title, type, value, category });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const existCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      }
    });

    const existentCategories = existCategories.map(
      (category: Category) => category.title,
    );

    const addCategoryTitle = categories.filter(
      category => !existentCategories.includes(category),
    ).filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategoryTitle.map(title => ({
        title
      })),
    );

    await categoriesRepository.save(newCategories);

    console.log(existCategories);
    console.log(categories);
    console.log(transaction);
  }
}

export default ImportTransactionsService;
