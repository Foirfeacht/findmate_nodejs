// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

		'facebookAuth' : {
			'clientID' 		: '1556663711272087', // your App ID
			'clientSecret' 	: '6b16723e16c35fa758f97baa92dcb720', // your App Secret
<<<<<<< HEAD
			'callbackURL' 	: 'http://localhost:8080/auth/facebook/callback'
			//'callbackURL' 	: 'https://findmates-demo.herokuapp.com/auth/facebook/callback'
		},
=======
			'callbackURL' 	: 'https://findmates-demo.herokuapp.com/auth/facebook/callback' || 'http://localhost:8080/auth/facebook/callback'
			//'profileFields' : ['user_friends']
		}
	//},
>>>>>>> 2c9e4519cbf665a63b051af072567a269cc184c2

		'vkontakteAuth' : {
			'clientID' 		: '4861186', // your App ID
			'clientSecret' 	: 'FRpAtbUmK7GPGoZlBh9K', // your App Secret
			'callbackURL' 	: 'https://findmates-demo.herokuapp.com/auth/vk/callback'
		}

};