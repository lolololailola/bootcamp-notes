import { Router } from 'express'

import { Note } from '../models/note.js'
import { User } from '../models/user.js'

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
  const { content, important = false, userId } = request.body

  if (content === undefined) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  const user = await User.findById(userId)

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
