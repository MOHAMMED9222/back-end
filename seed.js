'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL);

const Book = require('./modules/Book.js');

async function seed() {
  const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is seeded');
});
  // add cats to our database
  // follow the same structure as our Cat Schema
  /*
    const catSchema = new Schema({
      name: {type: String, required: true},
      color:  {type: String, required: true},
      spayNeuter: {type: Boolean, required: true},
      location:  {type: String, required: true},
    });
  */
    await Book.create({
      title: 'GET RICH',
      description: 'BLACK',
      status: true,
      
    });
    console.log('GET RICH was added')
  
    await Book.create({
      title: 'DONT BE TRICKIN',
      description: 'WHITE',
      status: true,
     
    });
    console.log('DONT BE TRICKIN was added');
    await Book.create({
      title: 'LIVE STRONG',
      description: 'RED',
      status: true,
    });
    mongoose.disconnect();
  }
  
  seed();
