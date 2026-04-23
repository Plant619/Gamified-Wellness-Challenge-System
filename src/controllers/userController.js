const userModel = require('../models/userModel');

module.exports.createUser = (req, res, next) => {

    // Checks that body contains username
    if (req.body == undefined || req.body.username == undefined) {
        res.status(400).send({"message": "Error: username is undefined"});
        return;
    }
    
    const data = {
        username: req.body.username, 
        points: 0
    }

    // Checks that username doesn't already exists
    const callback1 = (error, results, fields) => {
        if (error) {
            console.error("Error getUserByName: " + error);
            res.status(500).json(error);
        } else if (results.length > 0) {
            return res.status(409).send({"message": "Error: Username already exists"});
        } else {
            // Creates the User
            userModel.insertUser(data, callback2);
        }
    }

    const callback2 = (error, results, fields) => {
        if (error) {
            console.error("Error createUser: " + error); 
            res.status(500).json(error);
        } else {
            res.status(201).json({
                "user_id": results.insertId, 
                "username": data.username,
                "points": data.points
            });
        }
    }

    userModel.getUserByName(data, callback1);
}

module.exports.readAllUser = (req, res, next) => {

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllUser: " + error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    }

    userModel.selectAllUser(callback);
}

module.exports.readUserById = (req, res, next) => {
    
    const data = {
        user_id: req.params.id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readUserById" + error);
            res.status(500).json(error);
        } else {
            if (results.length == 0) {
                res.status(404).json({"message": "Error: User not found"});
            } else {
                res.status(200).json(results[0]);
            }
        }
    }

    userModel.selectUserById(data, callback);
}

module.exports.updateUserById = (req, res, next) => {

    if (req.body.username == undefined || req.body.points == undefined) {
        return res.status(400).json({"message": "Error: username or points is undefined. "})
    }

    const data = {
        user_id: req.params.id, 
        username: req.body.username, 
        points: req.body.points
    }

    // Checks that username doesn't already exist for another user
    const callback1 = (error, results, fields) => {
        if (error) {
            console.error("Error updateUserById: " + error);
            res.status(500).json(error);
        } else if (results.length > 0 && results[0].user_id != data.user_id) {
            return res.status(409).json({"message": "Error: Username already exists"});
        } else {
            userModel.updateUserById(data, callback2)
        }
    }

    const callback2 = (error, results, fields) => {
        if (error) {
            console.error("Error updateUserById: " + error);
            res.status(500).json(error);
        } else {
            if (results.affectedRows == 0) {
                res.status(404).json({"message": "User not found"});
            } else {
                res.status(200).json({
                    user_id: req.params.id, 
                    username: data.username, 
                    points: data.points
                });
            }
        }
    }

    userModel.getUserByName(data, callback1);
}

module.exports.top3Point = (req, res, next) => {

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error top3Point" + error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    }

    userModel.getTop3Point(callback);
}

module.exports.top3Friendship = (req, res, next) => {

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error top3Friendship" + error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    }

    userModel.getTop3Friendship(callback);
}

///////////////////////////////
// NEW
///////////////////////////////
module.exports.login = (req, res, next) => {
    if (!req.body || !req.body.username || !req.body.password) {
        return res.status(400).json({"message": "missing username or password"})
    }

    const data = {
        username: req.body.username
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error login:", error);
            res.status(500).json(error);
        } else {
            if (results.length == 0) {
                // user not found
                return res.status(404).json({
                    message: "Username or Password is incorrect"
                });
            } else {
                res.locals.hash = results[0].password;
                res.locals.userId = results[0].user_id;
                next();
            };
        }
    }

    userModel.selectByUsername(data, callback);
}



module.exports.checkUsernameExist = (req, res, next) => {
    if (!req.body || !req.body.username || !req.body.password) {
        return res.status(400).json({"message": "missing required information (username, password)"})
    }

    const data = {
        username: req.body.username
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkUsernameExist:", error);
            res.status(500).json(error);
        } else {
            if(results.length == 0) {
                next();
            } else {
                res.status(409).json({
                    message: "Username already exists"
                });
            };
        }
    }

    userModel.selectByUsername(data, callback);
}

module.exports.register = (req, res, next) => {

    const data = {
        username: req.body.username,
        password: res.locals.hash, 
        points: 0
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error register:", error);
            res.status(500).json(error);
        } else {
            res.locals.userId = results.insertId;
            next();
        }
    }

    userModel.insertUser(data, callback);
}

module.exports.deleteUser = (req, res, next) => {

    const data = {
        user_id: req.params.banned_user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteUser:", error);
            res.status(500).json(error);
        } else {
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "User not found" });
            } else {
                console.log('delete user done')
                res.status(204).send()
            }
        }
    }

    userModel.deleteUser(data, callback);
}
