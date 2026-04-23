document.addEventListener('DOMContentLoaded', () => {
    checkAdmin();
    
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    // check what recipes the user has only display the recipes they don't own

    let ingredientData = [];
    let recipesData = [];
    let notOwnedRecipe = [];
    let recipeIngredients = [];

    const shopToast = document.getElementById('shop-toast');
    const toast = new bootstrap.Toast(shopToast);

    function fetchIngredients() {
        const ingredientsURL = `http://localhost:3000/api/ingredients`;

        const ingredientCallback = (responseStatus, responseData) => {
            if (responseStatus == 200) {
                console.log(responseData);
                ingredientData = responseData;

                // displays items
                displayIngredients(responseData);

            // token expired
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

    function fetchRecipes() {
        const recipesURL = `http://localhost:3000/api/recipes`;

        const recipeCallback = (responseStatus, responseData) => {
            if (responseStatus == 200) {
                console.log(responseData);
                recipesData = responseData;

                // fetches recipes user owns
                fetchUserRecipes();

            // token expired
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

    // Gets user recipes
    function fetchUserRecipes() {
        const recipesURL = `http://localhost:3000/api/recipes/${userId}`;

        const recipeCallback = (responseStatus, responseData) => {
            if (responseStatus == 200) {
                console.log(responseData);

                let allRecipeIDs = recipesData.map(recipe => recipe.recipe_id);
                let ownedRecipeIDs = responseData.map(recipe => recipe.recipe_id);

                let notOwnedRecipeIDs = allRecipeIDs.filter(recipeID => !ownedRecipeIDs.includes(recipeID));

                notOwnedRecipe = recipesData.filter(recipe => notOwnedRecipeIDs.includes(recipe.recipe_id));

                // user owns all recipes
                if (notOwnedRecipe.length == 0) {
                    // show that there are no more recipes to buy
                    document.getElementById('recipeMessage').textContent = "Gorb has no more recipes for you to purchase. You own every recipe. Come back next time for more. ";

                // get recipe ingredients
                } else {
                    for (let i = 0; i < notOwnedRecipe.length; i++) {
                        fetchRecipeIngredients(notOwnedRecipe[i].recipe_id);
                    }
                
                }

            // user does not own any recipes
            } else if (responseStatus == 404) {
                notOwnedRecipe = recipesData;
                for (let i = 0; i < recipesData.length; i++) {
                    fetchRecipeIngredients(recipesData[i].recipe_id);
                }

            // token expired 
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

    function fetchRecipeIngredients(recipe_id) {
        const recipeIngredientsURL = `http://localhost:3000/api/recipes/ingredient/${recipe_id}`;

        const recipeIngredientCallback = (responseStatus, responseData) => {
            if (responseStatus == 200) {
                console.log(responseData);
                recipeIngredients.push(responseData);

                if (recipeIngredients.length == notOwnedRecipe.length) {
                    displayRecipesNotOwned(notOwnedRecipe, recipeIngredients);
                }

            // recipe ingredients not found 
            } else if (responseStatus == 404) {
                alert('recipe ingredients not found (recipe does not contain any recipe ingredients)');
                
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

    fetchIngredients();
    fetchRecipes();

    // displays ingredients
    function displayIngredients(ingredientsData) {
        let ingredientShop = document.getElementById('ingredientGrid');
        let counter = 0;
        let rowsNeeded = Math.ceil(ingredientsData.length / 6);

        // loops through needed rows
        for (let i = 0; i < rowsNeeded; i++) {
            let price = 0;
            let tempHTML = '<div class="row align-items-stretch">';

            // 6 items in a row
            // stops after 6 items or if items are all added
            for (let j = 0; j < 6 && counter < ingredientsData.length; j++) {
                let currentIngredient = ingredientsData[counter];

                // determine price based on rarity 
                if (currentIngredient.rarity == 'Common') {
                    price = 10;
                } else if (currentIngredient.rarity == 'Uncommon') {
                    price = 20;
                } else if (currentIngredient.rarity == 'Rare') {
                    price = 50;
                } else if (currentIngredient.rarity == 'Epic') {
                    price = 100;
                } else if (currentIngredient.rarity == 'Legendary') {
                    price = 1000;
                }

                currentIngredient.price = price;

                let formatImageName = currentIngredient.ingredient_name.toLowerCase().split(' ').join('_');
                
                tempHTML += `
                    <div class="col-6 col-md-2" id="ingredient${currentIngredient.ingredient_id}">
                        <div class="h-100 d-flex flex-column">
                            <img class="format-ingredient-icon format-word ${currentIngredient.rarity}image" src="./images/ingredient_${formatImageName}.png" alt="${currentIngredient.ingredient_name}" onerror="this.src='./images/ingredient_placeholder.png'">
                            <p class="d-inline-block">
                                <span class="format-word">${currentIngredient.ingredient_name}</span>
                                <br>
                                <small  class="${currentIngredient.rarity}">${currentIngredient.rarity}</small>
                            </p>

                            <div class="mt-auto">
                                <div class="d-flex mt-auto">
                                    <input type="number" min="1" class="form-control" id="buyQuantity${currentIngredient.ingredient_id}">
                                </div>
                                <p class="mt-2">
                                    Total: 
                                    <span class="text-nowrap">
                                        <img class="format-points" src="./images/points_icon.png">
                                        <span id="totalPrice${currentIngredient.ingredient_id}">${price}</span>
                                    </span>
                                </p>
                                <button class="btn btn-primary w-100" id="buyIngredient${currentIngredient.ingredient_id}">Buy</button>
                            </div>
                        </div>
                    </div>
                `;

                counter++;
            }

            tempHTML += `</div>`;
            ingredientShop.innerHTML += tempHTML;
        }

        addIngredientEventListener(ingredientsData);
    }

    function displayRecipesNotOwned(notOwnedRecipe, recipeIngredients) {
        console.log('notowned: ', notOwnedRecipe)
        console.log('recipeingredient', recipeIngredients)
        // doesn't show quantity of ingredient 

        // where the recipes will be displayed
        let recipeShop = document.getElementById('recipeGrid');

        // counts the number of recipes displayed
        let counter = 0;
        let price = 100;
        let rowsNeeded = Math.ceil(notOwnedRecipe.length / 2);

        // loops through needed rows
        for (let i = 0; i < rowsNeeded; i++) {
            let tempHTML = '<div class="row align-items-stretch">';

            // 2 items in a row
            // stops after 2 items or if items are all added
            for (let j = 0; j < 2 && counter < notOwnedRecipe.length; j++) {
                let currentRecipe = notOwnedRecipe[counter];
                let ingredientList = recipeIngredients.find(recipeList => recipeList[0].recipe_id == currentRecipe.recipe_id);
                let ingredientListHTML = '<ul class="bg-dark text-light">';

                // format ingredient into list
                for (let k = 0; k < ingredientList.length; k++) {
                    let currentRecipeIngredients = ingredientList[k];
                    let formatIngredientImageName = currentRecipeIngredients.ingredient_name.toLowerCase().split(' ').join('_');

                    ingredientListHTML += `
                        <li>
                            <img class="format-recipe-ingredient" src="./images/ingredient_${formatIngredientImageName}.png" alt="${currentRecipeIngredients.ingredient_name}" onerror="this.src='./images/ingredient_placeholder.png'"> 
                            ${currentRecipeIngredients.ingredient_name}
                        </li>
                    `;
                }

                ingredientListHTML += '</ul>'

                let formatImageName = currentRecipe.recipe_name.toLowerCase().split(' ').join('_');
                
                tempHTML += `
                    <div class="col-6" id="recipe${currentRecipe.recipe_id}">
                        <div class="h-100 d-flex flex-column">
                            <img class="format-recipe-icon format-word mx-3" src="./images/recipe_${formatImageName}.png" alt="${currentRecipe.recipe_name}" onerror="this.src='./images/recipe_placeholder.png'">
                            <div class='mt-5'>
                                <p class="d-inline-block">
                                    <span class="format-word fs-4">${currentRecipe.recipe_name}</span>
                                    <br>
                                    Recipe Ingredients: 
                                </p>
                                ${ingredientListHTML}
                                <span class="fs-5"><img class="format-points" src="./images/points_icon.png">${price}</span>
                            </div>

                            <button class="btn btn-primary mt-auto" id="buyRecipe${currentRecipe.recipe_id}">Buy</button>
                        </div>
                    </div>
                `;

                counter++;
            }

            tempHTML += `</div>`;
            recipeShop.innerHTML += tempHTML;
        }

        addRecipeEventListener(notOwnedRecipe);
    }

    // adds event listener to all buy buttons for ingredient
    function addIngredientEventListener(ingredientList) {
        for (let i = 0; i < ingredientList.length; i++) {
            let currentIngredient = ingredientList[i];
            let totalPrice = document.getElementById(`totalPrice${currentIngredient.ingredient_id}`);
            let quantityField = document.getElementById(`buyQuantity${currentIngredient.ingredient_id}`);

            // listens for quantity changes 
            quantityField.addEventListener('input', () => {
                let quantityInputted = parseInt(quantityField.value);
                // guards against negative numbers and 0
                if (isNaN(quantityField.value)) {
                    // just 1 item
                    totalPrice.innerText = currentIngredient.price;
                } else {
                    totalPrice.innerText = currentIngredient.price * (Math.abs(quantityInputted) || 1);
                }
            })

            // listens for buy button click
            document.getElementById(`buyIngredient${currentIngredient.ingredient_id}`).addEventListener('click', () => buyIngredient(currentIngredient.ingredient_id, quantityField.value));
        }
    }

    // adds event listener to all buy buttons for recipe
    function addRecipeEventListener(recipeList) {
        for (let i = 0; i < recipeList.length; i++) {
            let currentRecipe = recipeList[i];

            document.getElementById(`buyRecipe${currentRecipe.recipe_id}`).addEventListener('click', () => buyRecipe(currentRecipe.recipe_id));
        }
    }

    function buyIngredient(ingredient_id, inputQuantity) {
        modal.hide();

        const data = {
            ingredient_id: ingredient_id
        }

        let quantity = parseInt(inputQuantity);

        // if quantity not a number default 1
        if (isNaN(quantity)) {
            data.quantity = 1;
        } else if (quantity == 0) {
            data.quantity = 1;
        } else {
            // guards against negative number 
            data.quantity = Math.abs(quantity);
        }

        const buyIngredientURL = `http://localhost:3000/api/ingredients/buy/${userId}`;

        const callback = (responseStatus, responseData) => {
            if (responseStatus == 201) {
                console.log(responseData);

                // show that ingredient has been bought

                // adding text and styling to toast
                document.getElementById('toast-title').textContent = 'Bought Ingredient Successfully';
                document.getElementById('toast-header').style.backgroundColor = '#29b32e';
                document.getElementById('toast-title').style.color = 'white';
                document.getElementById('toast-text').textContent = 'Check your inventory to see items bought'

                // call again to show points updating
                getPoints()
                toast.show();

            // Insufficient points
            } else if (responseStatus == 403) {

                // show that user has insufficient points

                // adding text and styling to toast
                document.getElementById('toast-title').textContent = 'Insufficient points';
                document.getElementById('toast-header').style.backgroundColor = '#d13a11';
                document.getElementById('toast-title').style.color = 'white';
                document.getElementById('toast-text').textContent = 'You do not have enough points to buy this ingredient. '

                toast.show();

            // missing required information (ingredient_id) 
            // or user or ingredient not found (shouldn't happen)
            } else if (responseStatus == 400 || responseStatus == 404) {
                // get user to try again
                alert('Ingredient not found or ingredient_id not provided. Try again later. ')

            // token expired
            } else if (responseStatus == 401) {
                // redirects to login page
                window.location.href = './login.html'

            // Internal server error
            } else {
                alert('Error occured with the server. Check server is running before trying again. ')
            }

        }

        fetchMethod(buyIngredientURL, callback, "POST", data, token);
    }

    function buyRecipe(recipe_id) {
        modal.hide();

        const data = {
            recipe_id: recipe_id
        }

        const buyIngredientURL = `http://localhost:3000/api/recipes/buy/${userId}`;

        const callback = (responseStatus, responseData) => {
            if (responseStatus == 201) {
                console.log(responseData);

                // show that recipe has been bought

                // adding text and styling to toast
                document.getElementById('toast-title').textContent = 'Bought Recipe Successfully';
                document.getElementById('toast-header').style.backgroundColor = '#29b32e';
                document.getElementById('toast-title').style.color = 'white';
                document.getElementById('toast-text').textContent = 'Check your inventory for the recipe'

                // call again to show points updating
                getPoints();

                // clear 
                document.getElementById('recipeGrid').innerHTML = '';
                recipeIngredients = [];
                recipesData = [];
                notOwnedRecipe = [];
                // call again to remove the bought recipe from showing up
                fetchRecipes();

                toast.show();

            // Insufficient points
            } else if (responseStatus == 403) {

                // show that user has insufficient points

                // adding text and styling to toast
                document.getElementById('toast-title').textContent = 'Insufficient points';
                document.getElementById('toast-header').style.backgroundColor = '#d13a11';
                document.getElementById('toast-title').style.color = 'white';
                document.getElementById('toast-text').textContent = 'You do not have enough points to buy this recipe. '

                toast.show();

            // missing required information (ingredient_id) 
            // user not found or ingredient not found (shouldn't happen)
            } else if (responseStatus == 400 || responseStatus == 404) {
                // get user to try again
                alert('Ingredient not found or ingredient_id not provided. Try again later. ')

            // token expired
            } else if (responseStatus == 401) {
                // redirects to login page
                window.location.href = './login.html'

            // Internal server error
            } else {
                alert('Error occured with the server. Check server is running before trying again. ')
            }

        }

        fetchMethod(buyIngredientURL, callback, "POST", data, token);
    }


    // Waits for user to click buy goods button
    document.getElementById('buyBtn').addEventListener('click', openShop);
    let modal;

    function openShop() {
        let shopModal = document.getElementById('shopModal');
        modal = new bootstrap.Modal(shopModal);

        modal.show();
    }   

})