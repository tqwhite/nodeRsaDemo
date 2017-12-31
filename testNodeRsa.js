'use strict';
const fs = require('fs');

const nodeRsa = require('node-rsa'); 
 //LOCAL FUNCTIONS ====================================

const writeKeys = key => {
	const keyThing = key.exportKey('components');
	const exportedPublic = key.exportKey('pkcs1-public');
	const exportedPrivate = key.exportKey('pkcs1-private');
	console.log(
		'\n\nGenerated Public=\n\n' +
			exportedPublic +
			'\n\n [testNodeRsa.js.moduleFunction]'
	);
	console.log(
		'\n\nGenerated Private=\n\n' +
			exportedPrivate +
			'\n\n [testNodeRsa.js.moduleFunction]'
	);
};

//MAIN THING ====================================

const test = 'publicKeyInbound';

const text = fs.readFileSync('testNodeRsa.js').toString();
const privateKeyInbound = fs.readFileSync('nodeTestKeys/test1').toString();
const publicKeyInbound = fs.readFileSync('nodeTestKeys/test1.pem').toString();

if (!publicKeyInbound.match(/^-----BEGIN RSA PUBLIC KEY-----/)) {
	console.log(
		'key has to be in pem format, use: ssh-keygen -f keyName.pub -e -m pem > keyName.pem'
	);
	process.exit(1);
}

const NodeRSA = require('node-rsa');
const key = new NodeRSA({ b: 2048 }, { environment: 'browser' });

switch (test) {
	case 'privateKeyInbound':
		key.importKey(privateKeyInbound, 'pkcs1-private');
		break;
	case 'publicKeyInbound':
		key.importKey(publicKeyInbound, 'pkcs1-public');

		break;
	case 'generatePair':
		key.generateKeyPair();
		writeKeys(key);
		break;
}

let encrypted = key.encrypt(text, 'base64');


switch (test) {
	case 'privateKeyInbound':
		key.importKey(publicKeyInbound, 'pkcs1-public'); //also works with private key
		break;
	case 'publicKeyInbound':
		key.importKey(privateKeyInbound, 'pkcs1-private');
		break;
	case 'generatePair':
		//uses key generated above
		break;
}

let decrypted;
try {
	decrypted = key.decrypt(encrypted, 'utf8');
} catch (e) {
	console.log(`\n${e.toString()}`);
}

if (decrypted == text) {
	console.log(`\nIT WORKS. THEY MATCH!! (${test})`);
} else {
	console.log(`\n== Decrypted does not match test string (${test}) ==`);
}  

