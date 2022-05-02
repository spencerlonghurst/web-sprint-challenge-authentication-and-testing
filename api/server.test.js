const request = require('supertest')
const server = require('../api/server')
const db = require('../data/dbConfig')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db('users').truncate()
})
afterAll(async () => {
  await db.destroy()
})


test('[0] sanity', () => {
  expect(true).toBe(true)
})

describe('auth-router.js', () => {
  describe('[POST] /api/auth/register', () => {
    it('[1] properly creates a new user in the database', async () => {
      await request(server).post('/api/auth/register').send({ username: 'spencer', password: 'foobarbaz' })
      const spencer = await db('users').where('username', 'spencer').first()
      expect(spencer).toMatchObject({ username: 'spencer' })
    })
    it('[2] responds with proper status on successful register', async () => {
      const response = await request(server).post('/api/auth/register').send({ username: 'spencer', password: 'foobarbaz' })
      expect(response.status).toBe(201)
    })
  })
  describe('[POST] /api/auth/login', () => {
    it('[3] responds with the correct message on sucesssful login ', async () => {
      await request(server).post('/api/auth/register').send({ username: 'spencer', password: 'foobarbaz' })
      const response = await request(server).post('/api/auth/login').send({ username: 'spencer', password: 'foobarbaz' })
      expect(response.body.message).toMatch('welcome spencer')
    })
    it('[4] responds with the correct status and message on invalid credentials', async () => {
      await request(server).post('/api/auth/register').send({ username: 'spencer', password: 'foobarbaz' })
      const response = await request(server).post('/api/auth/login').send({ username: 'asdf', password: 'foobarbaz' })
      expect(response.body.message).toMatch('Invalid Credentials')
    })
  })

  describe('[GET] /api/jokes', () => {
    it('[5] responds with the proper error if no token', async () => {
      const response = await request(server).get('/api/jokes')
      expect(response.status).toBe(401)
    })
    it('[6] responds with the proper message if no token', async () => {
      const response = await request(server).get('/api/jokes')
      expect(response.body.message).toMatch('token required')
    })
  })
})