const pool = require('../services/db');

module.exports.insertCompletionRecord = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO UserCompletion (challenge_id, user_id, details)
        VALUES (?, ?, ?); 
    `;

    const VALUES = [data.challenge_id, data.user_id, data.details];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.getCompletionRecordById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * 
        FROM UserCompletion
        WHERE challenge_id = ?
    `;

    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.deleteCompletionRecordById = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE 
        FROM UserCompletion
        WHERE challenge_id = ?;
    `;

    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.selectCompletionByUserId = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * 
        FROM UserCompletion
        WHERE user_id = ?
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.deleteCompletionRecordByUserId = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE 
        FROM UserCompletion
        WHERE user_id = ?;
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}