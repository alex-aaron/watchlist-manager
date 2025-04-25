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
  const getMovies = async () => {
    const col = await Movie.find({});
    res.render('movies', { movies: col });
    return col;
  };

  const movies = getMovies();
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

app.post('/movies', (req, resp) => {
  const title = req.body.title;
  const year = req.body.year;
  const imdbID = req.body.imdbID;

  const url = `https://api.themoviedb.org/3/find/${imdbID}?external_source=imdb_id`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjY2M4NjMwNDM4N2NmNTI2NGY2ZTQ0NTcyNGJlOTQ0ZCIsIm5iZiI6MTY2Mzg2OTg1Ny41NjQsInN1YiI6IjYzMmNhM2ExYzJmNDRiMDA3ZTE0ZmMyZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4uMclJNWykMdDgQRrPQTSn0qAcMYdS2X9pTpoVTwnCw'
    }
  };
  
    
    fetch(url, options)
      .then(res => res.json())
      .then(res => {
        const movie = res.movie_results[0];
    
        const url = `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers`;

        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjY2M4NjMwNDM4N2NmNTI2NGY2ZTQ0NTcyNGJlOTQ0ZCIsIm5iZiI6MTY2Mzg2OTg1Ny41NjQsInN1YiI6IjYzMmNhM2ExYzJmNDRiMDA3ZTE0ZmMyZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4uMclJNWykMdDgQRrPQTSn0qAcMYdS2X9pTpoVTwnCw'
          }
        };
    
        fetch(url, options)
          .then(res => res.json())
          .then(res => {
            console.log(res);
            const services = ['Tubi TV', 'Pluto TV', 'Max', 'Mubi', 'Criterion Channel', 'Netflix', 'Paramount Plus', 'Kanopy', 'MUBI', 'Amazon Prime Video'];
            const streaming = [];
            if (res.results.US){
              if (res.results.US.ads){
                res.results.US.ads.forEach(item => services.includes(item.provider_name) ? streaming.push(item.provider_name) : streaming);
              }
              if (res.results.US.flatrate){
                res.results.US.flatrate.forEach(item => services.includes(item.provider_name) ? streaming.push(item.provider_name) : streaming);
              }
              if (res.results.US.free){
                res.results.US.free.forEach(item => services.includes(item.provider_name) ? streaming.push(item.provider_name) : streaming);
              }
            }

            const filmToAdd = new Movie({
              title: req.body.title,
              director: req.body.director,
              year: req.body.year,
              runTime: req.body.runtime,
              watched: req.body.watchedFilm,
              streaming: streaming
            });

            console.log(filmToAdd);

            const addFilm = async (film) => {
              const result = await film.save();
              return result;
            }

            try {
              addFilm(filmToAdd);
              resp.redirect('/movies');
            } catch (e) {
              console.log(e);
            }
          })
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
});

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});