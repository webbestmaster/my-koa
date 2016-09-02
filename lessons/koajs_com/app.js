var koa = require('koa');
var app = koa();

var router = require('koa-router');

app.keys = ['im a newer secret', 'i like turtle'];

app.use(function *(next) {
	var start = new Date;
	yield next;
	var ms = new Date - start;
	this.set('X-Response-Time', ms + 'ms');
});

// logger®

app.use(function *(next) {
	var start = new Date;
	yield next;
	this.cookies.set('name', 'tobi', { signed: true });

	var ms = new Date - start;
	console.log('%s %s - %s', this.method, this.url, ms);
});

// response

app.use(function *() {
	this.body = 'Hello World';
	this.body += app.proxy;
});

app.listen(3000);