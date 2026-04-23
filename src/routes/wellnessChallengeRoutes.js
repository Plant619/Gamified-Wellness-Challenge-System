const express = require('express');
const router = express.Router();

const wellnessChallengeController = require('../controllers/wellnessChallengeController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// Request body: user_id , description and points
// Response: challenge_id, description, creator_id (user_id), points
router.post('/', jwtMiddleware.verifyToken, wellnessChallengeController.createChallenge); 

// Response: challenge_id, description, creator_id, points
router.get('/', jwtMiddleware.verifyToken, wellnessChallengeController.readAllChallenge);

router.get('/user/:user_id', 
    jwtMiddleware.verifyToken, 
    wellnessChallengeController.selectChallengeByUser
)

// Request parameters: challenge_id
router.delete('/:id', jwtMiddleware.verifyToken, wellnessChallengeController.deleteChallengeById);


// Request body: user_id, description, points in req body 
// Response: challenge_id, desciption, creator_id, points
router.put('/:id', jwtMiddleware.verifyToken, wellnessChallengeController.updateChallengeById);

module.exports = router;