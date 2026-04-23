const pool = require('../services/db');

module.exports.selectAllIngredients = (callback) => {
    const  SQLSTATEMENT = `
        SELECT * 
        FROM Ingredients;
    `;

    pool.query(SQLSTATEMENT, callback);
}

module.exports.selectIngredientsByUserId = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT *
        FROM UserIngredients 
        INNER JOIN Ingredients ON UserIngredients.ingredient_id = Ingredients.ingredient_id
        WHERE user_id = ?
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.insertUserIngredient = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO UserIngredients (ingredient_id, user_id, quantity)
        VALUES (?, ?, ?);
    `;

    const VALUES = [data.ingredient_id, data.user_id, data.quantity];

    pool.query(SQLSTATEMENT, VALUES, callback);    
}

module.exports.updateUserIngredient = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE UserIngredients
        SET quantity = quantity + ?
        WHERE user_id = ?
        AND ingredient_id = ?;
    `;

    const VALUES = [data.quantity, data.user_id, data.ingredient_id];

    pool.query(SQLSTATEMENT, VALUES, callback);  
}

module.exports.selectIngredientByUserIdAndIngredientId = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT *
        FROM UserIngredients
        WHERE user_id = ?
        AND ingredient_id = ? 
    `;

    const VALUES = [data.user_id, data.ingredient_id];

    pool.query(SQLSTATEMENT, VALUES, callback);      
}

module.exports.selectIngredientByIngredientId = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT *
        FROM Ingredients 
        WHERE ingredient_id = ?
    `;

    const VALUES = [data.ingredient_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.deductCost = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE User
        SET points = points - ?
        WHERE user_id = ?;
    `;

    const VALUES = [data.price, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.deleteIngredientByUserId = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM UserIngredients
        WHERE user_id = ?;
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}