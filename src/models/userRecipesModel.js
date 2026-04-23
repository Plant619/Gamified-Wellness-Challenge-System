const pool = require('../services/db');

module.exports.selectAllRecipes = (callback) => {
    const  SQLSTATEMENT = `
        SELECT *
        FROM Recipes;
    `;

    pool.query(SQLSTATEMENT, callback);
}

module.exports.selectRecipesByUserId = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT *
        FROM UserRecipes ur
        INNER JOIN Recipes r
        ON ur.recipe_id = r.recipe_id
        WHERE user_id = ?;
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.selectRecipeName = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT recipe_name
        FROM Recipes
        WHERE recipe_id = ?;
    `;

    const VALUES = [data.recipe_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.selectIngredientByRecipe = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT *
        FROM RecipeIngredients ri
        INNER JOIN Recipes r ON ri.recipe_id = r.recipe_id
        INNER JOIN Ingredients i ON ri.ingredient_id = i.ingredient_id
        WHERE r.recipe_id = ?;
    `;

    const VALUES = [data.recipe_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.selectRecipeByid = (data, callback) => {
    const  SQLSTATEMENT = `
        SELECT *
        FROM Recipes
        WHERE recipe_id = ?;
    `;

    const VALUES = [data.recipe_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.checkUserRecipe = (data, callback) => {
    const  SQLSTATEMENT = `
        SELECT *
        FROM UserRecipes
        WHERE recipe_id = ?
        AND user_id = ?;
    `;

    const VALUES = [data.recipe_id, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.deductRecipeCost = (data, callback) => {
    const  SQLSTATEMENT = `
        UPDATE User
        SET points = points - 100
        WHERE user_id = ?;
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.insertUserRecipe = (data, callback) => {
    const  SQLSTATEMENT = `
        INSERT INTO UserRecipes (recipe_id, user_id)
        VALUES (?, ?);
    `;

    const VALUES = [data.recipe_id, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.deleteRecipeByUserId = (data, callback) => {
    const  SQLSTATEMENT = `
        DELETE FROM UserRecipes 
        WHERE user_id = ?
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}
