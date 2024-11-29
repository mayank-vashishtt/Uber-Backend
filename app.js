const dotenv = require('dotenv');
dotenv.config(); // put these two lines at the top of your file

const express = require('express');
const cors  = require('cors');
const app = express();
const connectToDB = require('./db/db');
const userRoutes = require('./routes/user.routes');



connectToDB();
app.use(cors()); // read about this 
app.use(express.json());
app.use(express.urlencoded({extended: true}));




app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/users', userRoutes);   

module.exports = app;

