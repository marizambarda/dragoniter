const db = require('../db');
const express = require('express');
const {
  validateEmail,
  validateNickname,
  generatePasswordRecoveryCode
} = require('./functions');
const router = express.Router();
const { uuid } = require('uuidv4');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const { catchAsyncErrorsOnRouter } = require('express-async-await-errors');
const {
  allowAuthentication,
  requireAuthentication
} = require('../middlewares');
catchAsyncErrorsOnRouter(router);

router.post('/users', async function (req, res) {
  if (req.body.name.length > 40) {
    res.status(400);
    res.json({ error: 'Nome muito grande, use no máximo 40 caracteres!' });
    return;
  }
  if (req.body.name.length < 2) {
    res.status(400);
    res.json({ error: 'Nome muito pequeno, use no minímo 2 caracteres!' });
    return;
  }
  if (!validateEmail(req.body.email)) {
    res.status(400);
    res.json({ error: 'Email inválido!' });
    return;
  }

  const [usersWithEmail] = await db.query(
    'SELECT * FROM users WHERE email = ?',
    [req.body.email]
  );
  if (usersWithEmail.length > 0) {
    res.status(400);
    res.json({ error: 'Este email já está em uso!' });
    return;
  }

  const [
    usersWithNickname
  ] = await db.query('SELECT * FROM users WHERE nickname = ?', [
    req.body.nickname
  ]);
  if (usersWithNickname.length > 0) {
    res.status(400);
    res.json({ error: 'Este nome de usuário já está em uso!' });
    return;
  }
  if (!validateNickname(req.body.nickname)) {
    res.status(400);
    res.json({
      error:
        'Nome de usuário inválido, utilize apenas letras (a-z ou A-Z), números e underline (_)'
    });
    return;
  }
  if (req.body.nickname.length < 5) {
    res.status(400);
    res.json({
      error: 'Nome de usuário muito pequeno, use no minímo 5 caracteres!'
    });
    return;
  }
  if (req.body.nickname.length > 15) {
    res.status(400);
    res.json({
      error: 'Nome de usuário muito grande, use no máximo 15 caracteres!'
    });
    return;
  }

  if (req.body.password === '') {
    res.status(400);
    res.json({ Error: 'Senha precisa ser preenchida!' });
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
  const [
    result
  ] = await db.query(
    'INSERT INTO users(name, email, nickname, password, access_token) VALUES (?, ?, ?, ?, ?)',
    [req.body.name, req.body.email, req.body.nickname, passwordHash, uuid()]
  );
  const [users] = await db.query('SELECT * FROM users WHERE id = ?', [
    result.insertId
  ]);
  res.json(users[0]);
});

router.get('/users/search', async function (req, res) {
  const [
    users
  ] = await db.query(
    'SELECT nickname, name, avatar_url FROM users WHERE nickname LIKE ? OR name LIKE ? ',
    [`%${req.query.term}%`, `%${req.query.term}%`]
  );
  res.json(users);
});

router.post('/users/login', async function (req, res) {
  const [users] = await db.query('SELECT * FROM users WHERE email = ?', [
    req.body.email
  ]);
  if (users.length === 1) {
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      users[0].password
    );
    if (isPasswordCorrect) {
      res.json(users[0]);
      return;
    }
  }
  res.status(401);
  res.json({ error: 'Email ou senha incorretos!' });
});

router.get('/me', requireAuthentication, async function (req, res) {
  res.json(req.user);
});

router.get('/users/:nickname', allowAuthentication, async function (req, res) {
  const [
    users
  ] = await db.query(
    'SELECT id, name, nickname, avatar_url, cover_url FROM users WHERE nickname = ?',
    [req.params.nickname]
  );
  if (users.length === 0) {
    res.status(404).end();
    return;
  }
  const user = users[0];

  const [
    followers
  ] = await db.query(
    'SELECT COUNT (*) AS count FROM followers WHERE following_id = ?',
    [user.id]
  );
  user.followers = followers[0].count;

  const [
    following
  ] = await db.query(
    'SELECT COUNT (*) AS count FROM followers WHERE follower_id = ?',
    [user.id]
  );
  user.following = following[0].count;

  if (req.user) {
    const [
      followedByMe
    ] = await db.query(
      'SELECT * FROM followers WHERE follower_id = ? AND following_id = ?',
      [req.user.id, user.id]
    );
    user.followedByMe = followedByMe.length > 0;
  }

  res.json(user);
});

router.put('/me', requireAuthentication, async function (req, res) {
  const fields = _.pick(req.body, [
    'name',
    'nickname',
    'email',
    'password',
    'avatar_url',
    'cover_url'
  ]);

  if (fields.name) {
    if (fields.name.length > 40) {
      res.status(400);
      res.json({ error: 'Nome muito grande, use no máximo 40 caracteres!' });
      return;
    }
    if (fields.name.length < 2) {
      res.status(400);
      res.json({ error: 'Nome muito pequeno, use no minímo 2 caracteres!' });
      return;
    }
  }

  if (fields.email) {
    if (!validateEmail(fields.email)) {
      res.status(400);
      res.json({ error: 'Email inválido!' });
      return;
    }

    const [
      usersWithEmail
    ] = await db.query('SELECT * FROM users WHERE email = ? AND id != ?', [
      fields.email,
      req.user.id
    ]);
    if (usersWithEmail.length > 0) {
      res.status(400);
      res.json({ error: 'Este email já está em uso!' });
      return;
    }
  }

  if (fields.nickname) {
    const [
      usersWithNickname
    ] = await db.query('SELECT * FROM users WHERE nickname = ? AND id != ?', [
      fields.nickname,
      req.user.id
    ]);
    if (usersWithNickname.length > 0) {
      res.status(400);
      res.json({ error: 'Este nome de usuário já está em uso!' });
      return;
    }
    if (!validateNickname(fields.nickname)) {
      res.status(400);
      res.json({
        error:
          'Nome de usuário inválido, utilize apenas letras (a-z ou A-Z), números e underline (_)'
      });
      return;
    }
    if (fields.nickname.length < 5) {
      res.status(400);
      res.json({
        error: 'Nome de usuário muito pequeno, use no minímo 5 caracteres!'
      });
      return;
    }
    if (fields.nickname.length > 15) {
      res.status(400);
      res.json({
        error: 'Nome de usuário muito grande, use no máximo 15 caracteres!'
      });
      return;
    }
  }
  if (fields.password) {
    if (fields.password.length > 40) {
      res.status(400);
      res.json({ error: 'Senha muito grande, use no máximo 40 caracteres!' });
      return;
    }
    if (fields.password.length < 6) {
      res.status(400);
      res.json({ error: 'Senha muito pequena, use no mínimo 6 caracteres!' });
      return;
    }
    fields.password = await bcrypt.hash(fields.password, 10);
  }

  await db.query('UPDATE users SET ? WHERE id = ?', [fields, req.user.id]);
  const [users] = await db.query('SELECT * FROM users WHERE id = ?', [
    req.user.id
  ]);
  res.json(users[0]);
});

router.post('/users/:nickname/follow', requireAuthentication, async function (
  req,
  res
) {
  const [users] = await db.query('SELECT id FROM users WHERE nickname = ?', [
    req.params.nickname
  ]);
  if (users.length === 0) {
    res.status(404).end();
    return;
  }
  const userToFollow = users[0];
  const [
    following
  ] = await db.query(
    'SELECT * FROM followers WHERE follower_id = ? AND following_id = ?',
    [req.user.id, userToFollow.id]
  );
  if (following.length === 0) {
    await db.query(
      'INSERT INTO followers(follower_id, following_id) VALUES (?, ?)',
      [req.user.id, userToFollow.id]
    );
  }
  res.status(204).end();
});

router.get('/users/:nickname/following', async function (req, res) {
  const [users] = await db.query('SELECT id FROM users WHERE nickname = ?', [
    req.params.nickname
  ]);
  if (users.length === 0) {
    res.status(404).end();
    return;
  }
  const [followingUsers] = await db.query(
    `
    SELECT users.name, users.nickname, users.avatar_url 
    FROM followers
    INNER JOIN users ON users.id = followers.following_id
    WHERE follower_id = ?
  `,
    [users[0].id]
  );
  res.json(followingUsers);
});

router.get('/users/:nickname/followers', async function (req, res) {
  const [users] = await db.query('SELECT id FROM users WHERE nickname = ?', [
    req.params.nickname
  ]);
  if (users.length === 0) {
    res.status(404).end();
    return;
  }
  const [followedUsers] = await db.query(
    `
    SELECT users.name, users.nickname, users.avatar_url 
    FROM followers
    INNER JOIN users ON users.id = followers.follower_id
    WHERE following_id = ?
  `,
    [users[0].id]
  );
  res.json(followedUsers);
});

router.delete('/users/:nickname/follow', requireAuthentication, async function (
  req,
  res
) {
  const [users] = await db.query('SELECT id FROM users WHERE nickname = ?', [
    req.params.nickname
  ]);
  if (users.length === 0) {
    res.status(404).end();
    return;
  }
  const userToUnfollow = users[0];
  await db.query(
    'DELETE FROM followers WHERE follower_id = ? AND following_id =?',
    [req.user.id, userToUnfollow.id]
  );
  res.status(204).end();
});

module.exports = router;
