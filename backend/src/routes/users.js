const db = require('../db')
const express = require('express')
const {validateEmail} = require("./functions")
const router = express.Router() 
const { uuid } = require('uuidv4');
const _ = require("lodash")

const { catchAsyncErrorsOnRouter } = require('express-async-await-errors');
const { allowAuthentication, requireAuthentication } = require('../middlewares');
catchAsyncErrorsOnRouter(router)


router.post('/users', async function (req, res){
  if(validateEmail(req.body.email) === false){
    res.status(400)
    res.json({error: "Email inválido!"})
    return
  }

  const [usersWithEmail] = await db.query('SELECT * FROM users WHERE email = ?', [req.body.email])
  if(usersWithEmail.length > 0){
    res.status(400)
    res.json({error: "Este email já está em uso!"})
    return
  }
  const [usersWithNickname] = await db.query('SELECT * FROM users WHERE nickname = ?', [req.body.nickname])
  if(usersWithNickname.length > 0){
    res.status(400)
    res.json({error: "Este nome de usuário já está em uso!"})
    return
  }
  if(req.body.password === ""){
    res.status(400)
    res.json({Error: "Senha precisa ser preenchida!"})
    return
  }

  if(req.body.password.length > 40){
    res.status(400)
    res.json({error: "Senha muito grande, use no máximo 40 caracteres!"})
    return
  }
  if(req.body.password.length < 6){
    res.status(400)
    res.json({error: "Senha muito pequena, use no mínimo 6 caracteres!"})
    return
  }
  const [result] = await db.query('INSERT INTO users(name, email, nickname, password, access_token) VALUES (?, ?, ?, ?, ?)', [req.body.name, req.body.email, req.body.nickname, req.body.password, uuid()])
  const [users] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId])
  res.json(users[0])

})


router.post('/users/login', async function (req, res){
  const [users] = await db.query('SELECT * FROM users WHERE email = ? AND password = ?', [req.body.email, req.body.password])
  if(users.length === 1){
    res.json(users[0])
  } else{
    res.status(401)
    res.json({error: "Email ou senha incorretos!"})
  } 
})

router.get('/me', requireAuthentication, async function(req, res){
  res.json(req.user)
})

router.get('/users/:nickname', allowAuthentication, async function (req, res){
  const [users] = await db.query('SELECT id, name, nickname, avatar_url, cover_url FROM users WHERE nickname = ?', [req.params.nickname]) 
  if(users.length === 0){
    res.status(404).end()
    return
  }
  const user = users[0]

  if(req.user){
    const [following] = await db.query('SELECT * FROM followers WHERE follower_id = ? AND following_id = ?', [req.user.id, user.id])
    user.followedByMe = following.length > 0
  }

  res.json(user)
})

router.get('/users/:nickname/posts', async function (req, res){
  const [users] = await db.query('SELECT id FROM users WHERE nickname = ?', [req.params.nickname]) 
  if(users.length === 0){
    res.status(404).end()
    return
  }

  const [posts] = await db.query('SELECT posts.*, users.name, users.nickname FROM posts INNER JOIN users ON posts.user_id = users.id WHERE user_id = ? ORDER BY created_at DESC', [ users[0].id ]) 
  res.json(posts)
})

router.put('/me', requireAuthentication, async function(req, res){
  const fields = _.pick(req.body, ['name', 'avatar_url', 'cover_url'])
  await db.query('UPDATE users SET ? WHERE id = ?', [fields, req.user.id])
  const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id])
  res.json(users[0]);
  
})

router.post('/users/:nickname/follow', requireAuthentication, async function(req, res){
  const [users] = await db.query('SELECT id FROM users WHERE nickname = ?', [req.params.nickname])
  if(users.length === 0){
    res.status(404).end()
    return
  }
  const userToFollow = users[0]
  const [following] = await db.query('SELECT * FROM followers WHERE follower_id = ? AND following_id = ?', [req.user.id, userToFollow.id])
  if(following.length === 0){
    await db.query('INSERT INTO followers(follower_id, following_id) VALUES (?, ?)', [req.user.id, userToFollow.id])
  }
  res.status(204).end()
})

router.delete('/users/:nickname/follow', requireAuthentication, async function(req, res){
  const [users] = await db.query('SELECT id FROM users WHERE nickname = ?', [req.params.nickname])
  if(users.length === 0){
    res.status(404).end()
    return
  }
  const userToUnfollow = users[0]
  await db.query('DELETE FROM followers WHERE follower_id = ? AND following_id =?', [req.user.id, userToUnfollow.id] )
  res.status(204).end()
})

module.exports = router;