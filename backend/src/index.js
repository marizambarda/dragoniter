const db = require('./db')
const express = require('express')
const app = express()
const cors = require('cors')
const port = 9000

app.use(express.json())
app.use(cors())

const users = require('./routes/users')
const posts = require('./routes/posts')

app.use('/', users)
app.use('/', posts)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})