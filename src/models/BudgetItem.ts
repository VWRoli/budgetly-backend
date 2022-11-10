import mongoose from 'mongoose';
import { budgetItemType } from '../Types/budgetItemType';

export const BudgetItemSchema = new mongoose.Schema<budgetItemType>(
  {
    title: { type: String, required: true },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    budgetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Budget',
    },
    budgeted: { type: Number, required: true },
    balance: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);
//? cant export the model because then there is a typeerror with the exported schema above, probably have to create a model whereever i want to import it
export default mongoose.model('BudgetItem', BudgetItemSchema);
