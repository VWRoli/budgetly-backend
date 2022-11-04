import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema(
  {
    payee: {
      type: String,
      required: true,
      trim: true,
    },
    outcome: {
      type: Number,
    },
    income: {
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
