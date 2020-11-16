require('dotenv').config()

const db = require('./db')
const express = require('express')
const app = express()
const delay = require('express-delay-header')
const cors = require('cors')
const port = 9000

app.use(express.json())
app.use(cors())
app.use(delay())

const users = require('./routes/users')
const posts = require('./routes/posts')
const forgotPassword = require('./routes/forgotPassword')

app.use('/', users)
app.use('/', posts)
app.use('/', forgotPassword)


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})