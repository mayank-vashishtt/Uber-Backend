const dotenv = require('dotenv');
dotenv.config(); // put these two lines at the top of your file

const express = require('express');
const cors  = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const connectToDB = require('./db/db');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');



connectToDB();
app.use(cors()); // read about this 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());




app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/users', userRoutes); 
app.use('/captains', captainRoutes);


module.exports = app;

