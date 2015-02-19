var mongoose = require('mongoose'); 

var Schema = mongoose.Schema;

var meetingsSchema = new Schema({
    title: String,
    description: String,
    //location: String,
    //ownerId: { type: Number, ref: 'User' },
    //ownerName: { type: String, ref: 'User' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
    //visibility: String
});

module.exports = mongoose.model('Meeting', meetingsSchema);