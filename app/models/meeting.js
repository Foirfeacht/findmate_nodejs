var mongoose = require('mongoose'); 
//var User     = require('./user.js');

var Schema = mongoose.Schema; 

var meetingsSchema = new Schema({
    title: String,
    description: String,
    category: String,
    startDate: Date,
    startTime: String,
    _owner: { type: Schema.Types.ObjectId, ref: 'User' },
    ownerName: { type: String, ref: 'User' },
    /*participants: [{
        _id: { type: Schema.Types.ObjectId, ref: 'User' },
        name: {type: String, ref: 'User'}
    }],*/
    invitedUsers: {type: Array, default: []},
    participants: {type: Array, default: []},
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },
    active: { type: Boolean, default: true },
    participants: [
            { _participantId : { type: Schema.Types.ObjectId, ref: 'User' },
              participantName : { type: String, ref: 'User' }
             }
        ],
    longitude: String,
    latitude: String,
    position: String,
    location: String,
    marker: Schema.Types.Mixed,
    visibility: String
});

module.exports = mongoose.model('Meeting', meetingsSchema);