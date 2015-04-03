// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	//development: {

		'facebookAuth' : {
			'clientID' 		: '1556663711272087', // your App ID
			'clientSecret' 	: '6b16723e16c35fa758f97baa92dcb720', // your App Secret
			'callbackURL' 	: 'https://findmates-demo.herokuapp.com/auth/facebook/callback' || 'http://localhost:8080/auth/facebook/callback'
			//'profileFields' : ['user_friends']
		}
	//},

	/*production: {
		'facebookAuth' : {
			'clientID' 		: '1556663711272087', // your App ID
			'clientSecret' 	: '6b16723e16c35fa758f97baa92dcb720', // your App Secret
			'callbackURL' 	: 'https://findmates-demo.herokuapp.com/auth/facebook/callback'
			//'profileFields' : ['user_friends']
		}
	}*/
};