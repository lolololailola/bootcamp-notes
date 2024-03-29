import express from 'express'
export const app = express()

import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

import cors from 'cors'
import mongoose from 'mongoose'

import { MONGODB_URI, MONGODB_URI_TEST } from './utils/config.js'
import { notesRouter } from './controllers/notes.js'
import { usersRouter } from './controllers/users.js'
import { loginRouter } from './controllers/login.js'
import {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} from './utils/middleware.js'
import { info, error as loggedError } from './utils/logger.js'

const connectionString =
  process.env.NODE_ENV === 'test' ? MONGODB_URI_TEST : MONGODB_URI

info('connecting to', connectionString)

mongoose.set('strictQuery', false)
mongoose
  .connect(connectionString)
  .then(() => {
    info('connected to MongoDB')
  })
  .catch((error) => {
    loggedError('error connecting to MongoDB', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(unknownEndpoint)
app.use(errorHandler)
