const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const wellnessChallengeRoutes = require('./wellnessChallengeRoutes')
const userCompletionRoutes = require('./userCompletionRoutes');

const userIngredientsRoutes = require('./userIngredientsRoutes');
const userRecipesRoutes = require('./userRecipesRoutes');
const userCreaturesRoutes = require('./userCreaturesRoutes');
const adminRoutes = require('./adminRoutes');
const userDishesRoutes = require('./userDishesRoutes');

router.use("/users", userRoutes);
router.use("/challenges", wellnessChallengeRoutes);
router.use("/completion", userCompletionRoutes);

// added 
router.use("/ingredients", userIngredientsRoutes);
router.use("/recipes", userRecipesRoutes);
router.use("/creatures", userCreaturesRoutes);
router.use("/admin", adminRoutes);
router.use("/dishes", userDishesRoutes);

module.exports = router;
