const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
})

test('usename must be over 3 characters', async () => {
    const newUser = {
        username: 'ss',
        name: 'testi',
        password: 'salainen'
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
})

test('password must be over 3 characters', async () => {
    const newUser = {
        username: 'testi',
        name: 'testi',
        password: 'ss'
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
})

test('username must be unique', async () => {
    const newUser = {
        username: 'root',
        name: 'Seppo Taalasmaa',
        password: 'salasana'
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
})

afterAll(() => {
    mongoose.connection.close()
  })