import passport from 'passport';
import moment from 'moment';
import User from '../models/user.model';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import CustomStrategy from 'passport-custom';
import fetch from 'node-fetch';
import casual from 'casual';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.APP_URL}/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({
          email: profile.emails[0].value
        }).populate('groups');
        if (user) {
          done(null, user);
        } else {
          let newUser = new User();
          newUser.email = profile.emails[0].value;
          // newUser.userName = user.name;
          // newUser.picture = user.picture;
          await newUser.save();
          done(null, newUser);
        }
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  new CustomStrategy(async (req, done) => {
    if (!req.body.accessToken) {
      done({ error: 'token not found!' });
    }
    try {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${req
          .body.accessToken}`
      );
      const user = await response.json();
      const savedUser = await User.findOne({
        email: user.email
      }).populate('groups');
      if (savedUser) {
        done(null, savedUser);
      } else {
        let newUser = new User();
        newUser.email = user.email;
        newUser.userName = user.name;
        newUser.picture = user.picture;
        await newUser.save();
        done(null, newUser);
      }
    } catch (err) {
      console.log(err);
      done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).populate('groups', 'id groupName');
    if (user) {
      done(null, {
        id: user._id,
        email: user.email,
        groups: user.groups,
        blocked: user.blocked
      });
    } else {
      done(true, null);
    }
  } catch (err) {
    done(err);
  }
});
