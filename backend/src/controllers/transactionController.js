import prisma from '../prisma/client.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getTransactions = async (req, res, next) => {
  try {
    const { month, year, type, category } = req.query;
    const where = {};

    if (type) {
      where.type = type.toLowerCase();
    }

    if (category) {
      where.category = category;
    }

    if (year && month) {
      const parsedYear = parseInt(year, 10);
      const parsedMonth = parseInt(month, 10); // 1-12
      const startDate = new Date(Date.UTC(parsedYear, parsedMonth - 1, 1));
      const endDate = new Date(Date.UTC(parsedYear, parsedMonth, 0, 23, 59, 59, 999));
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    } else if (year) {
      const parsedYear = parseInt(year, 10);
      where.date = {
        gte: new Date(Date.UTC(parsedYear, 0, 1)),
        lte: new Date(Date.UTC(parsedYear, 11, 31, 23, 59, 59, 999)),
      };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: {
        date: 'desc',
      },
    });

    return successResponse(res, transactions);
  } catch (error) {
    next(error);
  }
};

export const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return errorResponse(res, 'Transaction not found', 404);
    }

    return successResponse(res, transaction);
  } catch (error) {
    next(error);
  }
};

export const createTransaction = async (req, res, next) => {
  try {
    const { type, amount, category, description, date } = req.body;

    if (!type || !['income', 'expense'].includes(type.toLowerCase())) {
      return errorResponse(res, 'Valid type (income or expense) is required', 400);
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return errorResponse(res, 'Amount must be a positive number', 400);
    }

    if (!category || typeof category !== 'string' || !category.trim()) {
      return errorResponse(res, 'Category is required', 400);
    }

    if (!date || isNaN(new Date(date).getTime())) {
      return errorResponse(res, 'Valid date is required', 400);
    }

    const transaction = await prisma.transaction.create({
      data: {
        type: type.toLowerCase(),
        amount: numAmount,
        category: category.trim(),
        description: description ? description.trim() : null,
        date: new Date(date),
      },
    });

    return successResponse(res, transaction, 201);
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, amount, category, description, date } = req.body;

    const dataToUpdate = {};

    if (type !== undefined) {
      if (!['income', 'expense'].includes(type.toLowerCase())) {
        return errorResponse(res, 'Valid type (income or expense) is required', 400);
      }
      dataToUpdate.type = type.toLowerCase();
    }

    if (amount !== undefined) {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return errorResponse(res, 'Amount must be a positive number', 400);
      }
      dataToUpdate.amount = numAmount;
    }

    if (category !== undefined) {
      if (typeof category !== 'string' || !category.trim()) {
        return errorResponse(res, 'Category must be a non-empty string', 400);
      }
      dataToUpdate.category = category.trim();
    }

    if (description !== undefined) {
      dataToUpdate.description = description ? description.trim() : null;
    }

    if (date !== undefined) {
      if (isNaN(new Date(date).getTime())) {
        return errorResponse(res, 'Valid date is required', 400);
      }
      dataToUpdate.date = new Date(date);
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: dataToUpdate,
    });

    return successResponse(res, transaction);
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.transaction.delete({
      where: { id },
    });

    return successResponse(res, { id, deleted: true });
  } catch (error) {
    next(error);
  }
};
