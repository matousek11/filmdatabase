const express = require('express')
const app = express()

const movies = [
  { id: 1, name: 'Kill Bill', year: 2003 },
  { id: 2, name: 'Kill Bill 2', year: 2004 },
  { id: 3, name: 'Star Wars IV', year: 1976 },
  { id: 4, name: 'Star Wars V', year: 1980 },
]

app.get('/api/movies', (req, res) => {
  res.send(movies)
})

app.get('/api/movies/:id', (req, res) => {
  const id = Number(req.params.id)
  const movie = movies.find((movie) => movie.id === id)
  if (movie) {
    res.send(movie)
  } else {
    res.status(404).send('Film nebyl nalezen.')
  }
})

app.listen(3000, () => console.log('Listening on port 3000...'))
