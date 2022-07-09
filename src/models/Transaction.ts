import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema(
  {
    payee: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    categoryTitle: {
      type: String,
      //todo required: true,
    },
    budgetItemTitle: {
      type: String,
      //todo required: true,
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
