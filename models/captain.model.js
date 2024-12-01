
const moongose = require('mongoose');
const bcrpyt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const captainSchema = new moongose.Schema({

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
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Invalid email"],
        
      
    },

    password: {
        type: String,
        required: true,
        select: false,
    },

    socketID:{
        type: String,

    },
    
    status:{
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'

    },

    vechicle:{
        color:{
            type: String,
            required: true,
            trim: true,
            minlength: [3, "color must be at least 3 characters"],
        }, 
        plate:{
            type: String,
            required: true,
            trim: true,
            minlength: [3, "plate must be at least 3 characters"],
        },

        capacity:{
            type: Number,
            required: true,
            min: [1, "capacity must be at least 1"],
        },

        vechileType:{
            type: String,
            required: true,
            enum: ['car', 'motorcycle', 'auto'],
            required: true,
        },

        location:{
            lat:{
                type: Number,
                
            },
            lng:{
                type: Number,
                
            }


        }


    }
    // for live tracking of the uber driver
})

captainSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token ;


}

captainSchema.methods.comparePassword = async function (password) {
    return await bcrpyt.compare(password, this.password);
}

captainSchema.statics.hashPassword = async function (password) {
    return await bcrpyt.hash(password, 10);
}    


const captainModel = moongose.model('Captain', captainSchema);

module.exports = captainModel;
