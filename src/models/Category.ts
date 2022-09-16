import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  budgeted: { type: Number, required: true },
  available: { type: Number, required: true },
});

export default mongoose.model('Category', CategorySchema);
