const dotenv = require('dotenv');
dotenv.config(); // put these two lines at the top of your file

const express = require('express');
const cors  = require('cors');
const app = express();

app.use(cors()); // read about this 

app.get('/', (req, res) => {
    res.send('Hello World');
});

module.exports = app;

