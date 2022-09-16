import mongoose from 'mongoose';

const BudgetItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    budget_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Budget',
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    budgeted: { type: Number, required: true },
    outflow: { type: Number, required: true },
    balance: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('BudgetItem', BudgetItemSchema);
