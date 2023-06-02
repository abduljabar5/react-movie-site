
const { Schema, model } = require('mongoose');

const AnimeSchema = new Schema({
  animeId: {
    type: String,
    required: true,
  },
  animeName: {
    type: String,
    required: true
  },
});

const Anime = model('Anime', AnimeSchema);

module.exports = Anime;