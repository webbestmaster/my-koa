var _ = require('lodash'),
	uid = require('uid-safe'),
	model = require('./session-model');

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

	var isMigrated = false;

	function *loadSession(ctx) {

		var token = ctx.cookies.get(cookieName);

		if (token) {
			// ctx.session = store[token];
			ctx.session = yield model.findByToken(token);
		}

		if (!ctx.session) {
			ctx.session = {};
		}

		return token;

	}

	function *saveSession(ctx, token) {

		var isNew = false;

		if (!token) {
			isNew = true;
			token = yield uid(24);
			ctx.cookies.set(cookieName, token, cookieOptions);
			if (ctx.session) {
				// store[token] = ctx.session;

				if (isNew) {
					yield model.add(token, ctx.session);
				} else {
					yield model.update(token, ctx.session);
				}

			}
		}

		if (!ctx.session) {
			// delete store[token];
			yield model.remove(token);
		}

	}

	return function *session(next) {

		if (!isMigrated) {
			yield model.tryMigrate();
			isMigrated = true;
		}

		var token = yield loadSession(this);

		yield next;

		yield saveSession(this, token);

	}

};