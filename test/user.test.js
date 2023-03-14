import supertest from 'supertest'
import test from 'ava'
import { app } from '../app.js'
import { User } from '../models/user.js'

export const api = supertest(app)

// test('a valid user can be added', async (t) => {
//   const usersDB = await User.find({})
//   const usersAtStart = usersDB.map((u) => u.toJSON())

//   const newUser = {
//     username: 'misael',
//     name: 'Misael Ramos',
//     password: 'lodecamisa',
//   }

//   const result = await api.post('/api/users').send(newUser)
//   t.is(result.header['content-type'], 'application/json; charset=utf-8')
//   t.is(result.statusCode, 200)

//   const usersDBAfter = await User.find({})
//   const usersAtEnd = usersDBAfter.map((u) => u.toJSON())
//   t.is(usersAtEnd.length, usersAtStart.length + 1)

//   const usernames = usersAtEnd.map((u) => u.username)
//   t.is(
//     usernames.find((u) => u === newUser.username),
//     newUser.username
//   )
// })

test('creation fails with proper statuscode and message if username is already taken', async (t) => {
  const usersDB = await User.find({})
  const usersAtStart = usersDB.map((u) => u.toJSON())

  const newUser = {
    username: 'misael',
    name: 'Cakita de la guena',
    password: 'lodecamisa',
  }

  const result = await api.post('/api/users').send(newUser)
  t.is(result.statusCode, 400)
  t.is(result.header['content-type'], 'application/json; charset=utf-8')
  t.is(
    result.body.errors.username.message,
    `Error, expected \`username\` to be unique. Value: \`${newUser.username}\``
  )

  const usersDBAfter = await User.find({})
  const usersAtEnd = usersDBAfter.map((u) => u.toJSON())
  t.is(usersAtEnd.length, usersAtStart.length)
})
