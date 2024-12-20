const  userModel  = require('../models/user.model');    
const bcrpyt = require('bcryptjs');
const jwt = require('jsonwebtoken');   
const blacklistTokenModel = require('../models/blacklistToken.model');   
const captainModel = require('../models/captain.model');

module.exports.authUser = async (req, res, next) => {
    //token can be in header or cookies 

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if(!token) {
        return res.status(401).json({message: 'No token, authorization denied'});
    }

    const isBlacklisted = await blacklistTokenModel.finfOne({token : token});

    if(isBlacklisted) {
        return res.status(401).json({message: 'Unauthorized'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = userModel.findById(decoded._id);

        req.user = user;
        return next();


        
    } catch (err) {
        console.error(err);
        res.status(401).json({message: 'Unauthorized'});
        
    }
}

module.exports.authCaptain = async (req, res, next) => {    
    //token can be in header or cookies 

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if(!token) {
        return res.status(401).json({message: 'No token, authorization denied'});
    }

    const isBlacklisted = await blacklistTokenModel.finfOne({token : token});

    if(isBlacklisted) {
        return res.status(401).json({message: 'Unauthorized'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = captainModel.findById(decoded._id);

        req.captain = captain;
        return next();  
    }
    catch (err) {
        console.error(err);
        res.status(401).json({message: 'Unauthorized'});
    }
}