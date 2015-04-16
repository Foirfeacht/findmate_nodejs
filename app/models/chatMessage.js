/**
 * Created by vmaltsev on 4/16/2015.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var chatMessagesSchema = new Schema({
	content: {type: String, required: 'Сообщение не может быть пустым'},
	ownerFacebook: {type: String, ref: 'User'},
	ownerVK: {type: String, ref: 'User'},
	ownerName: { type: String, ref: 'User' },
	owner: { type: Schema.Types.ObjectId, ref: 'User' },
	created_at: Date
});

module.exports = mongoose.model('ChatMessage', chatMessagesSchema);