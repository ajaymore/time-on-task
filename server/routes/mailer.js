import express from 'express';
import xoauth2 from 'xoauth2';
import nodemailer from 'nodemailer';
const router = express.Router();

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  }
});

const promisFn = x => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ data: x });
    }, 1000);
  });
};

const fetchData = async query => {
  try {
    return await promisFn('Hello World!!');
  } catch (error) {
    return error;
  }
};

/* GET users listing. */
router.get(
  '/',
  require('connect-ensure-login').ensureLoggedIn('/auth/login'),
  async (req, res, next) => {
    let arr = ['react', 'angular', 'vue'];

    // Correct
    if (arr.includes('react')) {
      const data = await fetchData();
      // transporter.sendMail({
      // 	from: 'ajay.more15@apu.edu.in',
      // 	to: 'ajmore.biz@gmail.com',
      // 	subject: 'Message',
      // 	text: 'I hope this message gets through!',
      // 	auth: {
      // 		user: 'ajay.more15@apu.edu.in',
      // 		refreshToken: process.env.MAIL_CLIENT_REFRESH_TOKEN
      // 	}
      // });
      res.render('home', { title: 'Express' });
    } else {
      res.send('Does not work!!');
    }
  }
);

export default router;
