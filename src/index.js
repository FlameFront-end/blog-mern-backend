import express from 'express'
import mongoose from 'mongoose'
import { loginValidation, registerValidation } from './validation/auth.js'
import checkAuth from './utils/checkAuth.js'
import { getMe, login, register } from './controlers/UserController.js'

mongoose
  .connect('mongodb://localhost/blog')
  .then(() => {
    console.log('DB Ok')
  })
  .catch((err) => {
    console.error('DB ERROR', err)
  })

const app = express()

app.use(express.json()) // чтобы читать json

app.post('/auth/register', registerValidation, register)

app.post('/auth/login', login)

app.get('/auth/me', checkAuth, getMe)

app.listen(4444, (err) => {
  if (err) {
    return console.error(err)
  }
  console.log('Server OK. Port: http://localhost:4444')
})
