var app = require('koa')();
var router = require('koa-router')();


router.get('/', function *(next) {
	console.log('SSS');
	this.body += 'yes!!';
	yield next; // use next
});






app
	.use(router.routes())
	.use(router.allowedMethods());




app.use(function *(next) {
	console.log('//');
	this.body += 'n1o!!';
	yield next;
});



app.listen(3000);
