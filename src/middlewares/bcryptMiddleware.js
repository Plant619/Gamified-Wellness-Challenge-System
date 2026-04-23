const bcrypt = require("bcrypt");

// Number of salt rounsg
const saltRounds = 10;

// Compares password
module.exports.comparePassword = (req, res, next) => {
    // Check password
    const callback = (err, isMatch) => {
        if (err) {
            console.error("Error bcrypt:", err);
            res.status(500).json(err);
        } else {
            if (isMatch) {
                next();
            } else {
                res.status(401).json({
                    message: "Wrong username or password",
                });
            }
        }
    };

    bcrypt.compare(req.body.password, res.locals.hash, callback);
};

// Hashes password
module.exports.hashPassword = (req, res, next) => {
    const callback = (err, hash) => {
        if (err) {
            console.error("Error bcrypt:", err);
            res.status(500).json(err);
        } else {
            res.locals.hash = hash;
            next();
        }
    };

    bcrypt.hash(req.body.password, saltRounds, callback);
};


