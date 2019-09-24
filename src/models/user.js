const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
      maxlength: 16,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: 32,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    private: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      required: false,
      default: null,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    following: [
      {
        type: ObjectId,
        ref: 'User',
      },
    ],
    followingCount: {
      type: Number,
      default: 0,
    },
    followers: [
      {
        type: ObjectId,
        ref: 'User',
      },
    ],
    followersCount: {
      type: Number,
      default: 0,
    },
    followRequests: [
      {
        type: ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true },
);

userSchema.methods.comparePassword = async function comparePassword(password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

userSchema.methods.setPassword = async function isValidPassord(password) {
  if (password) {
    this.password = await bcrypt.hash(password, 8);
  }
};

userSchema.methods.generateJWT = async function generateJWT() {
  const token = jwt.sign(
    { _id: this._id.toString(), email: this.email },
    process.env.JWT_SECRET,
  );
  this.tokens = this.tokens.concat({ token });

  await this.save();

  return token;
};

userSchema.methods.toAuthJSON = async function toAuthJSON() {
  const token = await this.generateJWT();
  return {
    user: {
      id: this._id,
      email: this.email,
      username: this.username,
      avatar: this.avatar,
    },
    token,
  };
};

module.exports = mongoose.model('User', userSchema);
