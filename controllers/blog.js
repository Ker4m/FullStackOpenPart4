const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/api/blogs', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/api/blogs', async (request, response) => {
  const blog = new Blog(request.body)
  if(!blog.title && !blog.url)response.status(400)
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

module.exports = blogRouter