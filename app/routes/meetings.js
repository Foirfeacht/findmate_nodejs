var express = require('express');
var mongoose = require('mongoose');

// load up the user model
var User       = require('../models/user');
// and event model
var Meeting    = require('../models/meeting');

	app.get('/meetings/index', function (req, res) {
		res.render('../../views/meetings/index.html');
	})

// get all meetings
    app.get('/meetings', function(req, res) {

        // use mongoose to get all meetings in the database
        Todo.find(function(err, meetings) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(meetings); // return all meetings in JSON format
        });
    });

    // create meeting and send back all meetings after creation
    app.post('/meetings', function(req, res) {

        // create a meeting, information comes from AJAX request from Angular
        Meeting.create({
            title : req.body.title,
            description: req.body.description
        }, function(err, meeting) {
            if (err)
                res.send(err);

            // get and return all the meetins after you create another
            Meeting.find(function(err, meetings) {
                if (err)
                    res.send(err)
                res.json(meetings);
            });
        });

    });

    // delete a meeting
    app.delete('/meetings/:meeting_id', function(req, res) {
        Meeting.remove({
            _id : req.params.meeting_id
        }, function(err, meeting) {
            if (err)
                res.send(err);

            // get and return all the meetings after you create another
            Meeting.find(function(err, meetings) {
                if (err)
                    res.send(err)
                res.json(meetings);
            });
        });
    });



// =============================================================================
// CRUD ACTIONS FOR EVENTS MODEL ==================================================
// =============================================================================
// 
/*exports.create = function ( req, res ){
  new Meeting({
    itle : req.body.title,
    description    : req.body.description,
    updated_at : Date.now()
  }).save( function( err, todo, count ){
    res.redirect( '/meetings' );
  });
};

exports.index = function ( req, res ){
  res.render( '../views/meetings/index.ejs');
};
*/
/*module.exports = function(app){
	app.get('/events', function(req, res) {
		Event.find(function (err, eve) {
		    if (err) return next(err);
		    res.json(events);
		  });
	    //res.render('events/index.ejs')
	});

	

	app.get('/events/:id', function(req, res) {
	    res.send('This is not implemented now');
	});

	app.put('/events/:id', function (req, res){
	    res.send('This is not implemented now');    
	});

	app.delete('/events/:id', function (req, res){
	    res.send('This is not implemented now');
	});
};*/