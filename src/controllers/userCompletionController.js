const userCompletionModel = require('../models/userCompletionModel');
const wellnessChallengeModel = require('../models/wellnessChallengeModel');
const userModel = require('../models/userModel');
const userIngredientsModel = require('../models/userIngredientsModel');

module.exports.verifyCompletionRecord = (req, res, next) => {

    if (req.body.user_id == undefined || req.body.details == undefined) {
        res.status(400).json({"message": "Error: user_id or details is undefined"});
        return;
    }

    const data = {
        challenge_id: req.params.id,
        user_id: req.body.user_id, 
        details: req.body.details
    }

    // Checks that challenge_id exists
    // Returns challenge if exists
    const callback1 = (error, results, fields) => {
        if (error) {
            console.error("Error verifyCompletionRecord1: " + error);
            res.status(500).json(error);
        } else {
            // Challenge does not exist
            if (results.length == 0) {
                res.status(404).json({"message": "Error: challenge not found"});
                return;
            // Challenge exists
            } else {
                data.points = results[0].points;
                userModel.selectUserById(data, callback2);
            }
        }
    }

    // Checks that user_id exists
    // Returns user if exists
    const callback2 = (error, results, fields) => {
        if (error) {
            console.error("Error verifyCompletionRecord2: " + error);
            res.status(500).json(error);
        } else {
            // User does not exist
            if (results.length == 0) {
                res.status(404).json({"message": "Error: user not found"});
                return;
            // User exists
            } else {
                userModel.updateUserById({
                    username: results[0].username, 
                    points: results[0].points + data.points, 
                    user_id: data.user_id
                }, callback3);
            }
        }
    }

    // Adds points 
    const callback3 = (error, results, fields) => {
        if (error){
            console.error("Error verifyCompletionRecord3: " + error);
            res.status(500).json(error);
            return;
        } else {

            next();
        }
    }

    wellnessChallengeModel.selectChallengeById(data, callback1)
}

module.exports.readUserCompletionById = (req, res, next) => {

    const data = {
        challenge_id: req.params.id
    }

    // Checks that challenge exists
    const callback1 = (error, results, fields) => {
        if (error) {
            console.error("Error createCompletionRecord: " + error);
            res.status(500).json(error);
        } else {
            // Challenge does not exist
            if (results.length == 0) {
                res.status(404).json({"message": "Error: completion not found"});
                return;
            // Challenge exists
            } else {
                userCompletionModel.getCompletionRecordById(data, callback2);
            }
        }
    }

    const callback2 = (error, results, fields) => {
        if (error) {
            console.error("Error readUserCompletionById: " + error);
            res.status(500).json(error);
        } else {
            if (results.length == 0) {
                res.status(404).json({"message": "No attempts yet"})
            } else {
                res.status(200).json(results.map(user => {
                    return {
                        "user_id": user.user_id, 
                        "details": user.details 
                    }
                }));
            }
        }
    }

    wellnessChallengeModel.selectChallengeById(data, callback1);
}

module.exports.getRandIngredient = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getRandIngredient: " + error);
            res.status(500).json(error);
        } else {
            // makes an arr of IDs
            let ingredientIDs = results.map(ingredient => ingredient.ingredient_id);
            // get a random index (0 - ingredientIDs.length - 1) 
            let randIndex = Math.floor(ingredientIDs.length * Math.random());
            // get a random ingredient ID using the random index
            let randIngredientId = ingredientIDs[randIndex];

            req.body.randIngredientId = randIngredientId;

            // check if user already has ingredient and rewards accordingly
            next();
        }
    }

    userIngredientsModel.selectAllIngredients(callback);
}

module.exports.rewardIngredient = (req, res, next) => {
    const data = {
        ingredient_id: req.body.randIngredientId, 
        user_id: req.body.user_id, 
        quantity: 1
    }

    // Checks if user already has the random ingredient
    const callback1 = (error, results, fields) => {
        if (error) {
            console.error("Error rewardIngredient1: " + error);
            res.status(500).json(error);
        } else if (results.length == 0) {
            userIngredientsModel.insertUserIngredient(data, callback2)
        } else {
            userIngredientsModel.updateUserIngredient(data, callback2)
        }
    }

    // insert the new ingredient or updates quantity by 1 if user already has the ingredient
    const callback2 = (error, results, fields) => {
        if (error) {
            console.error("Error rewardIngredient2: " + error);
            res.status(500).json(error);
        } else {
            next();
        }
    }

    userIngredientsModel.selectIngredientByUserIdAndIngredientId(data, callback1);
}

module.exports.createCompletionRecord = (req, res, next) => {
    const data = {
        challenge_id: req.params.id,
        user_id: req.body.user_id, 
        details: req.body.details
    }

    // Creates Completion record 
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createCompletionRecord: " + error);
        } else {
            res.status(201).json({
                "completion_id": results.insertId, 
                "challenge_id": data.challenge_id, 
                "user_id": data.user_id, 
                "details": data.details
            });
        }
    }

    userCompletionModel.insertCompletionRecord(data, callback);
}

module.exports.readUserCompletionByUserId = (req, res, next) => {
    const data = {
        user_id: req.params.user_id, 
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readUserCompletionByUserId: " + error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    }

    userCompletionModel.selectCompletionByUserId(data, callback);
}


module.exports.deleteChallengeRecords = (req, res, next) => {
    const data = {
        user_id: req.params.banned_user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteChallengeRecords: " + error);
            res.status(500).json(error);
        } else {
            console.log('deleteChallengeRecords done')
            next()
        }
    }

    userCompletionModel.deleteCompletionRecordByUserId(data, callback);
}

module.exports.deleteCompletionRecords = (req, res, next) => {
    console.log('deleteCompletionRecords start');

    const data = {
        user_id: req.params.banned_user_id, 
        challengesList: req.challengesCreated
    }

    if (data.challengesList.length == 0) {
        next();
        return;
    }

    let done = 0; 
    // deletes completion records for a challenge
    for (let i = 0; i < data.challengesList.length; i++) {
        data.challenge_id = data.challengesList[i].challenge_id;

        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error deleteCompletionRecords: " + error);
                res.status(500).json(error);
            } else {
                done++;

                if (done == data.challengesList.length) {
                    console.log('deleteCompletionRecords done');
                    next();
                }
            }
        }

        userCompletionModel.deleteCompletionRecordById(data, callback);

    }
}