const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const userController = require('../controllers/userController');
const wellnessChallengeController = require('../controllers/wellnessChallengeController');
const userCompletionController = require('../controllers/userCompletionController');
const userDishesController = require('../controllers/userDishesController');
const userIngredientsController = require('../controllers/userIngredientsController');
const userRecipesController = require('../controllers/userRecipesController');
const userCreaturesController = require('../controllers/userCreaturesController');


// POST: Add new ingredients
// Request body: ingredient_name, rarity, description 
// Response: ingredient_id, ingredient_name, rarity, description 
router.post('/ingredients/:user_id', 
    jwtMiddleware.verifyToken, 
    adminController.checkAdmin, 
    adminController.checkIngredientDoesNotExist, 
    adminController.createIngredients);

// POST: Add new recipes
// Request body: recipe_name
// Response: recipe_id, recipe_name
router.post('/recipes/:user_id', 
    jwtMiddleware.verifyToken, 
    adminController.checkAdmin, 
    adminController.checkRecipeDoesNotExist, 
    adminController.createRecipes);

// POST: Add new creatures
// Request body: creature_name, favourite_food, hated_food 
// Response: creature_id, creature_name, favourite_food, hated_food
router.post('/creatures/:user_id', 
    jwtMiddleware.verifyToken, 
    adminController.checkAdmin, 
    adminController.checkCreatureDoesNotExist, 
    adminController.checkFavAndHatedExist, 
    adminController.createCreatures);

    
// POST: Add ingredients to a recipe
// Request body: recipe_id, ingredient_id, quantity (optional, will default to one)
router.post('/recipeIngredients/:user_id', 
    jwtMiddleware.verifyToken, 
    adminController.checkAdmin, 
    adminController.checkRecipeId, 
    adminController.checkIngredientId, 
    adminController.checkRecipeIngredients, 
    adminController.createRecipeIngredients);


// PUT: Update creatures
// Response body: creature_id, creature_name, favourite_food, hated_food
router.put('/creatures/:user_id', 
    jwtMiddleware.verifyToken, 
    adminController.checkAdmin, 
    adminController.checkCreatureName, // so that the creature_name will not have duplicates (other than its own)
    adminController.checkFavAndHatedExist, 
    adminController.updateCreature
)

router.get('/users/:user_id', 
    jwtMiddleware.verifyToken, 
    adminController.checkAdmin, 
    userController.readAllUser);


router.get('/:user_id', adminController.validateAdmin)

// deletes user and challenge records (any challenges user created or completed)
// deletes ingredients, dishes, recipes user owned
router.delete('/:user_id/:banned_user_id', 
    jwtMiddleware.verifyToken, 
    adminController.checkAdmin, 
    wellnessChallengeController.selectChallengeByUserId, 
    userCompletionController.deleteCompletionRecords, 
    userCompletionController.deleteChallengeRecords, 
    wellnessChallengeController.deleteChallengesCreated, 
    userIngredientsController.deleteIngredientByUserId, 
    userRecipesController.deleteRecipeByUserId,
    userDishesController.deleteDishByUserId, 
    userCreaturesController.deleteCreatureByUserId, 
    userController.deleteUser
)

module.exports = router;
