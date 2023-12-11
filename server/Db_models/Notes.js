const mongoose = require('mongoose');


//Mongoose for our db 

//Declare our schema for every note as an object
const Schema = mongoose.Schema;
const NoteSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },  
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
});

//Name the model as 'Note' and assign the schema obj to our model
//We export this module to import it into files we declare notes in
module.exports = mongoose.model('Note', NoteSchema);


