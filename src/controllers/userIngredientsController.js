const userIngredientsModel = require('../models/userIngredientsModel');
const userModel = require('../models/userModel');

module.exports.readAllIngredients = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllIngredients: " + error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    }

    userIngredientsModel.selectAllIngredients(callback);
}

module.exports.readIngredientsByUserId = (req, res, next) => {
    const data = {
        user_id: req.params.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readIngredientsByUserId" + error);
            res.status(500).json(error);
        } else {
            if (results.length == 0) {
                res.status(404).json({"message": "Error: Ingredients not found"});
            } else {
                res.status(200).json(results);
            }
        }
    }

    userIngredientsModel.selectIngredientsByUserId(data, callback);
}

module.exports.checkIngredientExists = (req, res, next) => {
    if (!req.body || !req.body.ingredient_id) {
        return res.status(400).json({'message': 'missing required information (ingredient_id)'})
    }

    const data = {
        ingredient_id: req.body.ingredient_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkIngredientExists" + error);
            res.status(500).json(error);
        } else {
            if (results.length == 0) {
                res.status(404).json({"message": "Error: Ingredient not found"});
            } else {
                // stores the ingredient returned for later
                req.body.ingredient = results[0];
                next();
            }
        }
    }

    userIngredientsModel.selectIngredientByIngredientId(data, callback);
}

module.exports.checkUserPoints = (req, res, next) => {
    const data = {
        user_id: req.params.user_id, 
        ingredient: req.body.ingredient, 
        rarity: req.body.ingredient.rarity
    }

    console.log(data.ingredient)

    // calculating price based on rarity
    if (data.rarity == 'Common') {
        data.price = 10;
    } else if (data.rarity == 'Uncommon') {
        data.price = 20; 
    } else if (data.rarity == 'Rare') {
        data.price = 50;
    } else if (data.rarity == 'Epic') {
        data.price = 100;
    } else if (data.rarity == 'Legendary'){
        data.price = 1000;
    } else {
        // fail safe
        data.price = 0;
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkUserPoints" + error);
            res.status(500).json(error);
        } else {
            if (results.length == 0) {
                return res.status(404).json({"message": "Error: User not found"});
            }

            // Insufficient points
            if (results[0].points < data.price) {
                res.status(403).json({'message': 'Insufficient points'});
            } else {
                // store price for later use
                req.body.price = data.price;
                next();
            }
        }
    }

    // gets user info including points
    userModel.selectUserById(data, callback);
}

module.exports.deductCost = (req, res, next) => {
    const data = {
        user_id: req.params.user_id, 
        price: req.body.totalPrice
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deductCost" + error);
            res.status(500).json(error);
        } else {
            next();
        }
    }

    userIngredientsModel.deductCost(data, callback);
}

module.exports.checkAndAddUserIngredient = (req, res, next) => {
    const data = {
        user_id: req.params.user_id, 
        ingredient_id: req.body.ingredient_id,
        quantity: req.body.quantity || 1
    }

    const callback1 = (error, results, fields) => {
        if (error) {
            console.error("Error checkAndAddUserIngredient1" + error);
            res.status(500).json(error);
        } else {
            // user does not own the ingredient (insert new)
            if (results.length == 0) {
                userIngredientsModel.insertUserIngredient(data, callback2);
            // user owns the ingredient (update quantity)
            } else {
                userIngredientsModel.updateUserIngredient(data, callback2);
            }
        }
    }

    const callback2 = (error, results, fields) => {
        if (error) {
            console.error("Error checkAndAddUserIngredient2" + error);
            res.status(500).json(error);
        } else {
            res.status(201).json(results);            
        }
    }

    userIngredientsModel.selectIngredientByUserIdAndIngredientId(data, callback1);
}

module.exports.deleteIngredientByUserId  = (req, res, next) => {
    const data = {
        user_id: req.params.banned_user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteIngredientByUserId: " + error);
            res.status(500).json(error);
        } else {
            console.log('delete ingredient done')
            next();
        }
    }

    userIngredientsModel.deleteIngredientByUserId(data, callback);
}

module.exports.checkUserPointsByQuantity = (req, res, next) => {
    if (!req.body.quantity) {
        return res.status(400).json({'message': 'missing required information (quantity)'})
    }

    const data = {
        user_id: req.params.user_id, 
        ingredient: req.body.ingredient, 
        rarity: req.body.ingredient.rarity, 
        quantity: req.body.quantity
    }

    console.log(data.ingredient)

    // calculating price based on rarity
    if (data.rarity == 'Common') {
        data.price = 10;
    } else if (data.rarity == 'Uncommon') {
        data.price = 20; 
    } else if (data.rarity == 'Rare') {
        data.price = 50;
    } else if (data.rarity == 'Epic') {
        data.price = 100;
    } else if (data.rarity == 'Legendary'){
        data.price = 1000;
    } else {
        // fail safe
        data.price = 0;
    }

    data.totalPrice = data.quantity * data.price;

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkUserPoints" + error);
            res.status(500).json(error);
        } else {
            if (results.length == 0) {
                return res.status(404).json({"message": "Error: User not found"});
            }

            // Insufficient points
            if (results[0].points < data.totalPrice) {
                res.status(403).json({'message': 'Insufficient points'});
            } else {
                // store price for later use
                req.body.totalPrice = data.totalPrice;
                next();
            }
        }
    }

    // gets user info including points
    userModel.selectUserById(data, callback);
}