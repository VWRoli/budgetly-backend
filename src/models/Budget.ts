import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema(
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