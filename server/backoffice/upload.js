const express = require('express');
let router = express.Router();

let import_persons = require('./import_persons.js');

router.post('/persons', async function (req, res) {
	let sampleFile;
	let uploadPath;

	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send('No files were uploaded.');
	}

	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	sampleFile = req.files.sampleFile;
	uploadPath = __dirname + '/data/' + sampleFile.name;

	// Use the mv() method to place the file somewhere on your server
	try {
		await sampleFile.mv(uploadPath);
	}
	catch( err ) {
		console.error( 'Error moving uploaded file');
		return res.status(500).send(err);
	}

	try {
		console.log( 'importing persons from %s', uploadPath);
		let stats = await import_persons(uploadPath);
		console.log('persons imported');
	}
	catch( err ) {
		console.error( 'Error importing persons');
		return res.status(500).send(err);
	}

	res.send('File uploaded!');
});

module.exports = router;