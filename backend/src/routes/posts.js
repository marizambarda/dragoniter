const db = require('../db')
const express = require('express')
const router = express.Router() 
const {requireAuthentication} = require("../middlewares")
const { uuid } = require('uuidv4');

const { catchAsyncErrorsOnRouter } = require('express-async-await-errors')
catchAsyncErrorsOnRouter(router)

router.get('/posts',requireAuthentication,  async function (req, res){
  const [posts] = await db.query(`
    SELECT posts.*, users.name, users.nickname 
    FROM posts 
    INNER JOIN users ON posts.user_id = users.id 
    WHERE user_id in (SELECT following_id FROM followers WHERE follower_id = ?) OR user_id = ?
    ORDER by created_at DESC
  `, [req.user.id, req.user.id ])
  res.json(posts)

})

router.post('/posts',requireAuthentication, async function (req, res){
  const [result] = await db.query('INSERT INTO posts(user_id, body, created_at) VALUES(?, ?, NOW())', [req.user.id, req.body.body])
  const [post] = await db.query('SELECT * FROM posts WHERE id = ?', [result.insertId])
  res.json(post[0])
})


module.exports = router;