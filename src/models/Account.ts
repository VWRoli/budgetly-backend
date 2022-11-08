import mongoose from 'mongoose';
import { accountType } from '../Types/accountType.js';

export const AccountSchema = new mongoose.Schema<accountType>(
  {
    name: { type: String, required: true },
    balance: { type: Number, required: true },
    user_id: { type: String, required: true },
    budgetId: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Account', AccountSchema);
