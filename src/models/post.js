const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema(
  {
    photo: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      trim: true,
      required: false,
      maxlength: 1500,
    },
    owner: {
      type: ObjectId,
      ref: 'User',
    },
    likes: [
      {
        type: ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        type: ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Post', postSchema);
