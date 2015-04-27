var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//var commentsSchema = require('../models/comment')

//var meetingUsersSchema = require('../../app/models/meetingUser')

var meetingsSchema = new Schema({
	title: {type: String, required: 'Заголовок не может быть пустым'},
	description: {type: String, default: ''},
	category: {
		value_: {
			ru: {type: String, default: 'Развлечения'},
			en: {type: String, default: 'Entertainment'}
		},
		icon: {type: String, default: 'entertainment'}
	},
	startDate: Date,
	invitedUsers: {type: Array, default: []},
	joinedUsers: {type: Array, default: []},
	_owner: {type: Schema.Types.ObjectId, ref: 'User'},
	ownerFacebook: {type: String, ref: 'User'},
	ownerVK: {type: String, ref: 'User'},
	ownerName: {type: String, ref: 'User'},
	created_at: {type: Date, default: Date.now()},
	updated_at: {type: Date, default: null},
	longitude: String,
	latitude: String,
	position: String,
	location: String,
	icon: String,
	marker: Schema.Types.Mixed,
	visibility: {type: String, default: 'all'},
	comments: [commentsSchema]
});

var commentsSchema = new Schema({
	_id: {type: Schema.Types.ObjectId},
	content: {type: String, required: 'Сообщение не может быть пустым'},
	owner: {type: Schema.Types.ObjectId, ref: 'User'},
	ownerName: {type: String, ref: 'User'},
	ownerFacebook: {type: String, ref: 'User'},
	ownerVkontakte: {type: String, ref: 'User'},
	owner: {type: Schema.Types.ObjectId, ref: 'User'},
	created_at: Date
});


module.exports = mongoose.model('Meeting', meetingsSchema);