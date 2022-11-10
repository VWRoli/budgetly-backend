import mongoose from 'mongoose';
import { budgetType } from '../Types/budgetType.js';
import { AccountSchema } from './Account.js';

const BudgetSchema = new mongoose.Schema<budgetType>(
  {
    available: { type: Number, required: true },
    currency: { type: String, required: true },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    accounts: { type: [AccountSchema], required: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Budget', BudgetSchema);
