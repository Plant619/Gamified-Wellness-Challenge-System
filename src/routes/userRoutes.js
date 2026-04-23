const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const bcryptMiddleware = require('../middlewares/bcryptMiddleware');

// Request body: username
// Response: user_id, username, points
router.post('/', userController.createUser);

// Response: user_id, username, points
router.get('/', userController.readAllUser);

// Response: username, points
router.get('/top3/point', userController.top3Point);

// Response: username, total_friendship
router.get('/top3/friendship', userController.top3Friendship);

// Request paramaters: id (user id)
router.get('/:id', userController.readUserById);

// Request parameters: user_id 
// Request body: username and points 
// Response: user_id, username, points
router.put('/:id', userController.updateUserById);


////////////////////////////////////
// NEW 
////////////////////////////////////
router.post("/login", 
    userController.login, 
    bcryptMiddleware.comparePassword, 
    jwtMiddleware.generateToken, 
    jwtMiddleware.sendToken);
    
router.post("/register", 
    userController.checkUsernameExist, 
    bcryptMiddleware.hashPassword, 
    userController.register, 
    jwtMiddleware.generateToken, 
    jwtMiddleware.sendToken);



    
module.exports = router;