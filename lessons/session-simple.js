var _ = require('lodash'),
	uid = require('uid-safe');

module.exports = function (options) {

	var store = {};

	var cookieName = 'koa.sid';

	var cookieOptions = {
		httpOnly: true,
		path: '/',
		overwrite: true,
		signed: true,
		maxAge: 24 * 60 * 60 * 1000
	};

	function *loadSession(ctx) {
		var token = ctx.cookies.get(cookieName);

		if (token && _.has(store, token)) {
			ctx.session = store[token];
		}

		if (!ctx.session) {
			ctx.session = {};
		}

		return token;

	}

	function *saveSession(ctx, token) {
		if (!token) {
			token = uid(24);
			ctx.cookies.set(cookieName, token, cookieOptions);
			if (ctx.session) {
				store[token] = ctx.session;
			}
		}

		if (!ctx.session) {
			delete store[token];
		}

	}

	return function *session(next) {

		var token = yield loadSession(this);

		yield next;

		yield saveSession(this, token);

	}

};