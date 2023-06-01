
const { Schema, model } = require('mongoose');

const MovieSchema = new Schema({
  tmdbId: String,
  imdbId: String
});

const Movie = model('Movie', MovieSchema);

module.exports = Movie;
