import mongoose from 'mongoose';
import { BudgetItemSchema } from './BudgetItem.js';

const CategorySchema = new mongoose.Schema({
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
  available: { type: Number, required: true },
  budgetItems: { type: [BudgetItemSchema] },
});

export default mongoose.model('Category', CategorySchema);
