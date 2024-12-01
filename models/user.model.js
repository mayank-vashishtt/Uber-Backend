const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { use } = require('../app');



const userSchema = new mongoose.Schema({

    fullName: {
        firstName: {
            type: String,
            required: true,
            trim: true,
            minlength: [3, "firstName must be at least 3 characters"],
      
        },
        lastName: {
            type: String,
            trim: true,
            minlength: [3, "lastName must be at least 3 characters"],
      
        }
       
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [5, "email must be at least 5 characters"],
      
    },

    password: {
        type: String,
        required: true,
        select: false,
    },

    socketID:{
        type: String,

    } // for live tracking of the uber driver 




})
//14:00 
// bcrypt -- for hashing passwords and comparing hashed passwords
// jwt -- for generating tokens

userSchema.methods.generateAuthToken = async function () {

    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token ;
}

userSchema.methods.comparePassword = async function (password) {

    return await bcrypt.compare(password, this.password);
}


userSchema.statics.hashPassword = async function (password) {

    return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;

