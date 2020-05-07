const _ = require('lodash')

const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {

    const countLikes = (blogs) => {
        let count = 0
        blogs.forEach(blog => {
            count += blog.likes
        })
        return count
    }

    return countLikes(blogs)
}

const favoriteBlog = (blogs) => {

    const mostLikes = (blogs) => {
        let favorite = blogs[0]
        blogs.forEach(blog => {
            if (blog.likes > favorite.likes)
            favorite = blog
        })
        return favorite
    }

    const newBlog = {
        title: mostLikes(blogs).title,
        author: mostLikes(blogs).author,
        likes: mostLikes(blogs).likes
    }

    return newBlog
     
}

const mostBlogs = (blogs) => {

    const authors = _.map(blogs, 'author')

    const authorWithMostBlogs =_.chain(authors)
    .countBy()
    .entries()
    .maxBy(_.last)
    .head()
    .value()

    const blogCount = _.countBy(authors)[authorWithMostBlogs]

    return { author: authorWithMostBlogs, blogs: blogCount }

}

const mostLikes = (blogs) => {
    const countLikes = _.chain(blogs)
      .groupBy('author')
      .map((blog, key) => ({
        'author': key,
        'likes': _.sumBy(blog, 'likes')
      }))
      .maxBy('likes')
      .value()
    console.log(countLikes)
    return countLikes
  }
  
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }