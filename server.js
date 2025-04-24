const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const Movie = require('./models/movie');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded( { extended: false }));

mongoose.connect(
  'mongodb+srv://mrwigand:SaveMedicare1894@movies.ihobit7.mongodb.net/?retryWrites=true&w=majority&appName=movies')
  .then(() => console.log('Connected to database'))
  .catch((err) => {
    console.log('Connection failed');
});

// const findMovies = async () => {
//   const movies = await Movie.find({});
//   console.log(movies);
// }

// findMovies();

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/movies', (req, res) => {
  res.render('movies');
});

app.post('/', (req, resp) => {
  const title = req.body.title.split(" ").join("+");

  const apiResponse = async (inputTitle) => {
    try {
      await fetch(`http://www.omdbapi.com/?t=${inputTitle}&apikey=b8f921ba`)
      .then(res => res.json())
      .then(res => {
        resp.render('findMovie', {
          title: res.Title,
          director: res.Director,
          plot: res.Plot,
          country: res.Country,
          poster: res.Poster,
          year: res.Year,
          runTime: res.Runtime,
          imdbID: res.imdbID
        });
      });
    } catch (e) {
      console.log(e);
    }
  };

  const response = apiResponse(title);
});

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});