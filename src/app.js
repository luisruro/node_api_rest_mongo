const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // es para parsear cuando vaya a recibir el post
const { config } = require('dotenv');
config();

const bookRoutes = require('./routes/book.routes');

//Usamos express para los middlewares
const app = express();
app.use(bodyParser.json());// Middleware para parsear el body que recibamos

//Conectaremos la base de datos

mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME })
const db = mongoose.connection;

app.use("/books", bookRoutes)



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor inicializado en el puerto ${port}`);
});