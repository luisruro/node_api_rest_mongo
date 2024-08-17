const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
    {
        title: String,
        author: String,
        genre: String,
        publication_Date: Date,
    }
);

module.exports = mongoose.model('Book', bookSchema);