import mongoose from 'mongoose';
import { categoryType } from '../Types/categoryType.js';
import { BudgetItemSchema } from './BudgetItem.js';

const CategorySchema = new mongoose.Schema<categoryType>(
  {
    title: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    budgetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Budget',
    },
    budgeted: { type: Number, required: true },
    balance: { type: Number, required: true },
    budgetItems: { type: [BudgetItemSchema] },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Category', CategorySchema);
