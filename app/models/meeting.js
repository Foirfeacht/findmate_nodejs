var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var meetingsSchema = new Schema({
    title: {type: String, required: 'Заголовок не может быть пустым'},
    description: {type: String, default: ''},
    category: {type: String, default: 'Развлечения'},
    startDate: Date,
	invitedUsers: {type: Array, default: []},
	joinedUsers: {type: Array, default: []},
    _owner: { type: Schema.Types.ObjectId, ref: 'User' },
    ownerFacebook: {type: String, ref: 'User'},
    ownerVK: {type: String, ref: 'User'},
    ownerName: { type: String, ref: 'User' },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: null },
    longitude: String,
    latitude: String,
    position: String,
    location: String,
    marker: Schema.Types.Mixed,
    visibility: {type: String, default: 'Общие'},
	comments: [commentsSchema]
});

var commentsSchema = new Schema({
	content: {type: String, required: 'Сообщение не может быть пустым'},
	owner: { type: Schema.Types.ObjectId, ref: 'User' },
	ownerName: { type: String, ref: 'User' },
	ownerFacebook: {type: String, ref: 'User'},
	ownerVkontakte: {type: String, ref: 'User'},
	owner: { type: Schema.Types.ObjectId, ref: 'User' },
	created_at: Date
});

module.exports = mongoose.model('Meeting', meetingsSchema);