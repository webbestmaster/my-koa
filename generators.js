var fs = require('fs');


function readFile(filepath){
	return function(callback){
		fs.readFile(filepath, callback);
	}
}

function *runMe() {

	var dd = yield function(callback){
		fs.readFile('/etc/hosts', 'utf-8', callback);
	};
	console.log(dd);

	yield readFile('/etc/hosts');
	yield readFile('/etc/hosts');

}


var ff = runMe();


console.log(ff.next().value.toString());
console.log(ff.next());
console.log(ff.next());
console.log(ff.next());