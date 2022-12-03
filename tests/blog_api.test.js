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

describe('when there is initially some blogs saved', () => {
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

  describe('addition of a new blog', () => {
    test('a valid blog can be added ', async () => {
      const newBlog = {
        title: 'Developer lifestyles',
        author: 'Elon',
        url: '/twitter',
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
        author: 'Elon',
        url: '/twitter'
      }

      await api
        .post('/api/blogs')
        .send(newBlog)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd.at(-1).likes).toBe(0)

    })

    test('blog without title responds error code 400', async () => {
      const newBlog = {
        likes: 5,
        author: 'John',
        url: 'http://fdfgdgd.com/blog'
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('blog without url responds error code 400', async () => {
      const newBlog = {
        likes: 5,
        author: 'John',
        title: 'A nice title'
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogssAtStart = await helper.blogsInDb()
      const blogToDelete = blogssAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
      )

      const titles = blogsAtEnd.map(r => r.title)

      expect(titles).not.toContain(blogToDelete.title)
    })
  })

  describe('update of a blog', () => {
    test('update the amount of likes for a blog post', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const body = JSON.stringify({ likes:99 })

      await api
        .put(`/api/blogs/${blogToUpdate.id}`, body)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length
      )

      expect(blogsAtEnd[0].likes).toBe(99)
    })
  })

})
afterAll(() => {
  mongoose.connection.close()
})