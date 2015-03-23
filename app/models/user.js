// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

// define the schema for our user model
var userSchema = mongoose.Schema({

<<<<<<< HEAD
    meetings: [
    	{_meeting : { type: Schema.Types.ObjectId, ref: 'Meeting' }}
    ],
=======
    //meetings: [
    //	{ type: Schema.Types.ObjectId, ref: 'Meeting' },
    //],
>>>>>>> bf8daed748d45b03b2fce08defc1663551a159f5

    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
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
