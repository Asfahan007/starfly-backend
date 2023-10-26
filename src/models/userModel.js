const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
  },
  hobbies: {
    type: [String],
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});


const User = mongoose.model('User', userSchema);

module.exports = User;
