const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')


  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body.length).toBe(helper.initialBlogs.length)
})

test('all blogs have an id', async () => {
    const response = await api.get('/api/blogs')
  
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined()
    })

  })
  
test('a valid blog can be added', async () => {
      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
      const token = loginResponse.body.token
  
      const newBlog = {
        title: "Seiskan luku",
        author: "Paavo Väyrynen",
        url: "www.seiska.fi",
        likes: 43,
      }
      

      await api
        .post('/api/blogs')
        .set('authorization', "bearer " + token)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    
      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)
    
      const titles = blogsAtEnd.map(blog => blog.title)
      expect(titles).toContain(
        'Seiskan luku'
      )
    })

    test('a blog with no title is not added', async () => {
        const loginResponse = await api
          .post('/api/login')
          .send({ username: 'root', password: 'sekret' })
        const token = loginResponse.body.token
    
        const newBlog = {
          author: "Pekka Puupää",
          url: "www.puupaa.fi",
        }
        

        await api
          .post('/api/blogs')
          .set('authorization', "bearer " + token)
          .send(newBlog)
          .expect(400)
    
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
      })
    
      test('a blog with no url is not added', async () => {
        const loginResponse = await api
          .post('/api/login')
          .send({ username: 'root', password: 'sekret' })
        const token = loginResponse.body.token
    
        const newBlog = {
          title: "Makkaran paisto",
          author: "Lordi",
        }

        await api
          .post('/api/blogs')
          .set('authorization', "bearer " + token)
          .send(newBlog)
          .expect(400)
    
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
      })
    
      test('a blog with undefined likes gets 0 likes', async () => {
        const loginResponse = await api
          .post('/api/login')
          .send({ username: 'root', password: 'sekret' })
        const token = loginResponse.body.token
    
        const newBlog = {
          title: "Hevoskauppa",
          author: "Hevosmies",
          url: "www.hevonen.fi",
        }
      
        const response = await api
          .post('/api/blogs')
          .set('authorization', "bearer " + token)
          .send(newBlog)
          .expect(200)
          .expect('Content-Type', /application\/json/)
      
        expect(response.body.likes).toBe(0)
      })


test('cannot add blog without token', async () => {
  const newBlog = {
    title: "Seiskan luku",
    author: "Seppo Taalasmaa",
    url: "www.hymy.fi",
    likes: 5,
  }


  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('updating a blog', async () => {
  const blogsAtBeginning = await helper.blogsInDb()
  const blogToUpdate = blogsAtBeginning[0]

  const updatedBlog = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: 55
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd[0].likes).toBe(55)
})

afterAll(() => {
  mongoose.connection.close()
})
