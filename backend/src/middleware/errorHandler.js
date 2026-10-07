import { errorResponse } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  console.error('[Error]:', err);

  if (err.name === 'ValidationError') {
    return errorResponse(res, err.message, 400);
  }

  // Prisma unique constraint or not found
  if (err.code === 'P2025') {
    return errorResponse(res, 'Record not found', 404);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return errorResponse(res, message, statusCode);
};
