const userCreaturesModel = require('../models/userCreaturesModel');
const userDishesModel = require('../models/userDishesModel');
const userRecipesModel = require('../models/userRecipesModel');
const userModel = require('../models/userModel');

module.exports.readAllCreatures = (req, res, next) => {

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllCreatures: " + error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    }

    userCreaturesModel.selectAllCreatures(callback);
}

module.exports.readCreaturesByUserId = (req, res, next) => {
    
    const data = {
        user_id: req.params.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readCreaturesByUserId" + error);
            res.status(500).json(error);
        } else {
            if (results.length == 0) {
                res.status(404).json({"message": "Error: Creatures not found"});
            } else {
                res.status(200).json(results);
            }
        }
    }

    userCreaturesModel.selectCreaturesByUserId(data, callback);
}

module.exports.checkCreatureExists = (req, res, next) => {
    // Check that required information is in the req body (creature_id, recipe_id)
    if (req.body == undefined || req.body.creature_id == undefined || req.body.recipe_id == undefined) {
        res.status(400).json({"message": "Error: creature_id or recipe_id is undefined"})
        return;
    }
    
    const data = {
        user_id: req.params.user_id, 
        recipe_id: req.body.recipe_id, 
        creature_id: req.body.creature_id
    }

    // check that creature exists
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkCreatureExists: " + error);
            res.status(500).json(error);
        } else if (results.length == 0) {
            return res.status(404).json({"message": "Error: creature not found"});
        } else {
            req.body.hated_food = results[0].hated_food;
            req.body.favourite_food = results[0].favourite_food;
            req.body.creature_name = results[0].creature_name;
            // Check user has cooked dish
            next();
        }
    }

    userCreaturesModel.checkCreature(data, callback);
}

module.exports.checkUserHasCookedDish = (req, res, next) => {
    const data = {
        user_id: req.params.user_id, 
        recipe_id: req.body.recipe_id, 
        creature_id: req.body.creature_id
    }

    // check that user has cooked dish exists
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkUserHasCookedDish: " + error);
            res.status(500).json(error);
        } else if (results.length == 0) {
            return res.status(404).json({"message": "Error: dish not found"});
        } else {
            // Delete cooked dish
            req.body.quantity = results[0].quantity;
            next();
        }
    }

    userDishesModel.getDishById(data, callback);
}

module.exports.deleteDishUsed = (req, res, next) => {
    const data = {
        user_id: req.params.user_id, 
        recipe_id: req.body.recipe_id, 
        creature_id: req.body.creature_id, 
        quantity: req.body.quantity
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkUserHasCookedDish: " + error);
            res.status(500).json(error);
        } else {
            // Delete cooked dish
            next();
        }
    }

    // removes dish from userDishes if quantity = 1 and decreases quantity by 1 if quantity > 1
    if (data.quantity == 1) {
        userDishesModel.deleteDish(data, callback);
    } else {
        userDishesModel.decrementDish(data, callback);
    }
}

module.exports.checkHatedAndFavFood = (req, res, next) => {
    const data = {
        user_id: req.params.user_id, 
        recipe_id: req.body.recipe_id, 
        creature_id: req.body.creature_id, 
        hated_food: req.body.hated_food, 
        favourite_food: req.body.favourite_food
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkUserHasCookedDish: " + error);
            res.status(500).json(error);
        } else if (results.length == 0) {
            // should not ever get this error since UserRecipes recipes must be from Recipes (due to fk)
            return res.status(404).json({"message": "Error recipe not found"});
        } else {
            // multiplier for amount of friendship earned 
            if (data.hated_food == results[0].recipe_name) {
                req.body.multiplier = 0.5;
            } else if (data.favourite_food == results[0].recipe_name) {
                req.body.multiplier = 2;
            } else {
                req.body.multiplier = 1;
            }

            next();
        }
    }

    userRecipesModel.selectRecipeName(data, callback);
}

module.exports.updateCreaturesFriendship = (req, res, next) => {
    const data = {
        user_id: req.params.user_id, 
        recipe_id: req.body.recipe_id, 
        creature_id: req.body.creature_id, 
        multiplier: req.body.multiplier, 
        creature_name: req.body.creature_name
    }

    // Base points earned: 10
    data.friendship = data.multiplier * 10;

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkUserHasCookedDish: " + error);
            res.status(500).json(error);
        } else {
            if (data.multiplier == 2) {
                res.status(201).json({"message": `${data.creature_name} has been fed. ${data.creature_name} is very happy. `});
            } else if (data.multiplier == 0.5) {
                res.status(201).json({"message": `${data.creature_name} has been fed. ${data.creature_name} is not happy. `});
            } else {
                res.status(201).json({"message": `${data.creature_name} has been fed. ${data.creature_name} is neutral. `});
            } 
        }
    }

    userCreaturesModel.updateFriendship(data, callback);
}

module.exports.checkUserPoints = (req, res, next) => {
    if (req.body == undefined || req.body.creature_id == undefined) {
        res.status(400).json({"message": "Error: creature_id is undefined"});
        return;
    }

    const data = {
        creature_id: req.body.creature_id, 
        user_id: req.params.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkUserPoints" + error);
            res.status(500).json(error);
        } else {
            if (results.length == 0) {
                res.status(404).json({"message": "Error: User not found"});
            } else if (results[0].points < 100) {
                res.status(400).json({"message": "Error: Insufficient points (100 points required)"});
            } else {
                // checks whether user has the recipe already
                next()
            }
        }
    }

    userModel.selectUserById(data, callback);
}

// Checks that creature exists
module.exports.checkCreatureExistsForUser = (req, res, next) => {
    if (req.body == undefined || req.body.creature_id == undefined) {
        res.status(400).json({"message": "Error: creature_id is undefined"});
        return;
    }

    const data = {
        user_id: req.params.user_id,
        creature_id: req.body.creature_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkCreatureExists: " + error);
            res.status(500).json(error);
        } else if (results.length == 0){
            res.status(404).json({"message": "Error: creature not found"});
        } else {
            req.body.creature_name = results[0].creature_name;
            // Checks that user doesn't already have the creature
            next();
        }
    }

    userCreaturesModel.selectCreatureById(data, callback);
}

// Checks that user doesn't already have the creature
module.exports.checkUserCreature = (req, res, next) => {
    const data = {
        creature_id: req.body.creature_id, 
        user_id: req.params.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkUserCreature" + error);
            res.status(500).json(error);
        } else {
            if (results.length == 0) {
                next();
            } else {
                res.status(400).json({"message": "Error: You already own this creature"})
            }
        }
    }

    userCreaturesModel.checkUserCreature(data, callback);
}

// Adds new creature to user creatures
module.exports.createUserCreature = (req, res, next) => {
    const data = {
        user_id: req.params.user_id, 
        creature_id: req.body.creature_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createUserCreature" + error);
            res.status(500).json(error);
        } else {
            res.status(201).json({"message": `${req.body.creature_name} bought`})
        }
    }

    userCreaturesModel.insertUserCreature(data, callback);
}

// calculate mood based on current time and when creature was last fed
module.exports.calculateMood = (req, res, next) => {
    const data = {
        user_id: req.params.user_id, 
        creature_id: req.params.creature_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error calculateMood" + error);
            res.status(500).json(error);
        } else {
            if (results.length == 0) {
                res.status(404).json({"message": "Error: Creature or user not found"});
            } else {
                let creature = results[0];
                let d = new Date();
                let last_fed = new Date(creature.last_fed);
                let diffInHours = Math.floor((d - last_fed) / (3600000));
                let mood = '';

                // more than 7 days
                if (diffInHours > 24 * 7) {
                    mood = 'angry';
                // between 2 - 7 days
                } else if (diffInHours > 24 * 2) {
                    mood = 'neutral'
                // less than 2 days
                } else {
                    mood = 'happy';
                }

                let status = `${creature.creature_name} is ${mood}. They were last fed ${diffInHours} hours ago. `
                res.status(200).json({"message": status});
            }
        }
    }

    userCreaturesModel.checkCreature(data, callback);
}

module.exports.readCreaturesByCreatureName = (req, res, next) => {
    
    const data = {
        creature_name: 'Snorlax'
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readCreaturesByCreatureName" + error);
            res.status(500).json(error);
        } else {
            if (results.length == 0) {
                res.status(404).json({"message": "Error: Snorlax not found"});
            } else {
                res.status(200).json(results);
            }
        }
    }

    userCreaturesModel.selectCreaturesByCreatureName(data, callback);
}

module.exports.deleteCreatureByUserId = (req, res, next) => {
    
    const data = {
        user_id: req.params.banned_user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteCreatureByUserId" + error);
            res.status(500).json(error);
        } else {
            next()
        }
    }

    userCreaturesModel.deleteCreaturesFromUser(data, callback);
}