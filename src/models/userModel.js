const pool = require('../services/db');

module.exports.getUserByName = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * 
        FROM User 
        WHERE username = ?;
    `;

    const VALUES = [data.username];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.insertUser = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO User (username, points, password)
        VALUES (?, ?, ?)
    `;

    const VALUES = [data.username, data.points, data.password];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.selectAllUser = (callback) => {
    const  SQLSTATEMENT = `
        SELECT * 
        FROM User;
    `;

    pool.query(SQLSTATEMENT, callback);
}

module.exports.selectUserById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * 
        FROM User
        WHERE user_id = ?
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.updateUserById = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE User 
        SET username = ?, points = ?
        WHERE user_id = ?
    `;

    const VALUES = [data.username, data.points, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.getTop3Point = (callback) => {
    const SQLSTATEMENT = `
        SELECT username, points 
        FROM User
        ORDER BY points DESC
        LIMIT 3;
    `;

    pool.query(SQLSTATEMENT, callback);
}

module.exports.getTop3Friendship = (callback) => {
    const SQLSTATEMENT = `
        SELECT u.username, SUM(uc.friendship) AS total_friendship
        FROM User u
        INNER JOIN UserCreatures uc ON u.user_id = uc.user_id 
        GROUP BY u.user_id, u.username
        ORDER BY total_friendship DESC
        LIMIT 3;
    `;

    pool.query(SQLSTATEMENT, callback);  
}

///////////////////////////
// NEW
///////////////////////////
module.exports.selectByUsername = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM User
    WHERE username = ?;
    `;
    const VALUES = [data.username];

    pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.deleteUser = (data, callback) => {
    const SQLSTATMENT = `
    DELETE FROM User
    WHERE user_id = ?;
    `;
    const VALUES = [data.user_id];

    pool.query(SQLSTATMENT, VALUES, callback);
}