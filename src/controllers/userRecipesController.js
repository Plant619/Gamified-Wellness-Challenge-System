const userRecipesModel = require('../models/userRecipesModel');
const userModel = require('../models/userModel');

module.exports.readAllRecipes = (req, res, next) => {

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllRecipes: " + error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    }

    userRecipesModel.selectAllRecipes(callback);
}

module.exports.readRecipesByUserId = (req, res, next) => {
    
    const data = {
        user_id: req.params.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readRecipesByUserId" + error);
            res.status(500).json(error);
        } else {
            if (results.length == 0) {
                res.status(404).json({"message": "Error: No recipes found"});
            } else {
                res.status(200).json(results);
            }
        }
    }

    userRecipesModel.selectRecipesByUserId(data, callback);
}

module.exports.readIngredientByRecipeId = (req, res, next) => {
    const data = {
        recipe_id: req.params.recipe_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readIngredientByRecipeId" + error);
            res.status(500).json(error);
        } else {
            if (results.length == 0) {
                res.status(404).json({"message": "Error: Recipe not found"});
            } else {
                res.status(200).json(results);
            }
        }
    }

    userRecipesModel.selectIngredientByRecipe(data, callback);
}

// Checks that the request body has reuired information (recipe_id)
// Checks that user has at least 100 points 
// Checks that the user exists
module.exports.checkUserPoints = (req, res, next) => {
    if (req.body == undefined || req.body.recipe_id == undefined) {
        res.status(400).json({"message": "Error: recipe_id is undefined"});
        return;
    }

    const data = {
        recipe_id: req.body.recipe_id, 
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
                res.status(403).json({"message": "Error: Insufficient points (100 points required)"});
            } else {
                // checks whether user has the recipe already
                next()
            }
        }
    }

    userModel.selectUserById(data, callback);
}

// Checks that recipe exists
module.exports.checkRecipeExists = (req, res, next) => {
    const data = {
        recipe_id: req.body.recipe_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkRecipeExists: " + error);
            res.status(500).json(error);
        } else if (results.length == 0){
            res.status(404).json({"message": "Error: recipe not found"});
        } else {
            req.body.recipe_name = results[0].recipe_name;
            // Checks that user doesn't already have the recipe
            next();
        }
    }

    userRecipesModel.selectRecipeByid(data, callback);
}

// Checks that user doesn't already have the recipe
module.exports.checkUserRecipe = (req, res, next) => {
    const data = {
        recipe_id: req.body.recipe_id, 
        user_id: req.params.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkUserRecipe" + error);
            res.status(500).json(error);
        } else {
            if (results.length == 0) {
                next();
            } else {
                res.status(400).json({"message": "Error: You already own this recipe"})
            }
        }
    }

    userRecipesModel.checkUserRecipe(data, callback);
}

// Decreasees user points by 100
module.exports.deductCost = (req, res, next) => {
    const data = {
        user_id: req.params.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deductCost" + error);
            res.status(500).json(error);
        } else {
            next();
        }
    }

    userRecipesModel.deductRecipeCost(data, callback);
}

// Adds new recipe to user recipes
module.exports.createUserRecipe = (req, res, next) => {
    const data = {
        user_id: req.params.user_id, 
        recipe_id: req.body.recipe_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createUserRecipe" + error);
            res.status(500).json(error);
        } else {
            res.status(201).json({"message": `${req.body.recipe_name} bought`})
        }
    }

    userRecipesModel.insertUserRecipe(data, callback);
}


module.exports.deleteRecipeByUserId  = (req, res, next) => {
    const data = {
        user_id: req.params.banned_user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteRecipeByUserId: " + error);
            res.status(500).json(error);
        } else {
            console.log('delete recipe done')
            next();
        }
    }

    userRecipesModel.deleteRecipeByUserId(data, callback);
}
