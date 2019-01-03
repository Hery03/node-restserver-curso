require('./config/config')

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Habilitar carpeta public
app.use(express.static(path.resolve(__dirname, '../Public')));

//Configuracion global de rutas
app.use(require('./rutas/index'));


mongoose.connect(process.env.URLDB, (err, resp) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${process.env.PORT}`);
})