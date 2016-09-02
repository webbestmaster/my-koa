var request = require('co-supertest'),
	koa = require('koa'),
	session = require('./../session');

require('co-mocha');

var app = koa();

app.keys = ['secret key here'];


app.use(session());

app.use(function *() {

	switch (this.request.url) {

		case '/setname':
			this.body = this.session.userName = 'James';
			break;

		case '/getname':
			this.body = this.session.userName;
			break;

		case '/clear':
			this.session = null;
			this.status = 204;
			break;

	}



});

var server = app.listen();

describe('Testing rethinkDB middleware', function () {

	describe('Set Session Value', function () {

		var agent;

		before(function *() {
			agent = request.agent(server);
		});

		it('Should set name in session object', function *() {

			yield agent
				.get('/setname')
				.expect(200)
				.end();

		});

	});

	describe('Retrieve Session Value', function () {

		var agent;

		before(function *() {

			agent = request.agent(server);

			yield agent
				.get('/setname')
				.expect(200)
				.end();
		});

		it('Should find the userName in the session', function *() {

			yield agent
				.get('/getname')
				.expect('James')
				.end();

		});

	});

	describe('Destroy Session', function () {

		var agent;

		before(function *() {

			agent = request.agent(server);

			yield agent
				.get('/setname')
				.expect(200)
				.end();

		});

		it('Should not find userName', function *() {

			yield agent
				.get('/getname')
				.expect('James')
				.end();

			yield agent
				.del('/clear')
				.expect(204)
				.end();

			yield agent
				.get('/getname')
				.expect('')
				.end();

		});

	});




});
