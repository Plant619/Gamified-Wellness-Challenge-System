const express = require('express');
const router = express.Router();

const userCompletionController = require('../controllers/userCompletionController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// Request body: user_id and details 
// Response: completion_id, challenge_id, user_id, details
router.post('/:id', 
    jwtMiddleware.verifyToken, 
    userCompletionController.verifyCompletionRecord, 
    userCompletionController.getRandIngredient, 
    userCompletionController.rewardIngredient, 
    userCompletionController.createCompletionRecord);

router.get('/user/:user_id', jwtMiddleware.verifyToken, userCompletionController.readUserCompletionByUserId)


// Response: user_id, details
// Response: List of users who attempted a particular challenge (based on challenge_id)
router.get('/:id', jwtMiddleware.verifyToken, userCompletionController.readUserCompletionById);


module.exports = router;