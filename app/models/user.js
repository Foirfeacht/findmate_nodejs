// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

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
		image: String
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
	notifications: [notificationSchema]

});

var notificationSchema = new Schema({
	_id: {type: Schema.Types.ObjectId},
	content: {type: String},
	owner: {type: Schema.Types.ObjectId, ref: 'User'},
	ownerName: {type: String, ref: 'User'},
	ownerFacebook: {type: String, ref: 'User'},
	ownerVkontakte: {type: String, ref: 'User'},
	created_at: Date,
	status: {type: String, enum: ['Read', 'Unread'], default: 'Unread'},
	ifNew: Boolean,
	_meeting: {type: Schema.Types.ObjectId, ref: 'Meeting'},
	meetingTitle: String,
	meetingStartDate: Date,
	meetingPosition: String,
	meetingLocation: String,
	meetingIcon: String,
	meetingCategory: String,
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
