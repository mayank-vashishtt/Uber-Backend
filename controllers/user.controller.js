const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const {validationResult} = require('express-validator');    





module.exports.registerUser = async (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    console.log(req.body);
    

    const {fullName, email, password} = req.body;

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

    res.status(200).json({user, token});
}

module.exports.getUserProfile = async (req, res, next) => {
    // can only be seen by whos profile it is 

    
}