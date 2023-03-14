'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
//middleware
app.use(cors());
const Book = require('./modules/Book.js');

const mongoose = require('mongoose');
// add validation to confirm we are wired up to our mongo DB
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected');
});

//connect Mongoose to our MongoDB
mongoose.connect(process.env.DB_URL);

// define port validate env is working
const PORT = process.env.PORT || 3001;

// routes
app.get('/test', (request, response) => {

  response.send('test request received')

})

// ROUTES
app.get('/', (request, response) => {
  response.status(200).send('Welcome!');
});

app.get('/Book', getBook);
async function getBook(req, res, next) {
  try {
    let results = await Book.find({});
    res.status(200).send(results);
  } catch(err) {
    next(err);
  }
}

app.get('*', (request, response) => {
  response.status(404).send('Not availabe');
});

// ERROR
app.use((error, request, response, next) => {
  res.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
