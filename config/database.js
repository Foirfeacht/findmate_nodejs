// config/database.js
var database = {

	development: {
		'url' : 'mongodb://localhost:27017/findmate'
	},

	production: {
		'url' : 'mongodb://admin:vitmal1991@ds033897.mongolab.com:33897/heroku_app34769764'
	}

	//'url' : 'mongodb://admin:vitmal1991@ds033897.mongolab.com:33897/heroku_app34769764' || 'mongodb://localhost:27017/findmate'
	//'url' : 'mongodb://localhost:27017/findmate'

};

module.exports.database = database;