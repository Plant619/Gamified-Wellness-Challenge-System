const express = require('express');
const router = express.Router();

const userRecipesController = require('../controllers/userRecipesController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// GET:  get all recipes
router.get('/', jwtMiddleware.verifyToken, userRecipesController.readAllRecipes);

// POST: create new user recipe (user can buy new recipe with 100 points earned from challenges)
// Request body: recipe_id
router.post('/buy/:user_id', 
    jwtMiddleware.verifyToken, 
    userRecipesController.checkUserPoints, 
    userRecipesController.checkRecipeExists, 
    userRecipesController.checkUserRecipe, 
    userRecipesController.deductCost, 
    userRecipesController.createUserRecipe);

// GET: get recipe ingredients 
router.get('/ingredient/:recipe_id', jwtMiddleware.verifyToken, userRecipesController.readIngredientByRecipeId)

// GET: get all user recipes
router.get('/:user_id', jwtMiddleware.verifyToken, userRecipesController.readRecipesByUserId);


module.exports = router;