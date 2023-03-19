'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express('./auth');
const verifyUser = require('./modules/auth');
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
app.delete('/Book/:id', deleteBook);
app.put('/Book/:id', putBook);


// basic format of using verification with verification from our auth.js file
// verifyUser(req, async (err, user) => {
//   if (err) {
//     console.log(err);
//     res.send('invalid token');
//   } else {
//     // insert our try try catch logic
//     // Be careful. check syntax
//   }
// })

app.get('/Book', getBook);
async function getBook(req, res, next) {
  try {
    let results = await Book.find({});
    res.status(200).send(results);
  } catch(error) {
    next(error);
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
  } catch(error) {
    next(error);
  }
}

async function putBook(req, res, next) {
  try {
    let id = req.params.id;
    let updatedBook = req.body;

    // find by idandupdate method takes in 3 arguments:
    // -1 id of the thing in the database to update 
    // -2 updated data object 
    // -3. options object, 
    let updatedBookFromDatabase = await Book.findByIdAndUpdate(id, updatedBook, { new: true, overwrite: true});
    res.status(200).send(updatedBookFromDatabase);
  } catch(error) {
    next(error);
  }
} 

async function postBook(req, res, next) {
  console.log(req.body);
  try {
    // we want to add cats to our database
    let createdBook = await Book.create(req.body);
    // .body is where your putting the .json data
    // not using a query string because its too much data
    // must need app.use(express.json()); above

    res.status(200).send(createdBook);
    // all systems go
  } catch(error) {
    next(error);
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
