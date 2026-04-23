const express = require('express');
const router = express.Router();

const userCreaturesController = require('../controllers/userCreaturesController');
const userRecipesController = require('../controllers/userRecipesController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// GET all creatures
router.get('/', jwtMiddleware.verifyToken, userCreaturesController.readAllCreatures);

// Shows mood of creature and when they were last fed
router.get('/status/:user_id/:creature_id', jwtMiddleware.verifyToken, userCreaturesController.calculateMood);

router.get('/snorlax', jwtMiddleware.verifyToken, userCreaturesController.readCreaturesByCreatureName)

// GET all user creatures
router.get('/:user_id', jwtMiddleware.verifyToken, userCreaturesController.readCreaturesByUserId);


// Feed creature
// Response body: creature_id, recipe_id
router.put('/feed/:user_id', 
    jwtMiddleware.verifyToken, 
    userCreaturesController.checkCreatureExists, 
    userCreaturesController.checkUserHasCookedDish, 
    userCreaturesController.deleteDishUsed, 
    userCreaturesController.checkHatedAndFavFood, 
    userCreaturesController.updateCreaturesFriendship);

// POST: add new creatures to user (costs 100 points)
// Response body: creature_id
router.post('/buy/:user_id', 
    jwtMiddleware.verifyToken, 
    userCreaturesController.checkUserPoints, 
    userCreaturesController.checkCreatureExistsForUser, 
    userCreaturesController.checkUserCreature, 
    userRecipesController.deductCost, 
    userCreaturesController.createUserCreature)

// Response body: creature_id for snorlax
router.post('/snorlax/:user_id', 
    jwtMiddleware.verifyToken, 
    userCreaturesController.checkCreatureExistsForUser, 
    userCreaturesController.checkUserCreature, 
    userCreaturesController.createUserCreature
)

router.delete('/:user_id', 
    jwtMiddleware.verifyToken, 
    userCreaturesController.deleteCreatureByUserId
)

module.exports = router;
