const User = require('../models/user');

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    [usernameCandidate, emailCandidate] = await Promise.all([
      User.findOne({ username }),
      User.findOne({ email }),
    ]);
    if (usernameCandidate || emailCandidate) {
      const validate = [];
      usernameCandidate ? (validate['username'] = 'Это имя уже занято') : false;
      emailCandidate ? (validate['email'] = 'Этот email уже занят') : false;
      res.status(400).json({
        signup: validate,
      });
    } else {
      const user = new User({ username, email });
      await user.setPassword(password);
      await user.save();
      res.status(201).json(await user.toAuthJSON());
    }
  } catch (error) {
    res.status(500).json({
      message: 'Что-то пошло не так...Попробуйте позднее',
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: username }, { username: username }],
    });
    if (user) {
      const match = await user.comparePassword(password);
      if (match) {
        res.status(200).json(await user.toAuthJSON());
      } else {
        res.status(400).json({
          login: 'Неправильный логин или пароль',
        });
      }
    } else {
      res.status(400).json({
        login: 'Неправильный логин или пароль',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Что-то пошло не так...',
    });
  }
};

exports.recieveAuth = async (req, res) => {
  try {
    const { username, email, _id, avatar } = req.currentUser;

    res.status(200).json({
      user: {
        username,
        id: _id,
        email,
        avatar,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Что-то пошло не так...',
    });
  }
};

exports.logout = async (req, res) => {
  try {
    req.currentUser.tokens = req.currentUser.tokens.filter(token => {
      return token.token !== req.currentToken;
    });
    await req.currentUser.save();
    res.status(200).json({
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error...',
    });
  }
};

exports.logoutAll = async (req, res) => {
  try {
    req.currentUser.tokens = [];
    await req.currentUser.save();
    res.status(200).json({
      message: 'Success',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error...',
    });
  }
};
