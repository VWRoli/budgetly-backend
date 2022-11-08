import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userType } from '../Types/userType';

const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema<userType>({
  username: {
    type: String,
    required: [true, 'Username is required!'],
    unique: true,
    minLength: 6,
    maxlength: 16,
  },
  email: {
    type: String,
    required: [true, 'Email is required!'],
    unique: true,
    trim: true,
    lowercase: true,
    validate(value: string) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid!');
      }
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
    validate(value: string) {
      if (!validator.isStrongPassword(value)) {
        throw new Error('The password you provided is not strong enough!');
      }
    },
  },
  balance: { type: Number, required: true },
  budgeted: { type: Number, required: true },
  available: { type: Number, required: true },
  defaultBudget: {
    type: mongoose.Schema.Types.ObjectId,
  },
  tokens: [
    {
      token: { type: String, required: true },
    },
  ],
});

//Hash password before saving
UserSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, SALT_WORK_FACTOR);
  }
  next();
});

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const secret = process.env.JWT_SECRET;
  let token;

  if (secret) {
    token = jwt.sign({ username: user.username, id: user._id }, secret, {
      expiresIn: '30d',
    });
    user.tokens = user.tokens.concat({ token });
    await user.save();
  }
  return token;
};

//Remove password and other sensitive information from response
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

export default mongoose.model('User', UserSchema);
