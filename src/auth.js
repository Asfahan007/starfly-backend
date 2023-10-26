const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('./models/userModel');


// Registration
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, age, hobbies } = req.body;

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must have at least 6 characters' });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User with the same username or email already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ username, password: hashedPassword, email, age, hobbies });
    await newUser.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Authentication failed - User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    console.log("password", passwordMatch, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Authentication failed - Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    user.tokens = [{ token }];
    await user.save();

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("decoded", decoded)

    const user = await User.findOne({ _id: decoded.userId, 'tokens.token': token });

    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const userAge = user.age;

    const usersWithSameAge = await User.find(
      { age: userAge, _id: { $ne: user._id } },
      { tokens: 0, __v: 0 }
    );

    res.status(200).json(usersWithSameAge);
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
});


module.exports = router;
