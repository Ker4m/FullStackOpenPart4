const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')


beforeEach(async () => {
  await Blog.deleteMany({})
  // const noteObjects = helper.initialBlogs
  //   .map(b => new Blog(b))
  // const promiseArray = noteObjects.map(b => b.save())
  // await Promise.all(promiseArray)
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('the first blog title is React patterns', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].title).toBe('React patterns')
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('a specific blog is within the returned notes', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.title)
  expect(contents).toContain(
    'Canonical string reduction'
  )
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'Developer lifestyles',
    author: 'Elon',
    likes:3
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(n => n.title)
  expect(titles).toContain(
    'Developer lifestyles'
  )
})

test('default value of likes for a new blog, if not specidied, is 0 ', async () => {
  const newBlog = {
    title: 'Developer lifestyles',
    author: 'Elon'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd.at(-1).likes).toBe(0)

})

// test('note without title is not added', async () => {
//   const newBlog = {
//     likes: 5,
//     author: 'John',
//   }

//   await api
//     .post('/api/blogs')
//     .send(newBlog)
//     .expect(400)

//   const notesAtEnd = await helper.notesInDb()

//   expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
// })

afterAll(() => {
  mongoose.connection.close()
})