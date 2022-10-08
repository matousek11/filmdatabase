const express = require('express')
const { string } = require('joi')
const Joi = require('joi')
const mongoose = require('mongoose')
const app = express()
app.use(express.json())

mongoose
  .connect('mongodb://localhost:27017/moviesdb', {
    useNewUrlParser: true,
  })
  .then(() => console.log('Connected to database'))
  .catch((error) => {
    console.log('Could not connect to MongoDb', error)
  })

const movieSchema = new mongoose.Schema({
  name: String,
  year: Number,
  directorId: mongoose.Schema.Types.ObjectId,
  actorsId: [mongoose.Schema.Types.ObjectId],
  genres: [String],
  isAvailable: Boolean,
  dateAdded: {
    type: Date,
    default: Date.now,
  },
})

personSchema = new mongoose.Schema({
  name: String,
  birthDate: Date,
  country: String,
  biography: String,
  role: String,
})

const genres = [
  'sci-fi',
  'adventure',
  'action',
  'romantic',
  'animated',
  'comedy',
]
const Movie = mongoose.model('Movie', movieSchema)
const Person = mongoose.model('Person', personSchema)

function validatePerson(person, allRequired = true) {
  const schema = Joi.object({
    name: Joi.string().min(3),
    birthDate: Joi.date(),
    biography: Joi.string().min(10),
    country: Joi.string().min(2),
    role: Joi.string().valid('actor', 'director'),
  })
  return schema.validate(person, {
    presence: allRequired ? 'required' : 'optional',
  })
}

function validateMovie(movie) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    directorName: Joi.string().min(3).required(),
    isAvailable: Joi.bool().required(),
    genres: Joi.array().min(1).required(),
    year: Joi.number().required(),
  })
  return schema.validate(movie, {
    presence: allRequired ? 'required' : 'optional',
  })
}

function validateGet(getData) {
  const schema = Joi.object({
    limit: Joi.number().min(1),
    fromYear: Joi.number(),
    toYear: Joi.number(),
    genre: Joi.string().valid(...genres),
    select: Joi.string(),
    directorID: Joi.string().min(5),
    actorID: Joi.string().min(5),
  })
  return schema.validate(getData, {
    presence: allRequired ? 'required' : 'optional',
  })
}

app.get('/api/movies', (req, res) => {
  Movie.find()
    .sort('-year name')
    .then((movies) => {
      res.json(movies)
    })
})

app.get('/api/movies/:id', (req, res) => {
  const id = String(req.params.id)
  Movie.findById(id, (err, result) => {
    if (err || !result) {
      res.status(404).send('Film nebyl nalezen.')
    } else res.json(result)
  })
})

app.post('/api/movies', (req, res) => {
  const { error } = validateMovie(req.body)
  if (error) {
    res.status(400).send(error.details[0].message)
  } else {
    Movie.create(req.body)
      .then((result) => res.json(result))
      .catch(() => res.send('Nepodařilo se uložit film!'))
  }
})

app.listen(3000, () => console.log('Listening: ', 'https://localhost:3000'))
