const express = require('express');
const router = express.Router();

const userDishesController = require('../controllers/userDishesController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// Cook dishes (create dishes or increments quantity if already exists) 
// check that user owns the recipe and has the ingredients
// Request body: recipe_id
router.post('/cook/:user_id', 
    jwtMiddleware.verifyToken, 
    userDishesController.checkOwnedRecipes, 
    userDishesController.getRecipeIngredients, 
    userDishesController.getUserIngredients, 
    userDishesController.checkOwnedIngredients, 
    userDishesController.deleteRequiredIngredients, 
    userDishesController.deleteZeroQuantity,
    userDishesController.checkDishDoesNotExist, 
    userDishesController.insertDish);

// GET all dishes by user id
router.get('/:user_id', jwtMiddleware.verifyToken, userDishesController.readAllDishes);

module.exports = router;
