const wellnessChallengeModel = require('../models/wellnessChallengeModel');
const userModel = require('../models/userModel');
const userCompletionModel = require('../models/userCompletionModel');

module.exports.createChallenge = (req, res, next) => {

    // Checks that req body has user_id, description and points
    if (req.body.user_id == undefined || req.body.description == undefined || req.body.points == undefined) {
        return res.status(400).json({"message": "Error: user_id, description or points is undefined"});
    }

    const data = {
        creator_id: req.body.user_id, 
        description: req.body.description, 
        points: req.body.points
    }
    
    // Check that creator_id (user_id) exists
    const callback1 = (error, results, fields) => {
        if (error) {
            console.error("Error createChallenge: " + error);
            res.status(500).json(error);
        } else {
            // user_id exists
            if (results.length > 0) {
                wellnessChallengeModel.insertChallenge(data, callback2);

            // user_id does not exist
            } else {
                res.status(404).json({"message": "Error: User not found"});
            }
        }
    }

    const callback2 = (error, results, fields) => {
        if (error) {
            console.error("Error createChallenge: " + error);
            res.status(500).json(error);
        } else {
            res.status(201).json({
                "challenge_id": results.insertId, 
                "description": data.description, 
                "creator_id" : data.creator_id, 
                "points": data.points 
            });
        }
    }

    userModel.selectUserById({user_id: req.body.user_id}, callback1);
}

module.exports.readAllChallenge = (req, res, next) => {

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllChallenge: " + error);
            res.status(500).json(error);
        } else {    
            res.status(200).json(results);
        }
    }

    wellnessChallengeModel.selectAllChallenge(callback);
}

module.exports.deleteChallengeById = (req, res, next) => {

    const data = {
        challenge_id: req.params.id
    }
    
    // Checks that challenge exists
    const callback1 = (error, results, fields) => {
        if (error) {
            console.error("Error deleteChallengeById: " + error);
            res.status(500).json(error);
        } else {
            // Challenge does not exist
            if (results.length == 0) {
                res.status(404).json({"message": "Error: challenge not found"});
            // Challenge exists
            } else {
                userCompletionModel.deleteCompletionRecordById(data, callback2);
            }
        }
    }

    // Deletes completion records for the challenge
    const callback2 = (error, results, fields) => {
        if (error) {
            console.error("Error deleteChallengeById: " + error);
            res.status(500).json(error);
        } else{
            wellnessChallengeModel.deleteChallengeById(data, callback3);
        }
    }

    // Deletes challenge
    const callback3 = (error, results, fields) => {
        if (error) {
            console.error("Error deleteChallengeById: " + error);
            res.status(500).json(error);
        } else {
            res.status(204).send();
        }
    }  

    wellnessChallengeModel.selectChallengeById(data, callback1);
}

module.exports.updateChallengeById = (req, res, next) => {

    // Checks that req body has user_id, description, points 
    if (req.body.user_id == undefined || req.body.description == undefined || req.body.points == undefined) {
        res.status(400).json({"message": "Error: user_id, description or points is undefined"});
        return;
    } 

    const data = {
        challenge_id: req.params.id, 
        creator_id: req.body.user_id, 
        description: req.body.description, 
        points: req.body.points
    }

    // Checks that challenge_id exists 
    const callback1 = (error, results, fields) => {
        if (error) {
            console.error("Error updateChallengeById: " + error);
            res.status(500).json(error);
            return;
        }
        // challenge_id exists
        if (results.length > 0) {
            
            // Check that creator_id provided is the same as the actual creator_id
            if (results[0].creator_id == data.creator_id) {
                wellnessChallengeModel.updateChallengeById(data, callback2);
            } else {
                res.status(403).json({"message": "Error: Access denied. You are not the creator. "})
            }

        // challenge_id does not exist
        } else {
            res.status(404).json({"message": "Error: Challenge not found"})
        }
    }

    const callback2 = (error, results, fields) => {
        if (error) {
            console.error("Error updateChallengeById: " + error)
            res.status(500).json(error);
        } else { 
            res.status(200).json({
                "challenge_id": data.challenge_id, 
                "description": data.description, 
                "creator_id": data.creator_id, 
                "points": data.points
            })
        }
    }

    wellnessChallengeModel.selectChallengeById(data, callback1)
}

module.exports.deleteChallengesCreated = (req, res, next) => {

    const data = {
        user_id: req.params.banned_user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteChallengeRecords: " + error);
            res.status(500).json(error);
        } else {   
            console.log('delete challenges created done') 
            next();
        }
    }

    wellnessChallengeModel.deleteChallengeByUserId(data, callback);
}

module.exports.selectChallengeByUserId = (req, res, next) => {

    const data = {
        user_id: req.params.banned_user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error selectChallengeByUserId: " + error);
            res.status(500).json(error);
        } else {  
            req.challengesCreated = results;   
            console.log('challengesCreated', req.challengesCreated)
            next()
        }
    }

    wellnessChallengeModel.selectChallengeByUserId(data, callback);
}


module.exports.selectChallengeByUser = (req, res, next) => {

    const data = {
        user_id: req.params.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error selectChallengeByUser: " + error);
            res.status(500).json(error);
        } else {  
            res.status(200).json(results);
        }
    }

    wellnessChallengeModel.selectChallengeByUserId(data, callback);
}