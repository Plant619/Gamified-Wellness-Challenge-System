# Wellness Challenge Web Application

## Project Overview
This includes both the updated backend and the frontend of the application. Using fetch API for the frontend to communicate with the backend. After login in, users are able to complete wellness challenges and create wellness challenges. Completing challenges earns them ingredients and points which allow them to buy ingredients and recipes in the shop. Users can check the ingredients, recipes and dishes that they own in their inventory. Using the recipes and ingredients, users can cook dishes in the cook tab. Dishes cooked can then be fed to Snorlax which earns them friendship points. Users can also check their stats in the profile page. 

Admins have access to the admin tab which allows them to view all users and their information, ban users which deletes all information related to the user such as ingredients, points, challenges created, etc. Admins can also create new ingredients and new recipes with their corresponding recipe ingredients. Admins can also add new recipe ingredients to already existing recipes. 
Default admin account: 
    Username: Admin
    Password: 1234

## Features
1. User registration and login
2. Complete and create wellness challenges
3. Inventory to see ingredients, recipes and dishes
4. Buy ingredients and recipes
5. Cook dishes with ingredients and recipes owned
6. Feed creature with dishes cooked
7. Admin specific features

## Project Setup
1. Clone the repository

2. Install the required dependencies
In your terminal, type:

    ```
    npm i bcrypt, nodemon, dotenv, express, jsonwebtoken, mysql2, node-fetch
    ```

3. Setup the database
In MySQL Workbench, create a new schema

4. Make your .env file
It should look something like this: 

```
DB_HOST=<your_database_host>
DB_USER=<your_database_user>
DB_PASSWORD=<your_database_password>
DB_DATABASE=<your_database_name>
JWT_SECRET_KEY=<your_secret_key>
JWT_EXPIRES_IN=<duration>
JWT_ALGORITHM=<selected_algorithm>
```

Replace `<your_database_host>`, `<your_database_user>`, `<your_database_password>`, and `<your_database_name>` with the appropriate values for your database connection.

Replace `<your_secret_key>`, `<duration>`, and `<selected_algorithm>` with the appropriate values for your JSON web token usage.

5. Create the database
In your terminal, type:

    ```
    npm run init_tables
    ```

6. Start the server
In your terminal, type:

    ``` 
    npm run dev 
    ```

    (make sure to only run the server in one terminal)

7. Open frontend
Open a new tab in your browser and type localhost:3000/index.html in the url 

8. Register and login to start playing
Click the sign in tab and register an account and then login to play

## Folder Structure

```
bed-ca2-plant618
├─ public
│  ├─ css
│  │  ├─ cooking.css
│  │  ├─ game.css
│  │  ├─ inventory.css
│  │  ├─ profile.css
│  │  ├─ quest.css
│  │  ├─ register.css
│  │  ├─ shop.css
│  │  └─ styles.css
│  ├─ images
│  ├─ js
│  │  ├─ admin.js
│  │  ├─ cooking.js
│  │  ├─ feed.js
│  │  ├─ game.js
│  │  ├─ inventory.js
│  │  ├─ login.js
│  │  ├─ queryCmd.js
│  │  ├─ recipes.js
│  │  ├─ register.js
│  │  ├─ script.js
│  │  ├─ shop.js
│  │  └─ quest.jsW
│  ├─ game_admin.html
│  ├─ game_cooking.html
│  ├─ game_feed.html
│  ├─ game_inventory.html
│  ├─ game_profile.html
│  ├─ game_quest.html
│  ├─ game_shop.html
│  ├─ index.html
│  ├─ login.html
│  ├─ register.html
│  └─ tutorial.html
├─ src
│  ├─ configs
│  │  ├─ createSchema.js
│  │  └─ initTables.js
│  ├─ controllers
│  │  ├─ adminController.js 
│  │  ├─ userCompletionController.js 
│  │  ├─ userController.js
│  │  ├─ userCreaturesController.js
│  │  ├─ userDishesController.js
│  │  ├─ userIngredientsController.js
│  │  ├─ userRecipesController.js
│  │  └─ wellnessChallengeController.js
│  ├─ middlewares
│  │  ├─ bcryptMiddleware.js
│  │  └─ jwtMiddleware.js
│  ├─ models
│  │  ├─ adminModel.js
│  │  ├─ userCompletionModel.js
│  │  ├─ userCreaturesModel.js
│  │  ├─ userDishesModel.js
│  │  ├─ userIngredientsModel.js
│  │  ├─ userModel.js
│  │  ├─ userRecipesModel.js
│  │  └─ wellnessChallengeModel.js
│  ├─ routes
│  │  ├─ adminRoutes.js
│  │  ├─ mainRoutes.js
│  │  ├─ userCompletionRoutes.js
│  │  ├─ userCreaturesRoutes.js
│  │  ├─ userDishesRoutes.js
│  │  ├─ userIngredientsRoutes.js
│  │  ├─ userRecipesRoutes.js
│  │  ├─ userRoutes.js
│  │  └─ wellnessChallengeRoutes.js
│  ├─ services
│  │  └─ db.js
│  └─ app.js
├─ index.js
├─ package.json
└─ readme.md
```

## Updated Backend Endpoints

### USER 
| Method | Route                  | Description                            | Request Body                |
| ------ | ---------------------- | -------------------------------------- | --------------------------- |
| POST   | /users                 | Creates a new user                     | username                    |
| GET    | /users                 | Lists all users                        |                             |
| GET    | /users/{user_id}       | Lists user by ID                       |                             |
| PUT    | /users/{user_id}       | Updates user by ID                     | username, points            |
| GET    | /users/top3/point      | Lists top 3 users with most points     |                             |
| GET    | /users/top3/friendship | Lists top 3 users with most friendship |                             |
| POST   | /users/register        | Registers a new user                   | username, password          |
| POST   | /users/login           | Log in with an existing user           | username, password          |

### WELLNESS CHALLENGE 
| Method | Route                      | Description                        | Request Body                             |
| ------ | -------------------------- | ---------------------------------- | ---------------------------------------- |
| POST   | /challenges                | Creates a new challenge            | user_id, description and points          |
| GET    | /challenges                | Lists all challenges               |                                          |
| GET    | /challenges/user/{user_id} | Lists challenges created by a user |                                          |
| DELETE | /challenges/{challenge_id} | Deletes a challenge by ID          |                                          |
| PUT    | /challenges/{challenge_id} | Updates a challenge by ID          | user_id, description, points in req body |

### USER COMPLETION
| Method | Route                      | Description                                                                      | Request Body               |
| ------ | -------------------------- | -------------------------------------------------------------------------------- | -------------------------- |
| POST   | /completion/{challenge_id} | Creates a completion record for a user and rewards user with 1 random ingredient | user_id and details        |
| GET    | /completion/{challenge_id} | Lists completion records for a challenge                                         |                            |
| GET    | /completion/user/{user_id} | Lists all completion records for a user                                          |                            |

### USER INGREDIENTS
| Method | Route                                  | Description                              | Request Body   |
| ------ | -------------------------------------- | ---------------------------------------- | -------------- |
| GET    | /ingredients                           | Lists all ingredients                    |                |
| GET    | /ingredients/{user_id}                 | Lists all ingredients owned by a user    |                |
| POST   | /ingredients/buy/{user_id}             | Buy ingredient using points              | ingredient_id  |

### USER RECIPES
| Method | Route                         | Description                                | Request Body        |
| ------ | ----------------------------- | ------------------------------------------ | ------------------- |
| GET    | /recipes                      | Lists all recipes                          |                     |
| GET    | /recipes/{user_id}            | Lists all recipes owned by a user          |                     |
| GET    | /recipes/ingredient/{user_id} | Lists all ingredients that recipe requires |                     |
| POST   | /recipes/buy/{user_id}        | Adds a recipe to a user for 100 points     | recipe_id           |

### USER CREATURES
| Method | Route                                         | Description                                        | Request Body                |
| ------ | --------------------------------------------- | -------------------------------------------------- | --------------------------- |
| GET    | /creatures                                    | Lists all creatures                                |                             |
| GET    | /creatures/{user_id}                          | Lists all creatures owned by a user                |                             |
| POST   | /creatures/buy/{user_id}                      | Adds a creature to a user for 100 points           | creature_id                 |
| PUT    | /creatures/feed/{user_id}                     | Feeds and increases friendship level of a creature | creature_id, recipe_id      |
| GET    | /creatures/status/{user_id}/{creature_id}     | Lists creature mood and when they were last fed    |                             |
| POST   | /creatures/snorlax/{user_id}                  | Adds Snorlax to user                               | creature_id                 |
| GET    | /creatures/snorlax                            | Lists Snorlax creature                             |                             |


### USER DISHES
| Method | Route                              | Description                               | Request Body               |
| ------ | ---------------------------------- | ----------------------------------------- | -------------------------- |
| POST   | /dishes/cook/{user_id}             | Cook new dish (using recipe owned by user)| recipe_id                  |
| GET    | /dishes/{user_id}                  | Lists all dishes owned by user            |                            |

### ADMIN
| Method | Route                              | Description                               | Request Body                                                |
| ------ | ---------------------------------- | ----------------------------------------- | ----------------------------------------------------------- |
| POST   | /admin/ingredients/{user_id}       | Creates new ingredient                    | ingredient_name, rarity, description                        |
| POST   | /admin/recipes/{user_id}           | Creates new recipe                        | recipe_name                                                 |
| POST   | /admin/creatures/{user_id}         | Creates new creature                      | creature_name, favourite_food, hated_food                   |
| POST   | /admin/recipeIngredients/{user_id} | Adds ingredients to a recipe              | recipe_id, ingredient_id, quantity (optional, default: 1)   |
| PUT    | /admin/creatures/{user_id}         | Updates creature info                     | creature_id, creature_name, favourite_food, hated_food      |
| GET    | /admin/users/{user_id}             | Lists all users                           |                                                             |
| DELETE | /admin/{user_id}/{banned_user_id}  | Deletes user and all related records      |                                                             |
