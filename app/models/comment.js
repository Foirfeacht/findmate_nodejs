/**
 * Created by vmaltsev on 4/27/2015.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

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

module.exports = mongoose.model('Comment', commentsSchema);