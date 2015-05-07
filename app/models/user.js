// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;
var Meeting = require('../models/meeting');

// define the schema for our user model
var userSchema = new Schema({

	facebook: {
		id: String,
		token: String,
		email: String,
		name: String,
		image: String
	},

	vkontakte: {
		id: String,
		token: String,
		email: String,
		name: String,
		image: String,
		image2: String,
		image3: String,
		image1: String,
		image4: String
	},

	firstName: {type: String, trim: true},
	lastName: {type: String, trim: true},
	about: {type: String},

	name: String,
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
	},
	settings: {
		distance: {type: Number, default: 20000},
		sendEmailNotifications: {type: Boolean, default: false}
	},
	notifications: [notificationSchema]

});

var notificationSchema = new Schema({
	_id: {type: Schema.Types.ObjectId},
	content: {type: String},
	owner: {type: Schema.Types.ObjectId, ref: 'User'},
	created_at: Date,
	status: {type: String, enum: ['Read', 'Unread', 'Joined', 'Declined'], default: 'Unread'},
	ifNew: Boolean,
	meeting: {type: Schema.Types.ObjectId, ref: 'Meeting'},
	messageType: {type: String, enum: ['Message', 'Notification'], default: 'Message'}
});

// generating a hash
userSchema.methods.generateHash = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.local.password);
};


// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
