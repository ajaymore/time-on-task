const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get(
  '/',
  require('connect-ensure-login').ensureLoggedIn('/auth/login'),
  async (req, res, next) => {
    res.render('home', { title: 'Express' });
  }
);

module.exports = router;
