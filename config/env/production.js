'use strict';

module.exports = {
	db: 'mongodb://admin:vitmal1991@ds033897.mongolab.com:33897/heroku_app34769764',
	auth: {
		facebook: {
			clientID: '1556663711272087',
			clientSecret: '6b16723e16c35fa758f97baa92dcb720',
			callbackURL: 'https://findmates-demo.herokuapp.com/auth/facebook/callback'
		},
		vkontakte : {
			clientID		: '4862983',
			clientSecret 	: 'ToCVIhFVKa96FLPgLyJm',
			callbackURL 	: 'https://findmates-demo.herokuapp.com/auth/vk/callback'
		}
	}
};
