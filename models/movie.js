const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  director: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  runTime: {
    type: String,
    required: true
  },
  watched: {
    type: Boolean,
    required: true
  },
  streaming: {
    type: [String],
    required: true,
  }
});

module.exports = mongoose.model("Movie", movieSchema);