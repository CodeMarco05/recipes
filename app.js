const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const Recipe = require('./models/Recipe');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())

const port = 3000;

const dbConnectorString = process.env.CONNECTION_MONGO_DB;

if (!dbConnectorString) {
    console.error('MongoDB connection string is not defined in .env file');
    process.exit(1);
}

// Connect to the specified database
mongoose.connect(dbConnectorString)
    .then(() => {
        console.log('Connected to DB');
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to DB:', err);
    });

app.get('/', (req, res) => {
    res.json({
        message: "Endpoint for the recipes API. This is connected to a database to fetch the latest dishes for you"
    });
});

// Get all entries
app.get('/recipes', async (req, res) => {
    //check if key is correct
    const key = req.query.key;
    if (key !== process.env.API_KEY) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const recipes = await Recipe.find();
        res.status(200).json(recipes);
    } catch (error) {
        console.error('Error getting recipes:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Get one entry by ID
app.get('/recipes/:id', async (req, res) => {
    //check if key is correct
    const key = req.query.key;
    if (key !== process.env.API_KEY) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const { id } = req.params;
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return res.status(404).send('Recipe not found');
        }
        res.status(200).json(recipe);
    } catch (error) {
        console.error('Error getting recipe:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Update one entry by ID
app.put('/recipes/:id', async (req, res) => {
    //check if key is correct
    const key = req.query.key;
    if (key !== process.env.API_KEY) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const { id } = req.params;
        const data = req.body;
        console.log(data)
        const updatedRecipe = await Recipe.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!updatedRecipe) {
            return res.status(404).send('Recipe not found');
        }
        res.status(200).json(updatedRecipe);
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Insert new recipe
app.post('/insertRecipe', async (req, res) => {
    //check if key is correct
    const key = req.query.key;
    if (key !== process.env.API_KEY) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const data = req.body;
        if (!data) {
            return res.status(400).send('No data provided');
        }

        const recipe = new Recipe(data);
        await recipe.save();

        res.status(201).send('Recipe saved successfully');
    } catch (error) {
        console.error('Error saving recipe:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Delete one entry by ID
app.delete('/recipes/:id', async (req, res) => {
    //check if key is correct
    const key = req.query.key;
    if (key !== process.env.API_KEY) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const { id } = req.params;
        const deletedRecipe = await Recipe.findByIdAndDelete(id);
        if (!deletedRecipe) {
            return res.status(404).send('Recipe not found');
        }
        res.status(200).json(deletedRecipe);
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).send('Internal Server Error');
    }
});
