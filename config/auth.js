// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '1556663711272087', // your App ID
		'clientSecret' 	: '6b16723e16c35fa758f97baa92dcb720', // your App Secret
		'callbackURL' 	: 'http://localhost:8080/auth/facebook/callback',
		'profileFields' : ['displayName', 'link', 'photos', 'username']
	}
};