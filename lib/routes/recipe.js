const express = require('express');
const router = express.Router(); 
const recipeController = require('../controllers/recipe_controller');

router.get('/', recipeController.getRecipes);
router.post('/', recipeController.createRecipe);
router.get('/:id', recipeController.getRecipe);
router.put('/:id', recipeController.updateRecipe);
router.delete('/:id', recipeController.deleteRecipe);


module.exports = router;
