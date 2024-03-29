const express = require('express');
let router = express.Router({mergeParams: true});

let import_persons = require('./import_persons.js');

router.post('/persons', async function (req, res) {
	let personsFile;
	let uploadPath;

	const event_id = req.params['id'];
	if( !event_id ) {
		return res.status(404).send('No event found.');
	}

	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send('No files were uploaded.');
	}

	personsFile = req.files.personsFile;
	separator = req.body.separator || ';';

	try {
		uploadPath = __dirname + '/data/' + personsFile.name;
		await personsFile.mv(uploadPath);
	}
	catch( err ) {
		console.error( 'Error moving uploaded file');
		return res.status(500).send(err);
	}

	try {
		console.log( 'importing persons from %s', uploadPath);
		let stats = await import_persons(uploadPath, event_id, {separator: separator});
		console.log('persons imported');
	}
	catch( err ) {
		console.error( 'Error importing persons');
		return res.status(500).send(err);
	}

	res.send('File uploaded!');
});

module.exports = router;