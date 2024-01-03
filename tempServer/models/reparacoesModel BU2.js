const { Schema } = require('mongoose');

const todoSchema = new Schema({
   title: String,
   description: String,
   // Add other fields as needed
});

module.exports = mongoose.model('Todo', todoSchema);
