import mongoose from 'mongoose';
import { TransactionSchema } from './Transaction.js';

const AccountSchema = new mongoose.Schema(
  {
    balance: { type: Number, required: true },
    trasactions: { type: [TransactionSchema] },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Account', AccountSchema);
