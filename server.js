'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
//middleware
app.use(cors());
const Book = require('./modules/Book.js');
// we must have this to recieve JSON data from a request
app.use(express.json());

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

// ROUTES
app.get('/test', (request, response) => {

  response.send('test request received')

})


app.get('/', (request, response) => {
  response.status(200).send('Welcome!');
});
app.get('/Book', getBook);
app.post('/Book', postBook)
// 'id' is the variable I declared here: path parameter
// If I have this URL coming in the request:
// http://localhost:3001/cats/637bceabc57c693faee21e8f
// I access the value 637bceabc57c693faee21e8f with
// req.params.id
// 'id' is the variable I declared here:
app.delete('/Book/:id', deleteBook);

app.get('/Book', getBook);
async function getBook(req, res, next) {
  try {
    let results = await Book.find({});
    res.status(200).send(results);
  } catch(err) {
    next(err);
  }
}

async function deleteBook(req, res, next) {
  // console.log(req);
  // try catch = basic scaffling
  try {
    let id = req.params.id;
    // do not expect anything to be returned by findByIdAndDelete
    await Book.findByIdAndDelete(id);
    res.status(200).send('Book deleted');
    // find out where validation goes
  } catch(err) {
    next(err);
  }
}


async function postBook(req, res, next) {
  console.log(req.body);
  try {
    // we want to add cats to our database
    let createdBook = await Book.create(req.body);
    res.status(200).send(createdBook);
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
