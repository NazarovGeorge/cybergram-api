const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
mongoose.set('useFindAndModify', false);

// import routes
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');

// app
const app = express();

// db
const start = async () => {
  try {
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    console.log('connected to db...');
  } catch (error) {
    console.log(error);
  }
};
start();

// middlewares
app.use(express.static('uploads'));
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);

const port = process.env.PORT || 8000;
app.listen(port);
