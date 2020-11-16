const db = require('./db');

async function allowAuthentication(req, res, next) {
  if (req.headers.access_token) {
    const [users] = await db.query(
      'SELECT * FROM users WHERE access_token = ?',
      [req.headers.access_token]
    );
    req.user = users[0];
  }
  next();
}

async function requireAuthentication(req, res, next) {
  const [users] = await db.query('SELECT * FROM users WHERE access_token = ?', [
    req.headers.access_token,
  ]);
  if (users.length === 0) {
    res.status(401);
    res.end();
    return;
  }
  req.user = users[0];
  next();
}

module.exports = {
  allowAuthentication,
  requireAuthentication,
};
