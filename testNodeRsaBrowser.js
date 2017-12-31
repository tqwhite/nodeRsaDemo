'use strict';

const fs = require('fs');
const nodeRsa = require('node-rsa');
//LOCAL FUNCTIONS ====================================

const writeKeys = key => {
	const keyThing = key.exportKey('components');
	const exportedPrivate = key.exportKey('pkcs1-private');
	const exportedPublic = key.exportKey('pkcs1-public');
	$('#comparisonResult').append(
		'<div>New keys generated were used for test and written into textareas above.</div>'
	);
	$('#privateKey').text(exportedPrivate).css('border', '1pt solid blue');
	$('#pemKey').text(exportedPublic).css('border', '1pt solid blue');
};

window.runRsaDemo = (testName, text, privateKeyInbound, publicKeyInbound) => {
	if (!publicKeyInbound.match(/^-----BEGIN RSA PUBLIC KEY-----/)) {
		$('#comparisonResult').append(
			'<div style="color:red;margin-top:20px;">public key has to be in pem format, use: ssh-keygen -f keyName.pub -e -m pem > keyName.pem</div>'
		);
	} else {
		const NodeRSA = require('node-rsa');
		const key = new NodeRSA({ b: 2048 }, { environment: 'browser' });

		switch (testName) {
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

		switch (testName) {
			case 'privateKeyInbound':
				key.importKey(publicKeyInbound, 'pkcs1-public'); //also works with private key
				break;
			case 'publicKeyInbound':
				const exportedPublic = key.exportKey('pkcs1-public');
				key.importKey(privateKeyInbound, 'pkcs1-private');
				//note: this overwrites the previously imported public key with the one implicit in the new private key
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
			$('#comparisonResult').append(
				`<div style='color:red;margin-top:20px;'>${e.toString()}</div>`
			);
		}

		if (decrypted == text) {
			console.log(`\nIT WORKS. Plaintext and Decrypted MATCH!! (${testName})`);
			$('#comparisonResult').append(
				`<div style='color:green;margin-top:20px;'>IT WORKS. Plaintext and Decrypted MATCH!! (${testName})</div>`
			);
		} else {
			console.log(`\n== Decrypted does not match test string (${testName}) ==`);
			$('#comparisonResult').append(
				`<div style='color:red;margin-top:20px;'>== Decrypted does not match test string (${testName}) ==</div>`
			);
		}
		console.log('text=' + text + ' [testNodeRsaBrowser.js.]');
		console.log('decrypted=' + decrypted + ' [testNodeRsaBrowser.js.]');
	}
};

window.runRsaDemoInBrowser = testName => {
	const text = $('#testString').val().toString();
	const privateKeyInbound = $('#privateKey').val().toString();
	const publicKeyInbound = $('#pemKey').val().toString();

	console.log(`Commencing Demo Process (${testName})`);
	$('#comparisonResult').html(
		`<div style='color:blue;margin-top:20px;'>Commencing Demo Process (${testName})</div>`
	);
	setTimeout(() => {
		runRsaDemo(testName, text, privateKeyInbound, publicKeyInbound);
	}, 1); //the setTimeout() calls allow the DOM to update before the cpu intensive process, purely cosmetic
};

