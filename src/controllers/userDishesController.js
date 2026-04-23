const userDishesModel = require('../models/userDishesModel');

// Checks that user owns the recipe
module.exports.checkOwnedRecipes = (req, res, next) => {
    // check that body has required information (recipe_id)
    if (req.body == undefined || req.body.recipe_id == undefined) {
        res.status(400).json({"message": "Error: recipe_id is undefined"});
        return;
    }

    const data = {
        user_id: req.params.user_id, 
        recipe_id: req.body.recipe_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkOwnedRecipes: " + error);
            res.status(500).json(error);
        } else if (results.length == 0) {
            return res.status(403).json({"message": "Error: You do not own this recipe"});
        } else {
            next();
        }
    }
    
    userDishesModel.getRecipeById(data, callback);
}

// Gets the required recipe ingredients
module.exports.getRecipeIngredients = (req, res, next) => {
    const data = {
        user_id: req.params.user_id, 
        recipe_id: req.body.recipe_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getRecipeIngredients: " + error);
            res.status(500).json(error);
        } else {
            req.body.ingredients = results;
            next();
        }
    }
    
    userDishesModel.getIngredientsByRecipeId(data, callback);
}

// Gets the ingredients that the user has
module.exports.getUserIngredients = (req, res, next) => {
    const data = {
        user_id: req.params.user_id, 
        recipe_id: req.body.recipe_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getUserIngredients: " + error);
            res.status(500).json(error);
        } else {
            req.body.user_ingredients = results;
            next();
        }
    }
    
    userDishesModel.getUserIngredientsByUserId(data, callback);
}

// Checks whether the required recipe ingredients are owned by the user
module.exports.checkOwnedIngredients = (req, res, next) => {

    const data = {
        user_id: req.params.user_id, 
        recipe_id: req.body.recipe_id, 
        ingredients: req.body.ingredients, 
        user_ingredients: req.body.user_ingredients
    }
    console.log(data.ingredients)
    console.log(data.user_ingredients)

    let hasIngredients = true;

    for (let i = 0; i < data.ingredients.length; i++) {
        let currRecipeIngredient = data.ingredients[i];
        let found = false;

        for (let j = 0; j < data.user_ingredients.length; j++) {
            if (currRecipeIngredient.ingredient_id == data.user_ingredients[j].ingredient_id) {
                found = true;
                if (Number(currRecipeIngredient.quantity) > Number(data.user_ingredients[j].quantity)) {
                    hasIngredients = false;
                }

                break;
            }
        }

        if (!hasIngredients || !found) {
            hasIngredients = false;
            break;
        }
    }
    
    if (hasIngredients) {
        next();
    } else {
        return res.status(403).json({"message": "Error: You do not have the ingredients required for this recipe"});
    }
}

// Removes the required ingredients from the user
module.exports.deleteRequiredIngredients = (req, res, next) => {

    const data = {
        user_id: req.params.user_id, 
        recipe_id: req.body.recipe_id, 
        ingredients: req.body.ingredients, 
        user_ingredients: req.body.user_ingredients, 
        curr_quantity: 0
    }

    let completed = 0;

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteRequiredIngredients: " + error);
            res.status(500).json(error);
        } else {
            completed++;
            // Ensures that the updates finish occuring before the next function is called
            if (completed == data.ingredients.length) {
                next();
            } 
        }
    }

    for (let i = 0; i < data.ingredients.length; i++) {
        const ingredient_data = {
            user_id: req.params.user_id, 
            ingredient_id: data.ingredients[i].ingredient_id,
            quantity: data.ingredients[i].quantity
        }

        userDishesModel.updateUserIngredientsByUserId(ingredient_data, callback);

    }
}

module.exports.deleteZeroQuantity = (req, res, next) => {
    
    const data = {
        user_id: req.params.user_id, 
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteZeroQuantity: " + error);
            res.status(500).json(error);
        } else {
            next();
        }
    }


    userDishesModel.deleteQuantityZeroIngredients(data, callback);
}


// Checks that the dish doesn't already exist
module.exports.checkDishDoesNotExist = (req, res, next) => {
    
    const data = {
        user_id: req.params.user_id, 
        recipe_id: req.body.recipe_id
    }

    // Checks that dish doesn't already exists
    const callback1 = (error, results, fields) => {
        if (error) {
            console.error("Error getDishById: " + error);
            res.status(500).json(error);
        } else if (results.length > 0) {
            // if dish exist update quantity
            userDishesModel.updateDishById(data, callback2);
        } else {
            // Creates the Dish
            next();
        }
    }

    const callback2 = (error, results, fields) => {
        if (error) {
            console.error("Error getDishById: " + error);
            res.status(500).json(error);
        } else {
            res.status(201).json({"message": "Dished cooked successfully"});
        } 
    }

    userDishesModel.getDishById(data, callback1);
}

// Creates the dish if dish doesn't exist already
module.exports.insertDish = (req, res, next) => {

    const data = {
        user_id: req.params.user_id, 
        recipe_id: req.body.recipe_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error insertDish: " + error);
            res.status(500).json(error);
        } else {
            res.status(201).json({"message": "Dished cooked successfully"});
        }
    }

    userDishesModel.insertDish(data, callback);
}


module.exports.readAllDishes = (req, res, next) => {
    const data = {
        user_id: req.params.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllDishes: " + error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    }

    userDishesModel.selectAllDishes(data, callback);
}

module.exports.deleteDishByUserId  = (req, res, next) => {
    const data = {
        user_id: req.params.banned_user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteDishByUserId: " + error);
            res.status(500).json(error);
        } else {
            console.log('delete dish done')
            next();
        }
    }

    userDishesModel.deleteDishByUserId(data, callback);
}