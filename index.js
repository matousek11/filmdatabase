const express = require('express')
const app = express()
app.use(express.json())

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

app.post('/api/movies', (req, res) => {
  const movie = {
    id: movies.length + 1,
    name: req.body.name,
    year: req.body.year,
  }
  movies.push(movie)
  res.send(movie)
})

app.listen(3000, () => console.log('Listening on port 3000...'))
