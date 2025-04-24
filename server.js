const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded( { extended: false }));

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});