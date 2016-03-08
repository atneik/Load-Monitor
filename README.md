Load Monitor
===============

Monitor load average on your *nix machine.

### Instructions

1. Installation
We would need [npm](https://www.npmjs.com/) to get all required packages. The [npm](https://www.npmjs.com/) command-line tool is bundled with [Node.js](https://nodejs.org). If you have it installed, then you already have npm too. If not, go download [Node.js](https://nodejs.org). Now, go to the root of the project and:

		$ npm install

2. Run 
	- Start node
	
			$ npm start

		This will run a node server serving the web app and a socket to deliver real-time load averages to the client.

	- Test

		This project uses [Mocha](https://mochajs.org/) to run test cases. The following command will start asset test cases on Alert (as of now).

			$ npm test

### Future Improvements
- A more sophisticated Alerting system which takes in multiple parameters to track and gives unique Ids to each identify alert so as to better track and resolve.
- Debate about using sockets/websockets?
- Use of [cubism](https://square.github.io/cubism/)?
