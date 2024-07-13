const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')


const RecipeModel = require('./models/recipe_model');
const coloredPrint = require('./lib/colored_print');

//routes for the server
const recipeRoutes = require('./lib/routes/recipe');

//starting prints
if(process.env.MODE == 'production') {
	coloredPrint.blue('Starting in production mode');
	dotenv.config({ path: './.env.production'});
}else {
	coloredPrint.yellow('Starting in development mode');
	dotenv.config({ path: './.env.development'});
}

//setups
const app = express();

app.use(express.json());
app.use(cors());

//bind the routes to the server and setup the middleware
app.use('/recipes', checkApiKey, recipeRoutes);

const port = 3000;
const dbConnectorString = process.env.CONNECTION_MONGO_DB;

if (!dbConnectorString) {
	coloredPrint.red('MongoDB connection string is not defined in .env file');
	process.exit(1);
}

// Connect to the specified database
mongoose.connect(dbConnectorString)
	.then(() => {
		coloredPrint.blue('Connected to DB');
		//start the server
		app.listen(port, () => {
			coloredPrint.blue('Server is running on http://localhost:' + port);
		})
	})
	.catch((err) => {
		coloredPrint.red('Failed to connect to DB:', err);
	});

app.get('/', (req, res) => {
	res.json({
		message: "Endpoint for the recipes API. This is connected to a database to fetch the latest dishes for you"
	});
});

function checkApiKey(req, res, next) {
	//check if key is in .env file
	if (!process.env.API_KEY) {
		coloredPrint.yellow('Server does not have an API key => is running in dev mode');
		next();
		return;
	}
	const key = req.query.key;
	if (key !== process.env.API_KEY) {
		return res.status(401).send('Unauthorized');
	}
	next();
}








