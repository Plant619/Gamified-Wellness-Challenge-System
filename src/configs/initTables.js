const pool = require("../services/db");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const callback = (error, results, fields) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully");
  }
  process.exit();
}

bcrypt.hash('1234', saltRounds, (error, hash) => {
  if (error) {
    console.error("Error hashing password:", error);
  } else {
    console.log("Hashed password:", hash);

const SQLSTATEMENT = `
	DROP TABLE IF EXISTS UserDishes;

	DROP TABLE IF EXISTS UserCreatures;

	DROP TABLE IF EXISTS RecipeIngredients;

	DROP TABLE IF EXISTS UserRecipes;

	DROP TABLE IF EXISTS UserIngredients;

	DROP TABLE IF EXISTS UserCompletion;

	DROP TABLE IF EXISTS Creatures;

	DROP TABLE IF EXISTS Recipes;

	DROP TABLE IF EXISTS Ingredients;

	DROP TABLE IF EXISTS WellnessChallenge;

	DROP TABLE IF EXISTS User;

	CREATE TABLE User (
		user_id INT AUTO_INCREMENT PRIMARY KEY,
		username VARCHAR(255) NOT NULL,
		points INT DEFAULT 0, 
		password VARCHAR(255) NOT NULL,
		role VARCHAR(10) NOT NULL DEFAULT 'user'
	);

	CREATE TABLE WellnessChallenge (
		challenge_id INT AUTO_INCREMENT PRIMARY KEY,
		creator_id INT NOT NULL,
		description TEXT NOT NULL,
		points INT NOT NULL, 
		FOREIGN KEY (creator_id) REFERENCES User(user_id)
	);

	CREATE TABLE UserCompletion (
		completion_id INT AUTO_INCREMENT PRIMARY KEY,
		challenge_id INT NOT NULL,
		user_id INT NOT NULL,
		details TEXT, 
		FOREIGN KEY (challenge_id) REFERENCES WellnessChallenge(challenge_id), 
		FOREIGN KEY (user_id) REFERENCES User(user_id)
	);

	-- Gamification tables
	CREATE TABLE Ingredients (
		ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
		ingredient_name TEXT NOT NULL,
		rarity TEXT NOT NULL,
		description TEXT NOT NULL
	);

	CREATE TABLE UserIngredients (
		ingredient_id INT NOT NULL,
		user_id INT NOT NULL,
		quantity INT NOT NULL, 
		PRIMARY KEY (ingredient_id, user_id), 
		FOREIGN KEY (ingredient_id) REFERENCES Ingredients(ingredient_id), 
		FOREIGN KEY (user_id) REFERENCES User(user_id)
	);

	CREATE TABLE Recipes (
		recipe_id INT AUTO_INCREMENT PRIMARY KEY,
		recipe_name TEXT NOT NULL
	);

	CREATE TABLE UserRecipes (
		recipe_id INT NOT NULL,
		user_id INT NOT NULL, 
		PRIMARY KEY (recipe_id, user_id), 
		FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id),
		FOREIGN KEY (user_id) REFERENCES User(user_id)
	);

	CREATE TABLE RecipeIngredients (
		recipe_id INT NOT NULL,
		ingredient_id INT NOT NULL,
		quantity INT DEFAULT 1,
		PRIMARY KEY (recipe_id, ingredient_id), 
		FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id), 
		FOREIGN KEY (ingredient_id) REFERENCES Ingredients(ingredient_id)
	);

	CREATE TABLE Creatures (
		creature_id INT AUTO_INCREMENT PRIMARY KEY,
		creature_name TEXT NOT NULL,
		favourite_food TEXT,
		hated_food TEXT
	);

	CREATE TABLE UserCreatures (
		creature_id INT NOT NULL,
		user_id INT NOT NULL, 
		friendship INT DEFAULT 0, 
		last_fed TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
		PRIMARY KEY (creature_id, user_id), 
		FOREIGN KEY (creature_id) REFERENCES Creatures(creature_id), 
		FOREIGN KEY (user_id) REFERENCES User(user_id)
	);

	CREATE TABLE UserDishes (
		recipe_id INT NOT NULL,
		user_id INT NOT NULL, 
		quantity INT DEFAULT 0, 
		PRIMARY KEY (recipe_id, user_id), 
		FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id), 
		FOREIGN KEY (user_id) REFERENCES User(user_id)
	);

	INSERT INTO User (username, points, password, role) VALUES
	('Admin', 999, '${hash}', 'admin'),
	('Stelle', 15, '${hash}', 'user'),
	('Himeko', 40, '${hash}', 'user'),
	('Kafka', 5, '${hash}', 'user');

	INSERT INTO WellnessChallenge (creator_id, description, points) VALUES
	(1, 'Sleep like a boss – Get 7+ hours of sleep', 10), 
	(1, 'Stairs over elevator? Respect. – Take the stairs today', 20), 
	(2, 'Digital detox (mini edition) – No phone for 1 hour', 10), 
	(2, 'Touch grass IRL – Take a 15-minute walk outside', 10), 
	(2, 'IRL > DMs – Talk to a friend face-to-face', 20), 
	(3, 'Declutter your chaos – Clean your desk or room', 20), 
	(3, 'Help a homie – Assist someone without being asked', 20);

	INSERT INTO UserCompletion (challenge_id, user_id, details) VALUES
	(1, 1, 'Slept 8 hours'),
	(2, 2, 'Took stairs at work'),
	(3, 1, 'Phone off during lunch'),
	(5, 3, 'Talked to a friend at school'),
	(6, 2, 'Cleaned desk'),
	(7, 1, 'Helped a neighbor with groceries');

	-- Gamification tables
	INSERT INTO Ingredients (ingredient_name, rarity, description) VALUES
	('Raw meat', 'Common', 'A fresh chunk of meat. Handled properly, it can be used to make delicious food.'),
	('Potato', 'Common', 'A chunky vegetable. A gift from the earth that you never tire of with its multitude of cooking methods.'),
	('Small Lamp Grass', 'Common', 'A wild grass that emits light at night. Used in cooking to enhance other flavors.'),
	('Cheese', 'Rare', 'Made from fermented milk. High in energy, it''s used in a wide range of dishes.'), 
	('Bird egg', 'Common', 'An incredibly versatile ingredient that can supply all of your daily protein needs.'),
	('Flour', 'Common', 'A powder ground from wheat. No matter what it goes into it brings a sense of satisfaction to te hdiner.'),
	('Ham', 'Uncommon', 'Smoked leg meat. Even the thinnest slice is packed full of flavor.'), 
	('Apple', 'Common', 'Crisp and fragrant. Delicious raw or made into wine.'), 
	('Butter', 'Uncommon', 'An extract from milk. With the appropriate application, it can bring rich aromas to even the most basic ingredients.');

	INSERT INTO UserIngredients (ingredient_id, user_id, quantity) VALUES
	(1, 1, 5),
	(2, 1, 3),
	(3, 1, 2), 
	(4, 1, 5),
	(2, 2, 3),
	(5, 2, 3),
	(3, 2, 1),
	(4, 3, 1), 
	(5, 3, 4), 
	(6, 3, 2), 
	(8, 3, 5), 
	(9, 3, 2);

	INSERT INTO Recipes (recipe_name) VALUES
	('Pile ''Em Up'),
	('Adventurer''s Breakfast Sandwich'),
	('Apple Roly Poly');

	INSERT INTO RecipeIngredients (recipe_id, ingredient_id, quantity) VALUES
	(1, 1, 3),   
	(1, 2, 3),   
	(1, 3, 1),   
	(1, 4, 1),   
	(2, 5, 4),   
	(2, 6, 3),
	(2, 7, 1), 
	(3, 8, 4), 
	(3, 5, 2), 
	(3, 6, 2), 
	(3, 9, 1);

	INSERT INTO UserRecipes (recipe_id, user_id) VALUES
	(1, 1),
	(2, 2),
	(3, 1),
	(3, 3), 
	(1, 3);


	INSERT INTO Creatures (creature_name, favourite_food, hated_food) VALUES
	('Queen Slime', 'Apple Roly Poly', 'Pile ''Em Up'),
	('King Slime', 'Pile ''Em Up', 'Adventurer''s Breakfast Sandwich'),
	('Mimic', 'Adventurer''s Breakfast Sandwich', 'Apple Roly Poly'), 
	('Empress of Light', 'Apple Roly Poly', 'Pile ''Em Up'), 
	('Snorlax', 'Pile ''Em Up', 'Adventurer''s Breakfast Sandwich');

	INSERT INTO UserCreatures (creature_id, user_id) VALUES
	(1, 1),
	(2, 1),
	(3, 2), 
	(1, 3), 
	(4 ,4);

	INSERT INTO UserDishes (recipe_id, user_id, quantity) VALUES
	(1, 1, 1),  
	(1, 2, 2),  
	(2, 2, 2), 
	(3, 1, 1),  
	(1, 3, 3), 
	(1, 4, 4);
	`;

    pool.query(SQLSTATEMENT, callback);
  }
});
