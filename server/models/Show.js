
const { Schema, model } = require('mongoose');

const ShowSchema = new Schema({
  themoviedb: Object,
});

const Show = model('Show', ShowSchema);

module.exports = Show;
