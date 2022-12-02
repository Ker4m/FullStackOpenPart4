const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let sum = 0
  blogs.forEach((b) => {sum += b.likes})
  return sum
}

module.exports = {
  dummy,
  totalLikes
}