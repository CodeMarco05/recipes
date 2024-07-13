
const RecipeModel = require('../../models/recipe_model');

// Get all entries
exports.getRecipes = async (req, res) => {
	//check if key is correct
	const key = req.query.key;
	if (key !== process.env.API_KEY) {
		return res.status(401).send('Unauthorized');
	}

	try {
		const recipes = await RecipeModel.find();
		res.status(200).json(recipes);
	} catch (error) {
		console.error('Error getting recipes:', error);
		res.status(500).send('Internal Server Error');
	}
};

// Get one entry by ID
exports.getRecipe = async (req, res) => {
  //check if key is correct
  const key = req.query.key;
  if (key !== process.env.API_KEY) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const { id } = req.params;
    const recipe = await RecipeModel.findById(id);
    if (!recipe) {
      return res.status(404).send('Recipe not found');
    }
    res.status(200).json(recipe);
  } catch (error) {
    console.error('Error getting recipe:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Update one entry by ID
exports.updateRecipe = async (req, res) => {
  //check if key is correct
  const key = req.query.key;
  if (key !== process.env.API_KEY) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const { id } = req.params;
    const data = req.body;

    if (!data) {
      return res.status(400).send('No data provided');
    }

    const updatedRecipe = await RecipeModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updatedRecipe) {
      return res.status(404).send('Recipe not found');
    }
    res.status(200).json(updatedRecipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).send('Internal Server Error');
  }
};


// Insert new recipe
exports.createRecipe = async (req, res) => {
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

    const recipe = new RecipeModel(data);
    const response = await recipe.save();

    res.status(201).send('Recipe saved successfully');
  } catch (error) {
    console.error('Error saving recipe:', error);
    res.status(500).send('Internal Server Error');
  }
};


// Delete one entry by ID
exports.deleteRecipe = async (req, res) => {
  //check if key is correct
  const key = req.query.key;
  if (key !== process.env.API_KEY) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const { id } = req.params;
    const deletedRecipe = await RecipeModel.findByIdAndDelete(id);
    if (!deletedRecipe) {
      return res.status(404).send('Recipe not found');
    }
    res.status(200).json(deletedRecipe);
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).send('Internal Server Error');
  }
};