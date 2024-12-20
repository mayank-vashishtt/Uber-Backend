const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const {validationResult} = require('express-validator');    
const blackListTokenModel = require('../models/blacklistToken.model');


module.exports.registerUser = async (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    console.log(req.body);
    

    const {fullName, email, password} = req.body;

    const isUserAlreadyExist = await userModel.findOne({email});

    if(isUserAlreadyExist) {
        return res.status(400).json({message: 'User already exist'});
    }

    const hashedPassword = await userModel.hashPassword(password);
   
    const user = await userService.createUser({firstName: fullName.firstName, lastName: fullName.lastName, email, password: hashedPassword});

    const token = await user.generateAuthToken();

    res.status(201).json({user, token});



}


module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body; 
    const user  = await userModel.findOne({email}).select('+password');
    // here + password because we set select to false in the schema for pass, so without this password will not be returned

    if(!user) {
        return res.status(401).json({message: 'Invalid email or password'});
    }

    const isMatch = await user.comparePassword(password, user.password);

    if(!isMatch) {
        return res.status(401).json({message: 'Invalid email or password'});
    }// if password does not match 

    const token = await user.generateAuthToken();

    // res.cookie('token', token); // setting the token in the cookie

    res.status(200).json({user, token});
}

module.exports.getUserProfile = async (req, res, next) => {
    // can only be seen by whos profile it is 

    res.status(200).json(req.user);



}

module.exports.logoutUser = async (req, res, next) => {
    // remove the token from the cookie 
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];

    await blackListTokenModel.create({token});

    res.status(200).json({message: 'Logged out successfully'});

}