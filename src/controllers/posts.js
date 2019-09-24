const Post = require('../models/post');
const path = require('path');

exports.create = async (req, res) => {
  try {
    const photo = req.files.photo;
    await photo.mv(path.join(__dirname, '../../uploads/') + photo.name);
    const post = new Post({
      caption: req.body.caption,
      photo: photo.name,
      owner: req.currentUser._id,
    });
    await post.save();
    res.status(201).json({
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Что-то пошло не так...',
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Что-то пошло не так...',
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) {
      res.status(404).json({
        message: 'Пост не найден',
      });
    }
    res.status(200).json({
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Что-то пошло не так...',
    });
  }
};

exports.changeById = async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      owner: req.currentUser._id,
    });
    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Пост не найден',
      });
    }
    post.caption = req.body.caption;
    await post.save();
    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Что-то пошло не так...',
    });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      owner: req.currentUser._id,
    });
    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Пост не найден',
      });
    }
    res.status(200).json({
      success: true,
      post: {},
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Что-то пошло не так...',
    });
  }
};
