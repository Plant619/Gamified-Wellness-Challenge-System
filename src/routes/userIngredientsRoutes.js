const express = require('express');
const router = express.Router();

const userIngredientsController = require('../controllers/userIngredientsController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// GET all ingredients
router.get('/', jwtMiddleware.verifyToken, userIngredientsController.readAllIngredients);

// GET all user ingredients
router.get('/:user_id', jwtMiddleware.verifyToken, userIngredientsController.readIngredientsByUserId);

// POST user ingredient: 
// Request body: ingredient_id
router.post('/buy/:user_id', 
    jwtMiddleware.verifyToken, 
    userIngredientsController.checkIngredientExists, 
    userIngredientsController.checkUserPointsByQuantity, 
    userIngredientsController.deductCost, 
    userIngredientsController.checkAndAddUserIngredient);

module.exports = router;