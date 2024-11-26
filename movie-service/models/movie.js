const mongoose = require('mongoose');

const { Schema } = mongoose;

const movieSchema = new Schema({
  _id: Schema.Types.ObjectId,
  plot: { type: String, required: true },
  genres: [{ type: String }],
  runtime: { type: Number },
  cast: [{ type: String }],
  num_mflix_comments: { type: Number },
  title: { type: String, required: true },
  fullplot: { type: String },
  countries: [{ type: String }],
  released: { type: Date },
  directors: [{ type: String }],
  rated: { type: String },
  awards: {
    wins: { type: Number },
    nominations: { type: Number },
    text: { type: String },
  },
  lastupdated: { type: String },
  year: { type: Number },
  imdb: {
    rating: { type: Number },
    votes: { type: Number },
    id: { type: Number },
  },
  type: { type: String },
  tomatoes: {
    viewer: {
      rating: { type: Number },
      numReviews: { type: Number },
      meter: { type: Number },
    },
    lastUpdated: { type: Date },
  },
});

module.exports = mongoose.model('Movie', movieSchema, 'movie');
