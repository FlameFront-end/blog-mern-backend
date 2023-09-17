import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { validationResult } from 'express-validator'

import { registerValidation } from './validation/auth.js'
import UserModel from './models/User.js'

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

app.post('/auth/register', registerValidation, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array())
  }

  // Шифрование пароля
  const password = req.body.password
  const salt = await bcrypt.genSalt(2)
  const passwordHash = await bcrypt.hash(password, salt)

  const doc = new UserModel({
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl,
    passwordHash,
  })

  const user = await doc.save()

  res.json(user)
})

app.post('/auth/register2', (req, res) => {
  res.json({
    success: true,
  })
})

app.listen(4444, (err) => {
  if (err) {
    return console.error(err)
  }
  console.log('Server OK. Port: http://localhost:4444')
})
