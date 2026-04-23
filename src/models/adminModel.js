const pool = require('../services/db');

module.exports.checkAdmin = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT *
        FROM User 
        WHERE user_id = ?
        AND role = 'admin';
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.checkIngredient = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT *
        FROM Ingredients 
        WHERE ingredient_name = ?
    `;

    const VALUES = [data.ingredient_name];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.insertIngredient = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO Ingredients (ingredient_name, rarity, description)
        VALUES (?, ?, ?);
    `;

    const VALUES = [data.ingredient_name, data.rarity, data.description];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.checkRecipe = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT *
        FROM Recipes 
        WHERE recipe_name = ?
    `;

    const VALUES = [data.recipe_name];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.insertRecipe = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO Recipes (recipe_name)
        VALUES (?);
    `;

    const VALUES = [data.recipe_name];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// checks that creature name doesn't already exist
module.exports.checkCreature = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT *
        FROM Creatures 
        WHERE creature_name = ?
    `;

    const VALUES = [data.creature_name];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.checkFavAndHatedFood = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT *
        FROM Recipes 
        WHERE recipe_name = ?
        OR recipe_name = ?;
    `;

    const VALUES = [data.hated_food, data.favourite_food];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.insertCreature = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO Creatures (creature_name, favourite_food, hated_food)
        VALUES (?, ?, ?);
    `;

    const VALUES = [data.creature_name, data.favourite_food, data.hated_food];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.checkRecipeId = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * 
        FROM Recipes 
        WHERE recipe_id = ?
    `;

    const VALUES = [data.recipe_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.checkIngredientId = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * 
        FROM Ingredients 
        WHERE ingredient_id = ?
    `;

    const VALUES = [data.ingredient_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.checkRecipeIngredients = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * 
        FROM RecipeIngredients 
        WHERE ingredient_id = ? 
        AND recipe_id = ?;
    `;

    const VALUES = [data.ingredient_id, data.recipe_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.insertRecipeIngredients = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO RecipeIngredients (recipe_id, ingredient_id, quantity)
        VALUES (?, ?, ?);
    `;

    const VALUES = [data.recipe_id, data.ingredient_id, data.quantity];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// checks that updated name doesn't conflict with any other name (except its own)
module.exports.checkCreatureNameById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT *
        FROM Creatures 
        WHERE creature_name = ?
        AND creature_id != ?
    `;

    const VALUES = [data.creature_name, data.creature_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.updateCreature = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE Creatures 
        SET creature_name = ?, favourite_food = ?, hated_food = ? 
        WHERE creature_id = ?
    `;

    const VALUES = [data.creature_name, data.favourite_food, data.hated_food, data.creature_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}