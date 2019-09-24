const User = require('../models/user');

exports.getBySearch = async (req, res) => {
  try {
    const users = await User.find({
      username: { $regex: `^${req.query.username}.*`, $options: 'i' },
    })
      .populate('followers', '_id username')
      .populate('following', '_id username')
      .select('_id username followersCount followingCount');
    res.status(200).json({
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Что-то пошло не так...',
    });
  }
};

exports.getByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username })
      .populate('following', '_id username')
      .populate('followers', '_id username');
    if (!user) {
      res.status(404).json({
        message: 'Пользователь не найден',
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Что-то пошло не так...',
    });
  }
};

exports.follow = async (req, res) => {
  try {
    const followUser = await User.findOne({
      $and: [
        {
          _id: { $ne: req.currentUser._id },
        },
        {
          _id: req.body.followId,
        },
        {
          followers: { $ne: req.currentUser._id },
        },
      ],
    });
    if (!followUser) {
      throw new Error();
    }
    if (followUser.private) {
      req.currentUser.followRequests.push(req.body.followId);
    } else {
      followUser.followers.push(req.currentUser._id);
      followUser.followersCount += 1;
      req.currentUser.following.push(req.body.followId);
      req.currentUser.followingCount += 1;
    }
    await Promise.all([req.currentUser.save(), followUser.save()]);
    res.status(200);
  } catch (error) {
    res.status(500).json({
      message: 'Error...',
    });
  }
};

exports.unfollow = async (req, res) => {
  try {
    const unfollowUser = await User.findOne({
      $and: [
        {
          _id: { $ne: req.currentUser._id },
        },
        {
          _id: req.body.unfollowId,
        },
        {
          followers: req.currentUser._id,
        },
      ],
    });
    if (!unfollowUser) {
      throw new Error();
    }
    const currentUserIdx = unfollowUser.followers.indexOf(req.currentUser._id);
    unfollowUser.followers.splice(currentUserIdx, 1);
    unfollowUser.followersCount -= 1;

    const unfollowUserIdx = req.currentUser.following.indexOf(
      req.body.unfollowId,
    );
    req.currentUser.following.splice(unfollowUserIdx, 1);
    req.currentUser.followingCount -= 1;

    await Promise.all([req.currentUser.save(), unfollowUser.save()]);

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error...',
    });
  }
};
