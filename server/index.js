const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
let db = require('./db');
let options = require('./options.js')

const app = express();
const port = 3000;

// Where we will keep books
let books = [];

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const api = require('./api');
app.use( '/api', api );

async function start_server() {
	console.log( 'Connecting to database...' );
	await db.init(options.database);
	console.log( 'Starting server...');
	app.listen(port, () => console.log(`\tstarted. Visit http://localhost:${port}`));
}

start_server();
