const dotenv = require('dotenv')

const express = require('express')

const mongoose = require('mongoose')

const Recipe = require('./models/Recipe')


const app = express()
app.use(express.json())

const port = 3000;

dotenv.config()

const dbConnectorString = process.env.CONNECTION_MONGO_DB

//start the setup for the server
mongoose.connect(dbConnectorString)
    .then((result) => {
        console.log('Connected to DB')

        //then start the server
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`)
        })
    })
    .catch((err) => {
        console.log(err)
    })


app.get('/', (req, res) => {
    res.json({
        message: "Endpoint for the recipes api. This is connected to a database to fetch the latest dishes for you"
    })
})

app.post('/insertRecipe', async (req, res) => {
    try {
        const data = req.body;
        if (!data) {
            return res.status(400).send('No data provided');
        }
        console.log(data)
        const recipe = new Recipe(data);
        await recipe.save();

        res.status(201).send('Recipe saved successfully');
    } catch (error) {
        console.error('Error saving recipe:', error);
        res.status(500).send('Internal Server Error');
    }
});

