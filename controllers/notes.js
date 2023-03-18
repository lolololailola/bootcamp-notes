import { Router } from 'express'
import jwt from 'jsonwebtoken'

import { Note } from '../models/note.js'
import { User } from '../models/user.js'

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

export const notesRouter = Router()

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1,
  })
  response.json(notes)
})

notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => {
      next(error)
    })
})

notesRouter.post('/', async (request, response, next) => {
  const { content, important = false } = request.body

  if (content === undefined) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const note = new Note({
    content,
    important: important || false,
    date: new Date(),
    user: user._id,
  })

  try {
    const savedNote = await note.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.json(savedNote)
  } catch (error) {
    next(error)
  }

  //   note
  //     .save()
  //     .then((savedNote) => {
  //       response.json(savedNote)
  //     })
  //     .catch((error) => next(error))
})

notesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote)
    })
    .catch((error) => next(error))
})

notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})
