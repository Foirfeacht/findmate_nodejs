// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    facebook: {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
        image        : String
    },

    vkontakte: {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
		image        : String
    },

    firstName: {type: String, trim: true},
    lastName: {type: String, trim: true},
    about: {type: String},

    name:  String,
    image: String,
    email: String,

    roles: {
        type: [{
            type: String,
            enum: ['user', 'admin']
        }],
        default: ['user']
    },
	created: {
		type: Date,
		default: Date.now
	}

});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};



// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
