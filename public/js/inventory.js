
document.addEventListener('DOMContentLoaded', () => {
    checkAdmin();
    showAdminTab();

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    let recipeIDList = [];
    // stores the recipe 
    let recipeData = [];
    // stores recipe ingredients
    let recipeIngredients = {};

    // Gets user ingredients
    function fetchIngredients() {
        const ingredientsURL = `http://localhost:3000/api/ingredients/${userId}`;

        const ingredientCallback = (responseStatus, responseData) => {
            if (responseStatus == 200) {
                console.log(responseData)

                // displays items
                displayIngredients(responseData);

            // Ingredients not found (user has no ingredients) (put like empty of a message)
            } else if (responseStatus == 404) {
                handle404Cases('ingredient');

            } else if (responseStatus == 401) {
                // redirects to login page
                window.location.href = './login.html'
            // Internal server error
            } else {
                alert('Error occured with the server. Check server is running before trying again. ')
            }

        }

        fetchMethod(ingredientsURL, ingredientCallback, 'GET', null, token);
    }

    // Gets user recipes
    function fetchRecipes() {
        const recipesURL = `http://localhost:3000/api/recipes/${userId}`;

        const recipeCallback = (responseStatus, responseData) => {
            if (responseStatus == 200) {
                console.log(responseData);

                // filtering all the recipeID
                recipeIDList = responseData.map(recipe => recipe.recipe_id);
                recipeData = responseData;

                // loops through each recipe id and gets the ingredients
                for (let i = 0; i < recipeIDList.length; i++) {
                    fetchRecipeIngredients(recipeIDList[i]);
                }

            // No recipes found 
            } else if (responseStatus == 404) {
                handle404Cases('recipe');

            // Token expired
            } else if (responseStatus == 401) {
                // redirects to login page
                window.location.href = './login.html'
            // Internal server error
            } else {
                alert('Error occured with the server. Check server is running before trying again. ')
            }
        }

        fetchMethod(recipesURL, recipeCallback, 'GET', null, token);
    }

    // Gets recipe ingredient (which ingredient a recipe contains)
    function fetchRecipeIngredients(recipe_id) {
        const recipeIngredientsURL = `http://localhost:3000/api/recipes/ingredient/${recipe_id}`;

        const recipeIngredientCallback = (responseStatus, responseData) => {
            if (responseStatus == 200) {
                console.log(responseData);
                recipeIngredients[recipe_id] = responseData;

                if (Object.keys(recipeIngredients).length == recipeData.length) {
                    displayRecipes(recipeData);
                }

            // recipe ingredients not found 
            } else if (responseStatus == 404) {
                alert('recipe ingredients not found');
                
            // Token expired
            } else if (responseStatus == 401) {
                // redirects to login page
                window.location.href = './login.html'

            // Internal server error
            } else {
                alert('Error occured with the server. Check server is running before trying again. ')
            }
        }

        fetchMethod(recipeIngredientsURL, recipeIngredientCallback, 'GET', null, token);
    }

    // Gets user dishes
    function fetchDishes() {
        const dishesURL = `http://localhost:3000/api/dishes/${userId}`;

        const dishCallback = (responseStatus, responseData) => {
            if (responseStatus == 200) {
                if (responseData.length == 0) {
                    handle404Cases('dish');
                    return;
                }

                console.log('fetch dish', responseData);

                // display dishes
                displayDishes(responseData);

            // token expired
            } else if (responseStatus == 401) {
                // redirects to login page
                window.location.href = './login.html'

            // Internal server error
            } else {
                alert('Error occured with the server. Check server is running before trying again. ')
            }
        }

        fetchMethod(dishesURL, dishCallback, 'GET', null, token);
    }

    // template for inventory items
    // const template = `
    //     <td id="itemID">
    //         <img class="format-ingredient-icon format-word" src="./images/" alt="">
    //         <p class="d-inline-block">
    //             <span class="format-word">TEMP WORD</span>
    //             <br>
    //             <small>Rarity</small>
    //             <br>
    //             <span class="fs-5">xQUANTITY</span>
    //         </p>
    //     </td>
    // `;


    // Displays user ingredients
    function displayIngredients(ingredientsData) {
        // items where the ingredients will be displayed
        const ingredientTable = document.getElementById('ingredientTable');

        // numItems = ingredientsData.length
        // i = current row
        // 5 items in one row
        const rowsNeeded = Math.ceil(ingredientsData.length / 5);

        // counts number of items added
        let counter = 0;

        // loops through rows
        for (let i = 0; i < rowsNeeded; i++) {

            // temporarily stores the html for the row
            let tempRowHTML = `<tr id="ingredientRow${i + 1}">`;

            // loops to add the items
            // exits after 5 items or if all ingredients have been added
            for (let j = 0; j < 5 && counter < ingredientsData.length; j++) {

                let currentIngredient = ingredientsData[counter];

                // all lowercase, splits into words, joins with '_'
                let formatImageName = currentIngredient.ingredient_name.toLowerCase().split(' ').join('_');

                tempRowHTML += `
                    <td  id="ingredient${currentIngredient.ingredient_id}">
                        <img class="format-ingredient-icon format-word mx-3 ${currentIngredient.rarity}image" src="./images/ingredient_${formatImageName}.png" alt="${currentIngredient.ingredient_name}" onerror="this.src='./images/ingredient_placeholder.png'">
                        <p class="d-inline-block">
                            <span class="format-word">${currentIngredient.ingredient_name}</span>
                            <br>
                            <small  class="${currentIngredient.rarity}">${currentIngredient.rarity}</small>
                            <br>
                            <span class="fs-5">x${currentIngredient.quantity}</span>
                        </p>
                    </td>
                `;

                counter++;
            }

            tempRowHTML += `</tr>`;

            // adds the html to the table
            ingredientTable.innerHTML += tempRowHTML;
            // clear 
            tempRowHTML = '';
        }

        // document.getElementById('ingredient1').addEventListener('pointerover', () => document.getElementById('ingredientMessage').textContent = 'test')

        // document.getElementById('ingredient1').addEventListener('pointerleave', () => document.getElementById('ingredientMessage').textContent = '')
    }   

    // Displays user recipes
    function displayRecipes(recipesData) {
        // items where the ingredients will be displayed
        const recipesTable = document.getElementById('recipeTable');

        // numItems = ingredientsData.length
        // i = current row
        // 3 items in one row
        const rowsNeeded = Math.ceil(recipesData.length / 2);

        // counts number of items added
        let counter = 0;

        // loops through rows
        for (let i = 0; i < rowsNeeded; i++) {

            // temporarily stores the html for the row
            let tempRowHTML = `<tr id="recipeRow${i + 1}">`;

            // loops to add the items
            // exits after 2 items or if all ingredients have been added
            for (let j = 0; j < 2 && counter < recipesData.length; j++) {

                let currentRecipe = recipesData[counter];
                let currentRecipeIngredients = recipeIngredients[currentRecipe.recipe_id];

                // contains the html for the list of ingredients
                let ingredientListHTML = `<ul>`;
                
                // formats in list format
                for (let k = 0; k < currentRecipeIngredients.length; k++) {
                    let formatIngredientImageName = currentRecipeIngredients[k].ingredient_name.toLowerCase().split(' ').join('_');

                    ingredientListHTML += `
                        <li>
                            <img class="format-recipe-ingredient" src="./images/ingredient_${formatIngredientImageName}.png" alt="${currentRecipeIngredients[k].ingredient_name}" onerror="this.src='./images/ingredient_placeholder.png'"> 
                            ${currentRecipeIngredients[k].ingredient_name} - x${currentRecipeIngredients[k].quantity}
                        </li>
                    `;
                }

                ingredientListHTML += '</ul>';


                // all lowercase, splits into words, joins with '_'
                let formatImageName = currentRecipe.recipe_name.toLowerCase().split(' ').join('_');

                tempRowHTML += `
                    <td id="recipe${currentRecipe.recipe_id}">
                        <div class="d-flex">
                            <img class="format-recipe-icon format-word mx-3" src="./images/recipe_${formatImageName}.png" alt="${currentRecipe.recipe_name}" onerror="this.src='./images/recipe_placeholder.png'">
                            <div class='mt-5'>
                                <p class="d-inline-block">
                                    <span class="format-word">${currentRecipe.recipe_name}</span>
                                    <br>
                                    Recipe Ingredients: 
                                </p>

                                ${ingredientListHTML}
                            </div>
                        </div>
                    </td>
                `;

                counter++;
            }

            tempRowHTML += `</tr>`;

            // adds the html to the table
            recipesTable.innerHTML += tempRowHTML;
            // clear 
            tempRowHTML = '';
        }
    }

    // Displays user dishes
    function displayDishes(dishesData) {
        
        // items where the ingredients will be displayed
        const dishesTable = document.getElementById('dishTable');

        // numItems = ingredientsData.length
        // i = current row
        // 3 items in one row
        const rowsNeeded = Math.ceil(dishesData.length / 2); 

        // counts number of items added
        let counter = 0;

        // loops through rows
        for (let i = 0; i < rowsNeeded; i++) {

            // temporarily stores the html for the row
            let tempRowHTML = `<tr id="dishesRow${i + 1}">`;

            // loops to add the items
            // exits after 2 items or if all ingredients have been added
            for (let j = 0; j < 2 && counter < dishesData.length; j++) {

                let currentDish = dishesData[counter];

                // all lowercase, splits into words, joins with '_'
                let formatImageName = currentDish.recipe_name.toLowerCase().split(' ').join('_');

                // if image file does not exist uses placeholder
                tempRowHTML += `
                    <td id="dish${currentDish.recipe_id}">
                        <div class="d-flex">
                            <img class="format-recipe-icon format-word mx-3" src="./images/dish_${formatImageName}.png" alt="${currentDish.recipe_name}" onerror="this.src='./images/dish_placeholder.png'">
                            <div class='mt-5'>
                                <p class="d-inline-block">
                                    <span class="format-word">${currentDish.recipe_name}</span>
                                    <br>
                                    <span class="fs-5">x${currentDish.quantity}</span>
                                </p>
                            </div>
                        </div>
                    </td>
                `;

                counter++;
            }

            tempRowHTML += `</tr>`;

            // adds the html to the table
            dishesTable.innerHTML += tempRowHTML;
            // clear 
            tempRowHTML = '';
        }
    }

    // name to tell which one: ingredient, recipe, dish
    // tells user they don't own any recipes/dishes/ingredients
    function handle404Cases(name) {
        if (name == 'ingredient') {
            const ingredientMessage = document.getElementById('ingredientMessage');
            ingredientMessage.innerText = 'You do not own any ingredients at the moment';

        } else if (name == 'recipe') {
            const recipeMessage = document.getElementById('recipeMessage');
            recipeMessage.innerText = 'You do not own any recipes at the moment';

        } else if (name == 'dish') {
            const dishMessage = document.getElementById('dishMessage');
            dishMessage.innerText = 'You do not own any dishes at the moment';

        }
    }

    fetchIngredients();
    fetchRecipes();
    fetchDishes();


})

