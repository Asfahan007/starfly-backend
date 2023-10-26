const express = require('express');
const router = express.Router();
const Post = require('./models/postModel');
const User = require('./models/userModel');
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: decoded.userId, 'tokens.token': token });

    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    req.user = user; 
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new post
router.post('/addPost', authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = new Post({
      title,
      content,
      author: req.user._id, 
    });

    await post.save();

    res.status(200).json({ message: 'Post created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all posts
router.get('/getAllPosts', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username'); 

    res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/likePost/:postId', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const userId = req.user._id;

    const alreadyLiked = post.likes?.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
      post.likesCount -= 1;
      await post.save();

      res.status(200).json({ message: 'Post disliked successfully' });
    } else {
      post.likes?.push(userId);
      post.likesCount += 1;
      await post.save();

      res.status(200).json({ message: 'Post liked successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
