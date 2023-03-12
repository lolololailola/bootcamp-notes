import test from 'ava'
import supertest from 'supertest'
import mongoose from 'mongoose'

import { app } from '../app.js'
import { server } from '../index.js'
import { Note } from '../models/note.js'

const api = supertest(app)

const initialNotes = [
  {
    content: 'Nota fake de test 1',
    important: true,
    date: new Date(),
  },
  {
    content: 'Nota fake de test 2',
    important: false,
    date: new Date(),
  },
  {
    content: 'Nota fake de test 3',
    important: true,
    date: new Date(),
  },
]

test.beforeEach(async () => {
  await Note.deleteMany({})

  const note1 = new Note(initialNotes[0])
  await note1.save()

  //   const note2 = new Note(initialNotes[1])
  //   await note2.save()

  //   const note3 = new Note(initialNotes[2])
  //   await note3.save()
})

// test.afterEach(async () => {
//   await Note.deleteMany({})
// })

test('notes are returned as json', async (t) => {
  const result = await api.get('/api/notes')
  t.is(result.statusCode, 200)
  t.is(result.header['content-type'], 'application/json; charset=utf-8')
})

test('there is one note', async (t) => {
  const result = await api.get('/api/notes')
  t.is(result.body.length, 2)
})

test('the number of notes is calculated correctly', async (t) => {
  const result = await api.get('/api/notes')
  t.is(result.body.length, initialNotes.length)
})

test('the first note is fake 1', async (t) => {
  const result = await api.get('/api/notes')
  t.is(result.body[0].content, 'Nota fake de test 1')
})

test('a valid note can be added', async (t) => {
  const newNote = {
    content: 'Nota añadida en el test',
    date: new Date(),
    important: true,
  }

  const response = await api.post('api/notes').send(newNote)
  t.is(response.statusCode, 200)
  t.is(response.header['content-type'], 'application/json; charset=utf-8')
})

test.after(async () => {
  server.close()
  console.log('server closed')
  await mongoose.connection.close()
  console.log('connection to DB closed')
})
