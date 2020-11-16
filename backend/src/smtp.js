const nodemailer = require('nodemailer');

const smtp = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASSWORD,
};

const transporter = nodemailer.createTransport({
  host: smtp.host,
  port: smtp.port,
  secure: false,
  auth: {
    user: smtp.user,
    pass: smtp.pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = { transporter, smtp };
