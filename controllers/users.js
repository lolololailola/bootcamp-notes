import { Router } from 'express'
import bcrypt from 'bcrypt'

import { User } from '../models/user.js'

export const usersRouter = Router()

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes', {
    content: 1,
    date: 1,
  })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    response.status(400).json(error)
  }
})
