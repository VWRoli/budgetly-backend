import mongoose from 'mongoose';
import { transactionType } from '../Types/transactionType';

export const TransactionSchema = new mongoose.Schema<transactionType>(
  {
    payee: {
      type: String,
      required: true,
      trim: true,
    },
    outflow: {
      type: Number,
    },
    inflow: {
      type: Number,
    },
    date: {
      type: String,
      required: true,
    },
    categoryTitle: {
      type: String,
      required: true,
    },
    budgetItemTitle: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Account',
    },
    budgetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Budget',
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Transaction', TransactionSchema);
