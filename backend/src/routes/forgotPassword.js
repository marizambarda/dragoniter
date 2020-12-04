const db = require('../db');
const express = require('express');
const { smtp, transporter } = require('../smtp');

const { generatePasswordRecoveryCode } = require('./functions');
const router = express.Router();
const bcrypt = require('bcrypt');

const { catchAsyncErrorsOnRouter } = require('express-async-await-errors');
catchAsyncErrorsOnRouter(router);

router.post('/forgot_password/request_code', async function (req, res) {
  const [users] = await db.query('SELECT * FROM users WHERE email = ?', [
    req.body.email
  ]);

  if (users.length === 0) {
    res.status(404).end();
    return;
  }

  const code = generatePasswordRecoveryCode(6);

  await transporter.sendMail({
    text: `Código de verificação: ${code}`,
    subject: 'Código de verificação',
    from: `Dragoniter <${smtp.user}>`,
    to: [req.body.email]
  });

  await db.query('UPDATE users SET forgot_password_code = ? WHERE email = ?', [
    code,
    req.body.email
  ]);

  res.status(204).end();
});

router.post('/forgot_password/verify_code', async function (req, res) {
  const [
    users
  ] = await db.query(
    'SELECT * FROM users WHERE email = ? AND forgot_password_code = ? AND  forgot_password_code IS NOT NULL',
    [req.body.email, req.body.forgot_password_code]
  );

  if (users.length > 0) {
    res.status(204).end();
    return;
  }

  res.status(404).end();
});

router.post('/forgot_password/reset_password', async function (req, res) {
  const [
    users
  ] = await db.query(
    'SELECT * FROM users WHERE email = ? AND forgot_password_code = ? AND  forgot_password_code IS NOT NULL',
    [req.body.email, req.body.forgot_password_code]
  );

  if (users.length === 0) {
    res.status(404).end();
    return;
  }

  if (req.body.password.length > 40) {
    res.status(400);
    res.json({ error: 'Senha muito grande, use no máximo 40 caracteres!' });
    return;
  }

  if (req.body.password.length < 6) {
    res.status(400);
    res.json({ error: 'Senha muito pequena, use no mínimo 6 caracteres!' });
    return;
  }

  const passwordHash = await bcrypt.hash(req.body.password, 10);

  await db.query(
    'UPDATE users SET password = ?, forgot_password_code = NULL WHERE id = ?',
    [passwordHash, users[0].id]
  );

  res.json(users[0]);
});

module.exports = router;
