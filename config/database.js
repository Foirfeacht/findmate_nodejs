// config/database.js
module.exports = {

	development: {

		'url' : 'mongodb://localhost:27017/findmate' // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
	},

	production: {
		'url' : 'mongodb:heroku_app34769764:vitmal1991@ds033897.mongolab.com:33897/heroku_app34769764'
	}
	// heroku mongolab db
	//'url' : 'mongodb:heroku_app34769764:vitmal1991@ds033897.mongolab.com:33897/heroku_app34769764' 

};