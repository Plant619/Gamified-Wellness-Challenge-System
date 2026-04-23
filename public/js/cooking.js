
document.addEventListener('DOMContentLoaded', () => {
    checkAdmin();
    showAdminTab();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    let recipeIDList = [];

    // stores user recipe 
    let recipeData = [];
    // stores recipe ingredients
    let recipeIngredients = [];
    // stores user ingredients 
    let ingredients = [];


    // TO DO 
    // show what recipes they own nicely 
    // show what ingredients they are missing (use red background)
    // show what ingredients they have (use green background)


    // Gets user ingredients
    function fetchIngredients() {
        const ingredientsURL = `http://localhost:3000/api/ingredients/${userId}`;

        const ingredientCallback = (responseStatus, responseData) => {
            if (responseStatus == 200 || responseStatus == 404) {
                console.log(responseData);

                // stores ingredients for later
                ingredients = responseData;

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
    
    fetchIngredients();

    // Fetch user recipes
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
                handle404Cases();

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

    // Fetch recipe Ingredients 
    function fetchRecipeIngredients(recipe_id) {
        const recipeIngredientsURL = `http://localhost:3000/api/recipes/ingredient/${recipe_id}`;

        const recipeIngredientCallback = (responseStatus, responseData) => {
            if (responseStatus == 200) {
                console.log(responseData);
                recipeIngredients.push(responseData);

                if (recipeIngredients.length == recipeData.length) {
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

    // a tab at the left side that shows all owned recipe etc.
    function displayRecipes() {

        // content added in this
        let cookOffcanvasBody = document.getElementById('cookOffcanvasBody');
        let tempHTML = '';

        recipeIngredients = recipeIngredients.flat();

        // loops through each recipe a user owns
        for (let i = 0; i < recipeData.length; i++) {
            let currentRecipe = recipeData[i];
            // Get corresponding recipe ingredients
            let currentRecipeIngredients = recipeIngredients.filter(recipe => recipe.recipe_id == currentRecipe.recipe_id);

            let tempHTML2 = '';

            // Check which ingredients user has and doesn't have
            for (let j = 0; j < currentRecipeIngredients.length; j++) {
                let sufficiency = '';
                let quantityNeeded = '';
                let quantityHas = '';
                let id = '';

                let currentIngredient = currentRecipeIngredients[j];
                let foundMatch = false;

                // loops through user ingredients to find a match with the current ingredient
                ingredients.forEach(ingredient => {
                    // found matched ingredient
                    if (ingredient.ingredient_id == currentIngredient.ingredient_id) {
                        foundMatch = true;

                        // Sufficient ingredients
                        if (ingredient.quantity >= currentIngredient.quantity) {
                            // stores the ingredient_id, quantity needed and quantity the user has for later
                            id = currentIngredient.ingredient_id;
                            sufficiency = 'sufficient';
                            quantityNeeded = currentIngredient.quantity;
                            quantityHas = ingredient.quantity;

                        // insufficient ingredients
                        } else {
                            id = currentIngredient.ingredient_id;
                            sufficiency = 'insufficient';
                            quantityNeeded = currentIngredient.quantity;
                            quantityHas = ingredient.quantity;

                        }
                    }
                })

                // user does not have that ingredient
                if (!foundMatch) {
                    id = currentIngredient.ingredient_id;
                    sufficiency = 'insufficient';
                    quantityNeeded = currentIngredient.quantity;
                    quantityHas = 0;
                }

                let ingredientImgName = currentIngredient.ingredient_name.toLowerCase().split(' ').join('_');

                // display: Ingredient name, quantity needed, quantity has, image
                // add class that changes background color
                tempHTML2 += `
                    <li class="${sufficiency}" id="recipe${currentRecipe.recipe_id}ingredient${id}">
                        <img class="me-2 format-recipe-ingredient" src="./images/ingredient_${ingredientImgName}.png" alt="${currentIngredient.ingredient_name}" onerror="this.src='./images/ingredient_placeholder.png'">
                        <p class="d-inline-block">
                            ${currentIngredient.ingredient_name} - ${quantityHas}/${quantityNeeded}
                        </p>
                    </li>
                `;

                // end of inner loop
            }

            let recipeImgName = currentRecipe.recipe_name.toLowerCase().split(' ').join('_');

            tempHTML += `
                <div class="mb-5">
                    <h4>${currentRecipe.recipe_name}</h4>
                    <img src="./images/recipe_${recipeImgName}.png" alt="${currentRecipe.recipe_name}" onerror="this.src='./images/recipe_placeholder.png'">
                    <ul>
                        ${tempHTML2}
                    </ul>
                    <button id="startCooking${currentRecipe.recipe_id}" class="btn btn-primary btn-lg">Start cooking</button>
                </div>
            `;
        }

        cookOffcanvasBody.innerHTML = tempHTML;
        addStartCookingEventListener(recipeData);
    }

    function addStartCookingEventListener(recipeData) {

        recipeData.forEach(recipe => {
            let recipe_id = recipe.recipe_id
            let button_id = `startCooking${recipe.recipe_id}`;

            document.getElementById(button_id).addEventListener('click', () => startCooking(recipe_id));
        })
    }

    function startCooking(recipe_id) {
        const cookModal = document.getElementById('cookModal');
        const modal = new bootstrap.Modal(cookModal);

        // TO DO 
        const cookURL = `http://localhost:3000/api/dishes/cook/${userId}`;

        const data = {
            recipe_id: recipe_id
        }

        const callback = (responseStatus, responseData) => {
            console.log(responseData)
            if (responseStatus == 201) {
                // finds the recipe
                let recipeObj = recipeData.find(recipe => recipe.recipe_id == recipe_id)

                // hide the offcanvas 
                const cookOffcanvas = document.getElementById('cookOffcanvas');
                const offcanvas = bootstrap.Offcanvas.getInstance(cookOffcanvas);
                offcanvas.hide();

                // show overlay (shows the dish that was cooked)
                const dishOverlay = document.getElementById('dishOverlay');

                // formats dish name
                let dishImgName = recipeObj.recipe_name.toLowerCase().split(' ').join('_');

                dishOverlay.innerHTML = `
                    <img class="" src="./images/dish_${dishImgName}.png" alt="${recipeObj.recipe_name}" onerror="this.src='./images/dish_placeholder.png'">
                    <button type="button" id="hideOverlayBtn" class="btn-close"></button>
                `;

                dishOverlay.style.display = 'block';

                const hideOverlayBtn = document.getElementById('hideOverlayBtn');

                // hides the overlay
                hideOverlayBtn.addEventListener('click', () => {
                    dishOverlay.style.display = 'none';
                })

                // Modal to show successful cook message
                // show dish that is cooked on screen with success message
                let modalTitle = document.getElementById('cookModalTitle');
                let modalBody = document.getElementById('cookModalBody');
                let modalHeader = document.getElementById('modalHeader');

                // add content and styling to the modal
                modalTitle.innerText = `${recipeObj.recipe_name} cooked Successfully`;
                modalBody.innerHTML = `
                    <img class="" src="./images/dish_${dishImgName}.png" alt="${recipeObj.recipe_name}" onerror="this.src='./images/dish_placeholder.png'">
                `;
                modalHeader.style.backgroundColor = 'rgb(117, 232, 117)';

                // fetch ingredients again to update cook ingredients
                fetchIngredients();

                // reset
                recipeIDList = [];
                recipeData = [];
                recipeIngredients = [];
                ingredients = [];

                modal.show();

            // ingredients not sufficient
            } else if (responseStatus == 403) {
                // hide the offcanvas 
                const cookOffcanvas = document.getElementById('cookOffcanvas');
                const offcanvas = bootstrap.Offcanvas.getInstance(cookOffcanvas);

                offcanvas.hide();

                let recipeObj = recipeData.find(recipe => recipe.recipe_id == recipe_id)

                let modalTitle = document.getElementById('cookModalTitle');
                let modalBody = document.getElementById('cookModalBody');
                let modalHeader = document.getElementById('modalHeader');

                // add content and styling to the modal
                modalTitle.innerText = `Insufficient ingredients`;
                modalBody.innerHTML = `
                    ${recipeObj.recipe_name} was not cooked
                `;
                modalHeader.style.backgroundColor = 'rgb(211, 79, 79)';

                modal.show();

            // recipe_id missing
            } else if (responseStatus == 400) {
                alert('Missing recipe_id');

            } else if (responseStatus == 401) {
                // redirects to login page
                window.location.href = './login.html'
                
            // Internal server error
            } else {
                alert('Error occured with the server. Check server is running before trying again. ')
            }

        }

        fetchMethod(cookURL, callback, "POST", data, token)
    }

    // No recipes owned
    function handle404Cases() {
        const errorToast = document.getElementById('errorToast');
        const toast = new bootstrap.Toast(errorToast);

        // document.getElementById('error-text').textContent = 'message';
        
        toast.show();
        return;
    }

    document.getElementById('cookBtn').addEventListener('click', fetchRecipes)
})