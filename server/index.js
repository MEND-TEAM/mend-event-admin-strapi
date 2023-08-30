let cluster = require('cluster');
let os = require('os');

let app = require('./app');
let config = require('./config');

let port = config.port || 3002
process.title = config.title || 'mend_admin'

let numberOfRequests = 0

// if (cluster.isMaster) {

// 	// let numCPUs = os.cpus().length;
// 	let numCPUs = 1;
	
// 	for (let i = 0; i < numCPUs; i++) {
// 		cluster.fork();
//     }

//     cluster.on('exit', (code, signal) => {
//         if( signal ) {
//             console.log("worker was killed by signal: " + signal);
//         } else if( code !== 0 ) {
//             console.log("worker exited with error code: " + code);
//         } else {
//             console.log("worker success!");
//         }

//         cluster.fork();
//     });

// 	Object.keys(cluster.workers).forEach((id) => {
// 		console.log('creating process with id = ' + cluster.workers[id].process.pid);

// 		//getting message
// 		cluster.workers[id].on('message', (msg) => {
// 			if (msg.cmd && msg.cmd == 'notifyRequest') {
// 				numberOfRequests += 1;
// 			}

// 			console.log("Getting message from process : ", msg.procId);
// 		});

// 		//Getting worker online
// 		cluster.workers[id].on('online', () => {
// 			console.log("Worker pid: " + cluster.workers[id].process.pid + " is online");
// 		});

// 		//printing the listening port
// 		cluster.workers[id].on('listening', (address) => {
// 			console.log("Listening on port + " , address.port);
// 		});

// 	});
    
// } else {
	
// 	/**
// 	 * only express server
// 	 */
// 	console.log(port)
    
// }
app.listen(port, function (err) {
	if (err) {
		console.log('err', err)
		return;
	}
	console.log("mend_admin started success..." + port);
});
