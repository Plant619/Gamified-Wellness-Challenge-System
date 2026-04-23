const adminModel = require('../models/adminModel');

module.exports.validateAdmin = (req, res, next) => {
    const data = {
        user_id: req.params.user_id
    }
    console.log(data.user_id)

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkAdmin: " + error);
            res.status(500).json(error);
        } else if (results.length == 0) {
            return res.status(403).json({"message": "Error: Admin access required"});
        } else {
            res.status(200).json(results);
        }
    }

    adminModel.checkAdmin(data, callback);
}

module.exports.checkAdmin = (req, res, next) => {
    const data = {
        user_id: req.params.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkAdmin: " + error);
            res.status(500).json(error);
        } else if (results.length == 0) {
            return res.status(403).json({"message": "Error: Admin access required"});
        } else {
            next();
        }
    }

    adminModel.checkAdmin(data, callback);
}

module.exports.checkIngredientDoesNotExist = (req, res, next) => {

    // Checks that body contains required information (ingredient_name, rarity, description)
    if (req.body == undefined || req.body.ingredient_name == undefined || req.body.rarity == undefined || req.body.description == undefined) {
        res.status(400).json({"message": "Error: ingredient_name or rarity or description is undefined"})
        return;
    }
    
    const data = {
        ingredient_name: req.body.ingredient_name, 
        rarity: req.body.rarity, 
        description: req.body.description
    }

    // Checks that ingredient doesn't already exists
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createIngredients: " + error);
            res.status(500).json(error);
        } else if (results.length > 0) {
            return res.status(409).json({"message": "Error: Ingredient already exists"});
        } else {
            // Creates the Ingredient
            next();
        }
    }

    adminModel.checkIngredient(data, callback);
}

module.exports.createIngredients = (req, res, next) => {
    const data = {
        ingredient_name: req.body.ingredient_name, 
        rarity: req.body.rarity, 
        description: req.body.description
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createIngredients: " + error); 
            res.status(500).json(error);
        } else {
            res.status(201).json({
                "ingredient_id": results.insertId, 
                "ingredient_name": data.ingredient_name,
                "rarity": data.rarity,
                "description": data.description
            });
        }
    }

    adminModel.insertIngredient(data, callback);
}

module.exports.checkRecipeDoesNotExist = (req, res, next) => {
    
    // Checks that body contains required information (recipe_name)
    if (req.body == undefined || req.body.recipe_name == undefined) {
        res.status(400).json({"message": "Error: recipe_name is undefined"})
        return;
    }
    
    const data = {
        recipe_name: req.body.recipe_name
    }

    // Checks that recipe doesn't already exists
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkRecipeDoesNotExist: " + error);
            res.status(500).json(error);
        } else if (results.length > 0) {
            return res.status(409).json({"message": "Error: Recipe already exists"});
        } else {
            // Creates the Recipe
            next();
        }
    }

    adminModel.checkRecipe(data, callback);
}

module.exports.createRecipes = (req, res, next) => {
    const data = {
        recipe_name: req.body.recipe_name
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createRecipes: " + error); 
            res.status(500).json(error);
        } else {
            res.status(201).json({
                "recipe_id": results.insertId, 
                "recipe_name": data.recipe_name
            });
        }
    }

    adminModel.insertRecipe(data, callback);
}

module.exports.checkCreatureDoesNotExist = (req, res, next) => {
    // Checks that body contains required information (creature_name, favourite_food, hated_food)
    if (req.body == undefined || req.body.creature_name == undefined || req.body.favourite_food == undefined || req.body.hated_food == undefined) {
        res.status(400).json({"message": "Error: creature_name or favourite_food or hated_food is undefined"})
        return;
    }
    
    if (req.body.favourite_food == req.body.hated_food) {
        return res.status(400).json({"message": "Error: favourite and hated food cannot be the same"})
    }

    const data = {
        creature_name: req.body.creature_name, 
        favourite_food: req.body.favourite_food, 
        hated_food: req.body.hated_food
    }

    // Checks that creature doesn't already exists
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkCreatureDoesNotExist: " + error);
            res.status(500).json(error);
        } else if (results.length > 0) {
            return res.status(409).json({"message": "Error: Creature already exists"});
        } else {
            // Creates the Creature
            next();
        }
    }

    adminModel.checkCreature(data, callback);
}

module.exports.checkFavAndHatedExist = (req, res, next) => {
    const data = {
        favourite_food: req.body.favourite_food, 
        hated_food: req.body.hated_food
    }

    // Checks that fav and hated food exists
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkFavAndHatedExist: " + error);
            res.status(500).json(error);
        } else if (results.length < 2) {
            return res.status(404).json({"message": "Error: favourite or hated food not found"});
        } else {
            // Creates the Creature
            next();
        }
    }

    adminModel.checkFavAndHatedFood(data, callback);
}

module.exports.createCreatures = (req, res, next) => {
    const data = {
        creature_name: req.body.creature_name, 
        favourite_food: req.body.favourite_food, 
        hated_food: req.body.hated_food
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createCreatures: " + error); 
            res.status(500).json(error);
        } else {
            res.status(201).json({
                "creature_id": results.insertId, 
                "creature_name": data.creature_name, 
                "favourite_food": data.favourite_food, 
                "hated_food": data.hated_food
            });
        }
    }

    adminModel.insertCreature(data, callback);
}

module.exports.checkRecipeId = (req, res, next) => {
    // Checks that body contains required information (recipe_id, ingredient_id)
    if (req.body == undefined || req.body.recipe_id == undefined || req.body.ingredient_id == undefined) {
        res.status(400).json({"message": "Error: recipe_id or ingredient_id is undefined"});
        return;
    }

    if (req.body.quantity <= 0) {
        res.status(400).json({"message": "Error: Please enter a valid quantity (more than 0)"});
        return;
    }

    const data = {
        recipe_id: req.body.recipe_id, 
        ingredient_id: req.body.ingredient_id
    }

    // Check that recipe_id exists
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkRecipeId: " + error);
            res.status(500).json(error);
        } else if (results.length == 0) {
            return res.status(404).json({"message": "Error: recipe_id not found"});
        } else {
            next();
        }
    }

    adminModel.checkRecipeId(data, callback);
}

module.exports.checkIngredientId = (req, res, next) => {
    const data = {
        recipe_id: req.body.recipe_id, 
        ingredient_id: req.body.ingredient_id
    }

    // Check that ingredient_id exists
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkIngredientId: " + error);
            res.status(500).json(error);
        } else if (results.length == 0) {
            return res.status(404).json({"message": "Error: ingredient_id not found"});
        } else {
            next();
        }
    }

    adminModel.checkIngredientId(data, callback);
}

module.exports.checkRecipeIngredients = (req, res, next) => {
    const data = {
        recipe_id: req.body.recipe_id, 
        ingredient_id: req.body.ingredient_id
    }

    // Checks that recipeIngredient doesn't already exists
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkRecipeIngredients: " + error);
            res.status(500).json(error);
        } else if (results.length > 0) {
            return res.status(409).json({"message": "Error: recipeIngredients already exists"});
        } else {
            // Creates the RecipeIngredients
            next();
        }
    }

    adminModel.checkRecipeIngredients(data, callback);
}

module.exports.createRecipeIngredients = (req, res, next) => {
    const data = {
        recipe_id: req.body.recipe_id, 
        ingredient_id: req.body.ingredient_id, 
        quantity: req.body.quantity || 1
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createRecipeIngredients: " + error); 
            res.status(500).json(error);
        } else {
            res.status(201).json({
                "recipe_id": data.recipe_id, 
                "ingredient_id": data.ingredient_id, 
                "quantity": data.quantity
            });
        }
    }

    adminModel.insertRecipeIngredients(data, callback);
}

module.exports.checkCreatureName = (req, res, next) => {
    // Checks that body contains required information (creature_name, favourite_food, hated_food)
    if (req.body == undefined || req.body.creature_name == undefined || req.body.favourite_food == undefined || req.body.hated_food == undefined || req.body.creature_id == undefined) {
        res.status(400).json({"message": "Error: creature_name or favourite_food or hated_food or creature_id is undefined"})
        return;
    }
    
    if (req.body.favourite_food == req.body.hated_food) {
        return res.status(400).json({"message": "Error: favourite and hated food cannot be the same"})
    }

    const data = {
        creature_id: req.body.creature_id, 
        creature_name: req.body.creature_name, 
        favourite_food: req.body.favourite_food, 
        hated_food: req.body.hated_food
    }

    // Checks that creature name doesn't conflict with any other creature
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkCreatureName: " + error);
            res.status(500).json(error);
        } else if (results.length > 0) {
            return res.status(409).json({"message": "Error: Creature name already exists"});
        } else {
            // Creates the Creature
            next();
        }
    }

    adminModel.checkCreatureNameById(data, callback);
}

module.exports.updateCreature = (req, res, next) => {

    const data = {
        creature_id: req.body.creature_id,
        creature_name: req.body.creature_name, 
        favourite_food: req.body.favourite_food, 
        hated_food: req.body.hated_food
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateCreature: " + error);
            res.status(500).json(error);
        } else if (results.affectedRows == 0) {
            return res.status(404).json({"message": "Error: Creature not found"});
        } else {
            res.status(200).json({
                "creature_id": data.creature_id, 
                "creature_name": data.creature_name, 
                "favourite_food": data.favourite_food, 
                "hated_food": data.hated_food
            });
        }
    }

    adminModel.updateCreature(data, callback);
}