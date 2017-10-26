import express from 'express';
import passport from 'passport';
import User from '../models/user.model';
import RefreshToken from '../models/refreshToken.model';
import Group from '../models/group.model';
import expressJwt from 'express-jwt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
const router = express.Router();

const serializeUserAndGenerateTokens = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.user.email }).populate(
      'groups'
    );
    if (user) {
      req.user = {
        id: req.user._id,
        email: req.user.email,
        groups: user.groups
      };

      let refreshToken = new RefreshToken();
      refreshToken.refreshToken = crypto.randomBytes(40).toString('hex');
      refreshToken.uid = req.user.id;
      user.refreshTokens.push(refreshToken._id);

      await refreshToken.save();
      await refreshToken.save();

      req.refreshToken = refreshToken.refreshToken;
      req.accessToken = jwtTokenGenerator(req.user);
      next();
    } else {
      res.status(400).json({ message: 'User not found!' });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

const destroyToken = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    res.status(200).json({ message: 'success' });
  } else {
    try {
      const refreshTokenItem = await RefreshToken.findOne({
        refreshToken: refreshToken
      });
      refreshTokenItem.remove();
      res.status(200).json({ message: 'success' });
    } catch (err) {
      res.status(401).json(err);
    }
  }
};

const jwtTokenGenerator = payload => {
  return jwt.sign(payload, process.env.JWT_AUTH_SECRET, {
    // expiresIn: '2h'
  });
};

const generateNewToken = async (req, res, next) => {
  try {
    const refreshToken = await RefreshToken.findOne({
      refreshToken: req.body.refreshToken
    })
      .populate('uid', '_id email groups')
      .populate('group');

    const user = {
      id: refreshToken.uid._id,
      email: refreshToken.uid.email
    };

    user.groups = await Group.find({ _id: { $in: refreshToken.uid.groups } });
    res.status(200).json({ accessToken: jwtTokenGenerator(user) });
  } catch (err) {
    res.status(401).json(err);
  }
};

router.post('/device-logout', destroyToken);
router.post('/renew-token', generateNewToken);
router.post(
  '/device-login',
  passport.authenticate('custom', {
    session: false,
    failWithError: true
  }),
  serializeUserAndGenerateTokens,
  (req, res, next) => {
    console.log('received form request...');
    res.status(200).json({
      user: {
        ...req.user,
        accessToken: req.accessToken,
        refreshToken: req.refreshToken
      }
    });
  }
);

router.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

router.get('/login', (req, res) => {
  res.render('login', { user: req.user, error: req.flash('error') });
});

router.get('/logout', (req, res, next) => {
  req.logout();
  req.session.save(err => {
    if (err) {
      return next(err);
    }
    res.redirect('/auth/login');
  });
});

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect:
      process.env.ENVIRONMENT === 'production'
        ? '/auth/login'
        : 'http://localhost:3000/login.html',
    failureFlash: true
  }),
  (req, res, next) => {
    console.log('redirecting...');
    req.session.save(err => {
      if (err) {
        return next(err);
      }
      res.redirect(
        process.env.ENVIRONMENT === 'production'
          ? process.env.APP_URL
          : 'http://localhost:3000/'
      );
    });
  }
);

export default router;
