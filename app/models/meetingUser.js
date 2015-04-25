/**
 * Created by vmaltsev on 4/25/2015.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var meetingUsersSchema = new Schema({
	firstName: String,
	lastName: String,

	name:  String,
	image: String,
	email: String,

	status: {
		type: [{
			type: String,
			enum: ['joined', 'invited']
		}]
	}
});

module.exports = mongoose.model('meetingUser', meetingUsersSchema);


