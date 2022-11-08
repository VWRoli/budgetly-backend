import mongoose from 'mongoose';
import { budgetType } from '../Types/budgetType';

const BudgetSchema = new mongoose.Schema<budgetType>(
  {
    balance: { type: Number, required: true },
    currency: { type: String, required: true },
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

export default mongoose.model('Budget', BudgetSchema);
