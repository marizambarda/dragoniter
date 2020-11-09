const db = require('../db')
const express = require('express')
const router = express.Router() 
const {requireAuthentication} = require("../middlewares")
const { uuid } = require('uuidv4');

const { catchAsyncErrorsOnRouter } = require('express-async-await-errors')
catchAsyncErrorsOnRouter(router)

router.get('/posts',requireAuthentication,  async function (req, res){
  const [posts] = await db.query(`
    SELECT posts.*, users.name, users.nickname, users.avatar_url
    FROM posts 
    INNER JOIN users ON posts.user_id = users.id 
    WHERE user_id in (SELECT following_id FROM followers WHERE follower_id = ?) OR user_id = ?
    ORDER by posts.created_at DESC
  `, [req.user.id, req.user.id ])
  res.json(posts)

})

router.post('/posts',requireAuthentication, async function (req, res){
  const [result] = await db.query('INSERT INTO posts(user_id, body, created_at) VALUES(?, ?, NOW())', [req.user.id, req.body.body])
  const [post] = await db.query('SELECT * FROM posts WHERE id = ?', [result.insertId])
  res.json(post[0])
})

router.get('/users/:nickname/posts', async function (req, res){
  const [users] = await db.query('SELECT id FROM users WHERE nickname = ?', [req.params.nickname]) 
  if(users.length === 0){
    res.status(404).end()
    return
  }

  const [posts] = await db.query('SELECT posts.*, users.name, users.nickname, users.avatar_url FROM posts INNER JOIN users ON posts.user_id = users.id WHERE user_id = ? ORDER BY created_at DESC', [ users[0].id ]) 
  res.json(posts)
})

router.get('/mentions', requireAuthentication, async function(req, res){
  const [mentions] = await db.query(`
    SELECT  posts.*, users.name, users.nickname, users.avatar_url 
    FROM posts 
    INNER JOIN users ON posts.user_id = users.id 
    WHERE posts.body LIKE ? 
    ORDER BY posts.created_at DESC
  `,[`%@${req.user.nickname}%`]) 
  res.json(mentions)
})

router.get('/hashtags/:hashtag/posts', async function(req, res){
  const [posts] = await db.query(`
    SELECT posts.*, users.name, users.nickname, users.avatar_url 
    FROM posts 
    INNER JOIN users ON posts.user_id = users.id 
    WHERE posts.body LIKE ? 
    ORDER BY posts.created_at DESC
  `,[`%#${req.params.hashtag}%`]) 
  res.json(posts)
})

router.delete('/post/:id', requireAuthentication, async function (req, res){
  let [posts] = await db.query('SELECT * FROM posts WHERE id = ? AND user_id = ?', [req.params.id, req.user.id])
  if(posts.length === 0){
    res.status(404).end()
    return
  }
  await db.query('DELETE FROM posts WHERE id = ?', [req.params.id])
  res.status(204).end()
})


module.exports = router;