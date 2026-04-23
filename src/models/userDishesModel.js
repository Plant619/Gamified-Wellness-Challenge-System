const pool = require('../services/db');

module.exports.selectAllDishes = (data, callback) => {
    const  SQLSTATEMENT = `
        SELECT * 
        FROM UserDishes u
        INNER JOIN Recipes r ON r.recipe_id = u.recipe_id
        WHERE u.user_id = ?;
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.getRecipeById = (data, callback) => {
    const  SQLSTATEMENT = `
        SELECT * 
        FROM Recipes
        WHERE recipe_id = ?;
    `;

    const VALUES = [data.recipe_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.getIngredientsByRecipeId = (data, callback) => {
        const  SQLSTATEMENT = `
        SELECT * 
        FROM RecipeIngredients
        WHERE recipe_id = ?;
    `;

    const VALUES = [data.recipe_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.getUserIngredientsByUserId = (data, callback) => {
    const  SQLSTATEMENT = `
        SELECT * 
        FROM UserIngredients 
        WHERE user_id = ?;
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.updateUserIngredientsByUserId = (data, callback) => {
    const  SQLSTATEMENT = `
        UPDATE UserIngredients 
        SET quantity = quantity - ?
        WHERE user_id = ?
        AND ingredient_id = ?;
    `;

    const VALUES = [data.quantity, data.user_id, data.ingredient_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.getDishById = (data, callback) => {
    const  SQLSTATEMENT = `
        SELECT * 
        FROM UserDishes
        WHERE recipe_id = ?
        AND user_id = ?;
    `;

    const VALUES = [data.recipe_id, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.updateDishById = (data, callback) => {
    const  SQLSTATEMENT = `
        UPDATE UserDishes 
        SET quantity = quantity + 1
        WHERE user_id = ?
        AND recipe_id = ?;
    `;

    const VALUES = [data.user_id, data.recipe_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.insertDish = (data, callback) => {
    const  SQLSTATEMENT = `
        INSERT INTO
        UserDishes (user_id, recipe_id, quantity)
        VALUES (?, ?, 1)
    `;

    const VALUES = [data.user_id, data.recipe_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.deleteDish = (data, callback) => {
    const  SQLSTATEMENT = `
        DELETE FROM UserDishes 
        WHERE user_id = ?
        AND recipe_id = ?;
    `;

    const VALUES = [data.user_id, data.recipe_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.decrementDish = (data, callback) => {
    const  SQLSTATEMENT = `
        UPDATE UserDishes 
        SET quantity = quantity - 1
        WHERE user_id = ?
        AND recipe_id = ?;
    `;

    const VALUES = [data.user_id, data.recipe_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.deleteQuantityZeroIngredients = (data, callback) => {
    const  SQLSTATEMENT = `
        DELETE FROM UserIngredients
        WHERE user_id = ?
        AND quantity <= 0
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.deleteDishByUserId = (data, callback) => {
    const  SQLSTATEMENT = `
        DELETE FROM UserDishes 
        WHERE user_id = ?
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}