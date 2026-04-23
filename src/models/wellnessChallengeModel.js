const pool = require('../services/db');

module.exports.insertChallenge = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO WellnessChallenge (creator_id, description, points)
        VALUES (?, ?, ?);
    `;  

    const VALUES = [data.creator_id, data.description, data.points];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.selectAllChallenge = (callback) => {
    const SQLSTATEMENT = `
        SELECT * 
        FROM WellnessChallenge
    `;

    pool.query(SQLSTATEMENT, callback);
}

module.exports.selectChallengeById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * 
        FROM WellnessChallenge
        WHERE challenge_id = ?;
    `;

    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.deleteChallengeById = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE 
        FROM WellnessChallenge
        WHERE challenge_id = ?;
    `

    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.updateChallengeById = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE WellnessChallenge
        SET description = ?, points = ?
        WHERE challenge_id = ?;
    `;

    const VALUES = [data.description, data.points, data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.deleteChallengeByUserId = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE From WellnessChallenge
        WHERE creator_id = ?;
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.selectChallengeByUserId = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * 
        From WellnessChallenge
        WHERE creator_id = ?;
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}