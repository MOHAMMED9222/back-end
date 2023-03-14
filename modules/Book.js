'use strict'

const mongoose = require('mongoose');

const { Schema } = mongoose;

// this schema
// this is the rules for what is allowed in our database
const BookSchema = new Schema({
  title: {type: String, required: true},
  description:  {type: String, required: true},
  status: {type: Boolean, required: true},
  
});

// define our model
// this is the functionalitty of how we interact with out database
const BookModel = mongoose.model('Book', BookSchema);

// the server.js will have access to the functionality of our database
module.exports = BookModel;
