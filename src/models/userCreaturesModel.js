const pool = require('../services/db');

// all creatures
module.exports.selectAllCreatures = (callback) => {
    const  SQLSTATEMENT = `
        SELECT * 
        FROM Creatures;
    `;

    pool.query(SQLSTATEMENT, callback);
}

// all user creatures
module.exports.selectCreaturesByUserId = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * 
        FROM UserCreatures uc 
        INNER JOIN Creatures c
        ON uc.creature_id = c.creature_id
        WHERE user_id = ?
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

// user creature with specific id
module.exports.checkCreature = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * 
        FROM UserCreatures uc
        INNER JOIN Creatures c
        ON uc.creature_id = c.creature_id
        WHERE user_id = ? 
        AND c.creature_id = ?;
    `;

    const VALUES = [data.user_id, data.creature_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.updateFriendship = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE UserCreatures
        SET friendship = friendship + ? 
        WHERE user_id = ? 
        AND creature_id = ?;
    `;

    const VALUES = [data.friendship, data.user_id, data.creature_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.selectCreatureById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * 
        FROM Creatures
        WHERE creature_id = ?; 
    `;

    const VALUES = [data.creature_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.checkUserCreature = (data, callback) => {
    const  SQLSTATEMENT = `
        SELECT *
        FROM UserCreatures
        WHERE creature_id = ?
        AND user_id = ?;
    `;

    const VALUES = [data.creature_id, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.insertUserCreature = (data, callback) => {
    const  SQLSTATEMENT = `
        INSERT INTO UserCreatures (creature_id, user_id)
        VALUES (?, ?);
    `;

    const VALUES = [data.creature_id, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.selectCreaturesByCreatureName = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * 
        FROM Creatures 
        WHERE creature_name = ?
    `;

    const VALUES = [data.creature_name];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.deleteCreaturesFromUser = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE 
        FROM UserCreatures 
        WHERE user_id = ?
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}