const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const userController = require('../controllers/user.controller');   

router.post('/register',[
    body('email').isEmail().withMessage('Invalid email'),
    body('fullName.firstName').isLength({min:3}).withMessage('First name must be at least 3 characters'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters')

], 
userController.registerUser);





module.exports = router;
//express-validator , something like the zod library 
