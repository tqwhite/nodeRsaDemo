'use strict';
const qtoolsGen = require('qtools');
const qtools = new qtoolsGen(module);
const async = require('async');

//START OF moduleFunction() ============================================================

var moduleFunction = function(args) {
	
	const NodeRSA = require('node-rsa');
	const key = new NodeRSA({ b: 2048 }, { environment: 'browser' });
	
	const invalidPrivateKey = key => {
		return false;
	};

	this.decrypt = (dataObjects, status) => {
		let cryptoText = dataObjects.cryptoTextInput.value;

		if (!cryptoText) {
			cryptoText = dataObjects.cryptoTextOutput.value;
		}

		if (cryptoText) {
			dataObjects.cryptoTextInput.domObj.val(cryptoText);
		} else {
			status.text('No crypto text exists');
		}
		console.log('revised 1/2/18');
		let decrypted;
		try {
			decrypted = key.decrypt(cryptoText, 'utf8');
		} catch (e) {
			status.text(e.toString());
			return;
		}

		dataObjects.plainTextOutput.domObj.val(decrypted);
		status.text('text was decrypted');
	};

	this.encrypt = (dataObjects, status) => {
		const plainText = dataObjects.plainTextInput.value;
		
		let decrypted;
		try {
			decrypted = key.decrypt(cryptoText, 'utf8');
		} catch (e) {
			status.text(e.toString());
			return;
		}
		
		const encrypted = key.encrypt(plainText, 'base64');
		dataObjects.cryptoTextOutput.domObj.val(encrypted);
		status.text('text was encrypted');
	};

	this.generateKeys = (dataObjects, status) => {
		key.generateKeyPair();

		const exportedPrivate = key.exportKey('pkcs1-private');
		const exportedPublic = key.exportKey('pkcs1-public');

		dataObjects.privateKey.domObj.val(exportedPrivate);
		dataObjects.publicKey.domObj.val(exportedPublic);
		status.text('new keys created');
	};

	this.extractPublic = (dataObjects, status) => {
		const newPrivateKey = dataObjects.privateKey.value;
		const isInvalidPrivateKey = invalidPrivateKey(newPrivateKey);

		if (isInvalidPrivateKey) {
			status.text(isInvalidPrivateKey);
		} else {
			key.importKey(newPrivateKey, 'pkcs1-private');
			const newPublicKey = key.exportKey('pkcs1-public');
			dataObjects.publicKey.domObj.val(newPublicKey);
			status.text('public key updated');
		}
	};
	
	this.clearThis = (dataObjects, status) => {
		dataObjects.requestingContainer.find('textarea').each((inx, item) => {
			$(item).val('');
		});
		status.text('cleared');
	};
	
	this.clearAll = (dataObjects, status) => {
		$('textarea').each((inx, item) => {
			$(item).val('');
		});
		$('.status').each((inx, item) => {
			$(item).text('everything cleared');
		});
	};
	
	const clearItem = (name, dataObjects, status) => {
		dataObjects[name].domObj.val('');
		status.text('cleared');
	};
	
	this.clearPublicKey = (dataObjects, status) => {
		clearItem('publicKey', dataObjects, status);
	};
	
	this.clearCryptoTextInput = (dataObjects, status) => {
		clearItem('cryptoTextInput', dataObjects, status);
	};
	
	
	
	
	
	
	const validateKeys = (publicKey, privateKey, status) => {
		if (
			privateKey && !privateKey.trim().match(/^-----BEGIN RSA PRIVATE KEY-----/)
		) {
			status.append(
				`Private key is invalid.<br/>It must start with '-----BEGIN RSA PRIVATE KEY-----'<br/>
				Keys not changed.
				`
			);
			return false;
		}

		if (
			publicKey && !publicKey.trim().match(/^-----BEGIN RSA PUBLIC KEY-----/)
		) {
			status.append(
				`Public key is invalid.<br/>It must be pem format, starting with '-----BEGIN RSA PUBLIC KEY-----'<br/>
				Convert .pub with: <span style='color:#666;'>ssh-keygen -f keyName.pub -e -m pem > keyName.pem</span><br/>
				Keys not changed.
				`
			);
			return false;
		}

		return true;
	};
	
	
	this.setKeys = (privateKey, publicKey, status) => {
		if (!validateKeys(publicKey, privateKey, status)) {
			return;
		}

		if (privateKey) {
			key.importKey(privateKey, 'pkcs1-private');
		}

		if (publicKey) {
			key.importKey(publicKey, 'pkcs1-public');
		}

		const exportedPrivate = key.exportKey('pkcs1-private');
		const exportedPublic = key.exportKey('pkcs1-public');

		if (publicKey && privateKey && publicKey.trim() != exportedPublic) {
			status.append(
				'Public key that was entered does NOT match the private key'
			);
		}
	};
	
};

//END OF moduleFunction() ============================================================

window.rsaFunctions = moduleFunction;

