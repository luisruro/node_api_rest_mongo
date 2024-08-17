const express = require('express');
const router = express.Router();
const Book = require('../models/book.models');

//MIDDLEWARE

const getBook = async (req, res, next) => {
    let book;
    const { id } = req.params;
    //La expresión regular hace referencia a los que debe contener el id de mongo
    if (!id.match(/^[0-9a-fA-f]{24}$/)) {
        return res.status(404).json({ message: "El ID del libro no es válido"})
    }

    try {
        book = await Book.findById(id)
        if (!book) {
            return res.status(404).json({ message: "El libro no existe" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

    res.book = book;
    next();
};

// Get all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        console.log("GET ALL", books);
        
        if (books.length === 0) {
            return res.status(204).json([]);
        }
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

// Create a new book

router.post("/", async (req, res) => {
    const {title, author, genre, publication_Date} = req?.body; //El signo de pregunta es por si no viene
    if (!title || !author || !genre || !publication_Date) {
        return res.status(400).json({
            message: "Los campos título, autor, género y fecha son obligatorios"
        });
    }

    const book = new Book(
        {
            title,
            author,
            genre,
            publication_Date
        }
    );

    try {
        const newBook = await book.save();
        console.log(newBook);
        
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
});

router.get("/:id", getBook, async (req, res) => {
    res.json(res.book); //res.book es el que esta en el middleware
});

router.put("/:id", getBook, async (req, res) => {
    try {
        const book = res.book
        book.title = req.body.title || book.title; //Si tiene un title setearlo con lo que viene en la request o de lo contrario dejalo como estaba
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_Date = req.body.publication_Date || book.publication_Date;

        const updatedBook = await book.save();
        res.json({message: "Book updated successfully", updatedBook});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

router.patch("/:id", getBook, async (req, res) => {

    if(!req.body.title && !req.body.author && !req.body.genre && !req.body.publication_Date) {
        res.status(400).json({message: "Al menos uno de estos campos debe ser envíado: Título, Autor, Género o fecha de publicación."});
    }

    try {
        const book = res.book
        book.title = req.body.title || book.title; //Si tiene un title setearlo con lo que viene en la request o de lo contrario dejalo como estaba
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_Date = req.body.publication_Date || book.publication_Date;

        const updatedBook = await book.save();
        res.json({message: "Book updated successfully", updatedBook});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

router.delete("/:id", getBook, async (req, res) => {
    try {
        //await res.book.remove();
        const book = res.book
        await book.deleteOne({
            _id: book._id
        });
        res.json({ message: `Book ${book.title} was deleted successfully`});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router