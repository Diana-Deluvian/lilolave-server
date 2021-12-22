const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 8080;
const cors = require('cors');
const generatePassword = require('./passport/utils').generatePassword;
const issueJWT = require('./passport/utils').issueJWT;
const bcrypt = require('bcrypt');

const passport = require('passport');
require('./passport/passport')(passport);

app.use(passport.initialize());

app.use(express.json()); //Used to parse JSON bodies

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://192.168.1.234:3000',
      'https://lilolave.netlify.app',
      'http://90.231.157.5',
    ],
    credentials: true,
  })
);

const mongoose = require('mongoose');
mongoose.connect(
  'mongodb+srv://' +
    process.env.DB_USERNAME +
    ':' +
    process.env.DB_PASSWORD +
    '@personal-data.telw9.mongodb.net/lilolave?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
  }
);

const connection = mongoose.connection;

connection.once('open', function () {
  console.log('Connection with MongoDB was successful');
});

const Post = require('./Post');
const User = require('./User');

app.get('/posts', (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) return handleError(err);
    res.send(posts);
  });
});

app.post(
  '/post',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.create(req.body, function (err, post) {
      if (err) return handleError(err);
      console.log(post);
      res.send(post);
    });
  }
);

app.put(
  '/post/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Recipe.findOneAndUpdate({ _id: req.params.id }, req.body, {
      returnDocument: 'after',
    })
      .then((result) => res.send(result))
      .catch((err) => handleError(err));
  }
);

app.delete(
  '/post/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Recipe.deleteOne({ _id: req.params.id })
      .then((result) => res.send(result))
      .catch((err) => handleError(err));
  }
);

app.post('/login', async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user)
    return res.status(401).json({ success: false, msg: 'user not found' });
  bcrypt.compare(
    req.body.password + process.env.PEPPER,
    user.hashedPassword,
    (err, result) => {
      if (err) handleError(err);

      if (result === true) {
        const tokenObject = issueJWT(user);
        res.status(200).json({
          success: true,
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
        });
      } else {
        res
          .status(401)
          .json({ success: false, msg: 'YOUR CREDENTIALS ARE REJECTED.' });
      }
    }
  );
});

/*
app.post('/register', async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username });
  if (user)
    return res
      .status(401)
      .json({ success: false, msg: 'username already exists' });

  const hashedPassword = await generatePassword(req.body.password);
  User.create(
    { username: req.body.username, hashedPassword },
    function (err, user) {
      if (err) return handleError(err);
      res.status(200).json({ success: true, msg: 'Welcome aboard!' });
    }
  );
});
*/
//website is meant just for me, no point in letting others register

const handleError = (err) => {
  console.log(err);
};

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
