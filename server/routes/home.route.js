const express = require('express');
const router = express.Router();
import expressJwt from 'express-jwt';
import User from '../models/user.model';

/* GET users listing. */
router.get(
  '/',
  require('connect-ensure-login').ensureLoggedIn('/auth/login'),
  async (req, res, next) => {
    res.render('home', { title: 'Express' });
  }
);

router.post(
  '/search-user',
  expressJwt({
    secret: process.env.JWT_AUTH_SECRET
  }),
  async (req, res, next) => {
    const search = req.body.search;
    try {
      const users = await User.find(
        {
          email: new RegExp(search, 'i')
        },
        'id email picture userName'
      );
      res.status(200).json(users);
    } catch (err) {
      res.status(200).json([]);
    }
  }
);

module.exports = router;
