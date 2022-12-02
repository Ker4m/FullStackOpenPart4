const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  let sum = 0
  blogs.forEach((b) => {sum += b.likes})
  return sum
}

const favoriteBlog = (blogs) => {
  if(blogs.length === 0) return null
  const max = blogs.reduce(function(prev, current) {
    return (prev.likes > current.likes) ? prev : current
  })
  const { title, author, likes } = max
  return { title, author, likes }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}