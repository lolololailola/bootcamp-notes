import supertest from 'supertest'

import { app } from '../app.js'
import { Note } from '../models/note.js'

export const api = supertest(app)

export const getAllContentFromNotes = async () => {
  const actualNumberOfNotes = await Note.estimatedDocumentCount()
  const response = await api.get('/api/notes')
  return {
    contents: response.body.map((note) => note.content),
    actualNumberOfNotes,
  }
}
