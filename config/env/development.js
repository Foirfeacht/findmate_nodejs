'use strict';

module.exports = {
	db: 'mongodb://localhost:27017/findmate',
	app: {
		title: 'findmates - Development Environment'
	},
	auth: {
		facebook: {
			clientID: '1556663711272087',
			clientSecret: '6b16723e16c35fa758f97baa92dcb720',
			callbackURL: 'http://localhost:8080/auth/facebook/callback'
		},

		vkontakte : {
				clientID		: '4862983',
				clientSecret 	: 'ToCVIhFVKa96FLPgLyJm',
				callbackURL 	: 'https://findmates-demo.herokuapp.com/auth/vk/callback'
			}
	} 
	
};