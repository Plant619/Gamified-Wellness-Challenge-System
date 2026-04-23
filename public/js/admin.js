// modal where button content will be shown 
const adminModal = document.getElementById('adminModal');
const modal = new bootstrap.Modal(adminModal);

let modalTitle = document.getElementById('adminModalTitle');
let modalBody = document.getElementById('adminModalBody');
let modalHeader = document.getElementById('adminModalHeader');

const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

// Listen for button presses
document.getElementById('viewAllUsersBtn').addEventListener('click', viewAllUsers);
document.getElementById('banUserBtn').addEventListener('click', showBanMenu);
document.getElementById('newIngredientBtn').addEventListener('click', () => showCreateMenu('ingredient'));
document.getElementById('newRecipeBtn').addEventListener('click', () => showCreateMenu('recipe'));
document.getElementById('newRecipeIngredientBtn').addEventListener('click', () => showCreateMenu('recipeIngredient'));
// document.getElementById('newDishBtn').addEventListener('click', newDish);

let users = [];
let ingredients = []; 
let recipes = [];
let recipeIngredients = [];

let gridTemplate = `                
    <div class="container">
        <form class="d-flex mb-3" id="searchUser">
            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" id="searchField">
            <button class="btn btn-outline-success" type="submit">Search</button>
        </form>

        <div class="row">
            <div class="col">
                <strong>User ID</strong>
            </div>
            <div class="col">
                <strong>Username</strong>
            </div>
            <div class="col">
                <strong>Points</strong>
            </div>
            <div class="col">
                <strong>Role</strong>
            </div>
            <div class="col">
            </div>
        </div>
`;

// View all users
function viewAllUsers() {
    const viewUsersURL = `http://localhost:3000/api/admin/users/${userId}`;

    const callback = (responseStatus, responseData) => {
        console.log(responseData);

        if (responseStatus == 200) {
            users = responseData;
            let titleContent = `View All Users`

            let bodyContent = `                
                <div class="container">
                    <div class="row">
                        <div class="col">
                            <strong>User ID</strong>
                        </div>
                        <div class="col">
                            <strong>Username</strong>
                        </div>
                        <div class="col">
                            <strong>Points</strong>
                        </div>
                        <div class="col">
                            <strong>Role</strong>
                        </div>
                    </div>
            `;

            // loops through each user
            // points, role, user_id, username
            for (let i = 0; i < responseData.length; i++) {
                const currentUser = responseData[i];

                bodyContent += `
                    <div class="row">
                        <div class="col" id="userID${currentUser.user_id}">
                            ${currentUser.user_id}
                        </div>
                        <div class="col" id="username${currentUser.user_id}">
                            ${currentUser.username}
                        </div>
                        <div class="col" id="points${currentUser.user_id}">
                            ${currentUser.points}
                        </div>
                        <div class="col" id="role${currentUser.user_id}">
                            ${currentUser.role}
                        </div>
                    </div>
                `;

            }

            bodyContent += '</div>';

            modalHeader.style.backgroundColor = '#70a7ff';
            modalBody.style.backgroundColor = '#deebff';

            displayTableContent(titleContent, bodyContent)

        // No admin access
        } else if (responseStatus == 403) {
            handleNonAdmin();

        // token expired
        } else if (responseStatus == 401) {
            // redirects to login page
            window.location.href = './login.html'
        // Internal server error
        } else {
            alert('Error occured with the server. Check server is running before trying again. ')
        }

    }

    fetchMethod(viewUsersURL, callback, "GET", null, token)
}

// Ban user
function showBanMenu() {
    // search bar use username to search for users (if too many users)
    // ban button
    // write reason for ban (not being stored) 
    // maybe could show reason for ban if user tries to login 
    // or just nuke account (delete)
    
    const viewUsersURL = `http://localhost:3000/api/admin/users/${userId}`;

    const callback = (responseStatus, responseData) => {
        console.log(responseData);

        if (responseStatus == 200) {
            users = responseData;

            let titleContent = `Ban User`

            let bodyContent = gridTemplate;

            // loops through each user
            // points, role, user_id, username
            for (let i = 0; i < responseData.length; i++) {
                const currentUser = responseData[i];

                bodyContent += `
                    <div class="row">
                        <div class="col" id="userID${currentUser.user_id}">
                            ${currentUser.user_id}
                        </div>
                        <div class="col" id="username${currentUser.user_id}">
                            ${currentUser.username}
                        </div>
                        <div class="col" id="points${currentUser.user_id}">
                            ${currentUser.points}
                        </div>
                        <div class="col" id="role${currentUser.user_id}">
                            ${currentUser.role}
                        </div>
                        <div class="col">
                            <button class="btn btn-danger" id="ban${currentUser.user_id}">Ban</button>
                        </div>
                    </div>
                `;

            }

            bodyContent += '</div>';

            modalHeader.style.backgroundColor = '#ff7c70';
            modalBody.style.backgroundColor = '#ffece9';

            displayTableContent(titleContent, bodyContent);

            // listen for search
            document.getElementById('searchUser').addEventListener('submit', (e) => {
                e.preventDefault();
                const input = document.getElementById('searchField').value
                handleSearch(input, responseData);
            })

            // add event listener for ban button
            for (let i = 0; i < responseData.length; i++) {
                document.getElementById(`ban${responseData[i].user_id}`).addEventListener('click', () => {
                    banUser(responseData[i].user_id);
                });
            }

        // No admin access
        } else if (responseStatus == 403) {
            handleNonAdmin();

        // token expired
        } else if (responseStatus == 401) {
            // redirects to login page
            window.location.href = './login.html'
        // Internal server error
        } else {
            alert('Error occured with the server. Check server is running before trying again. ')
        }

    }

    fetchMethod(viewUsersURL, callback, "GET", null, token)
}

function viewAllIngredients() {
    const ingredientsURL = `http://localhost:3000/api/ingredients`;

    const ingredientCallback = (responseStatus, responseData) => {
        if (responseStatus == 200) {
            console.log(responseData);
            ingredients = responseData; 

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

function viewAllRecipes() {
    const recipesURL = `http://localhost:3000/api/recipes`;

    const recipeCallback = (responseStatus, responseData) => {
        if (responseStatus == 200) {
            console.log(responseData);
            recipes = responseData;

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

viewAllIngredients();
viewAllRecipes();

// New ingredient
function newIngredient(data) {
    // ingredient_name, rarity, description 

    const newIngredientURL = `http://localhost:3000/api/admin/ingredients/${userId}`;

    const callback = (responseStatus, responseData) => {
        if (responseStatus == 201) {
            console.log(responseData);
            // update ingredient list
            viewAllIngredients();

            let imageName = data.ingredient_name.toLowerCase().split(' ').join('_');

            // display ingredient created
            modalTitle.innerHTML = 'New ingredient created';
            modalBody.innerHTML = `
                <div class="d-flex align-items-center justify-content-center mx-3">
                    <img src="./images/ingredient_${imageName}.png" alt="Ingredient image hasn't been added" onerror="this.src='./images/ingredient_placeholder.png'">
                    <div class="ms-3">
                        <h4>
                            Ingredient Name:</strong> ${data.ingredient_name}
                        </h4>
                        <h5 class="mb-2">Rarity: ${data.rarity}
                        <p>
                            Description: ${data.description}
                        </p>
                    </div>
                </div>
            `;

        } else if (responseStatus == 400) {
            handle400Case('ingredient');

        // ingredient already exists
        } else if (responseStatus == 409) {
            handle409Case('ingredient');

        // Ingredients not found (user has no ingredients) (put like empty of a message)
        } else if (responseStatus == 401) {
            // redirects to login page
            window.location.href = './login.html'
        // Internal server error
        } else {
            alert('Error occured with the server. Check server is running before trying again. ');
        }

    }

    fetchMethod(newIngredientURL, callback, "POST", data, token);
}

let recipeIngredientsDone = 0;
let compare = 0;

// New recipe
function newRecipe(data) {

    const newRecipeURL = `http://localhost:3000/api/admin/recipes/${userId}`;

    const callback = (responseStatus, responseData) => {
        if (responseStatus == 201) {
            console.log('new recipe data:', responseData)

            // update recipe list
            viewAllRecipes();

            // create recipeIngredients
            recipeIngredientsDone = 0;
            recipeIngredients = [];

            // get all quantity inputs
            for (let i = 0; i < ingredients.length; i++) {
                let currentIngredientID = ingredients[i].ingredient_id;

                let currentIngredientQuantity = parseInt(document.getElementById(`ingredientQuantity${currentIngredientID}`).value)

                if (currentIngredientQuantity > 0) {
                    recipeIngredients.push({
                        recipe_name: responseData.recipe_name, 
                        recipe_id: responseData.recipe_id, 
                        ingredient_id: currentIngredientID, 
                        ingredient_name: ingredients[i].ingredient_name,
                        quantity: currentIngredientQuantity
                    })
                }
            }

            compare = recipeIngredients.length;

            for (let i = 0; i < recipeIngredients.length; i++) {
                newRecipeIngredient(recipeIngredients[i]);
            }

        } else if (responseStatus == 400) {
            handle400Case('recipe'); 

        } else if (responseStatus == 409) {
            handle409Case('recipe');

        } else if (responseStatus == 401) {
            // redirects to login page
            window.location.href = './login.html'
        // Internal server error
        } else {
            alert('Error occured with the server. Check server is running before trying again. ')
        }
    }

    fetchMethod(newRecipeURL, callback, "POST", data, token);
}

// New recipe ingredient 
function newRecipeIngredient(data) {
    // data contains: recipe_name, recipe_id, ingredient_id, quantity

    const newRecipeURL = `http://localhost:3000/api/admin/recipeIngredients/${userId}`;

    const callback = (responseStatus, responseData) => {
        if (responseStatus == 201) {
            recipeIngredientsDone++;
            console.log('new recipe ingredient data', responseData);

            // if all recipe ingredients are fetched
            if (recipeIngredientsDone == compare) {
                viewAllRecipes();
                displayRecipeAndRecipeIngredients(data.recipe_name, recipeIngredients, data.condition);
            }

        // recipe or ingredient not found
        } else if (responseStatus == 404) {
            modalHeader.style.backgroundColor = '#ff7c70';
            displayTableContent(`${data.recipe_name} was not added to recipe`, `Recipe or Ingredient not found`);

        } else if (responseStatus == 409) {
            handle409Case('recipeIngredient')

        } else if (responseStatus == 400) {
            handle400Case('recipeIngredient');

        } else if (responseStatus == 401) {
            // redirects to login page
            window.location.href = './login.html'
        // Internal server error
        } else {
            alert('Error occured with the server. Check server is running before trying again. ')
        }
    }

    fetchMethod(newRecipeURL, callback, "POST", data, token);
}

// New dish
// function newDish() {
// }

// name: ingredient, recipe, recipeIngredient, dish
function showCreateMenu(name) {
    let modalBody = document.getElementById('adminModalBody');

    if (name == 'ingredient') {
        // ingredient_name, rarity, description 

        // check rarity (Common, Uncommon, Rare, Epic, Legendary (add that))
        modalTitle.innerHTML = `Create new ingredient`;

        modalBody.innerHTML = `
            <form id="newIngredientForm">
                <div class="form-group mb-3">
                    <label for="ingredientName" class="fs-5">Ingredient name</label>
                    <input type="text" class="form-control" id="ingredientName" required>
                </div>

                <label for="ingredientRarity" class="fs-5">Rarity</label>
                <select class="form-select mb-3" id="ingredientRarity" required>
                    <option value="" selected disabled>Select rarity</option>
                    <option value="Common">Common</option>
                    <option value="Uncommon">Uncommon</option>
                    <option value="Rare">Rare</option>
                    <option value="Epic">Epic</option>
                    <option value="Legendary">Legendary</option>
                </select>

                <div class="form-group">
                    <label for="ingredientDescription" class="fs-5">Description</label>
                    <textarea class="form-control" id="ingredientDescription" rows="3" required></textarea>
                </div>

                <div class="d-flex align-items-center justify-content-end gap-2 mt-4">
                    <button type="button" class="btn btn-lg btn-secondary" id="ingredientConfirmationNo">Cancel</button>
                    <button type="submit" class="btn btn-lg btn-success" id="ingredientConfirmationYes">Confirm</button>
                </div>

            </form>
        `;

        // styling
        modalHeader.style.backgroundColor = '#228a2d';
        modalTitle.style.color = 'white';
        modalBody.style.backgroundColor = '#e4ffe6';


        // event listener (cancel)
        document.getElementById('ingredientConfirmationNo').addEventListener('click', () => {
            modal.hide();
        })

        // event listener (confirm)
        document.getElementById('newIngredientForm').addEventListener('submit', (e) => {
            e.preventDefault();

            const data =  {
                ingredient_name: document.getElementById('ingredientName').value, 
                rarity: document.getElementById('ingredientRarity').value, 
                description: document.getElementById('ingredientDescription').value
            }

            console.log(data);

            newIngredient(data);
        })

        modal.show();

    } else if (name == 'recipe') {
        // recipe_name
        modalTitle.innerHTML = `Create new recipe`;

        let ingredientList = `
            <ul id="ingredientList">
                <li class="ingredientItem">
                    <span></span>
                    <strong>Ingredient name</strong>
                    <strong class="quantityHeader">Quantity</strong>
                </li>
        `;

        // format ingredient list
        for (let i = 0; i < ingredients.length; i++) {
            let currIngredient = ingredients[i];

            let formatImageName = currIngredient.ingredient_name.toLowerCase().split(' ').join('_');

            ingredientList += `
                <li class="ingredientItem">
                    <img class="format-icon format-word" src="./images/ingredient_${formatImageName}.png" alt="${currIngredient.ingredient_name}" onerror="this.src='./images/ingredient_placeholder.png'">
                    <span class="ingredientName ms-3">${currIngredient.ingredient_name}</span>
                    <input type="number" class="form-control ingredientQuantity quantity${currIngredient.ingredient_id}" min="0" id="ingredientQuantity${currIngredient.ingredient_id}">
                </li>
            `;
        }

        ingredientList += '</ul>'

        modalBody.innerHTML = `
            <form id="newRecipeForm">
                <div class="form-group mb-3">
                    <label for="recipeName" class="fs-5"><strong>Recipe name</strong></label>
                    <input type="text" class="form-control" id="recipeName" required>
                </div>

                ${ingredientList}

                <div class="d-flex align-items-center justify-content-end gap-2 mt-4">
                    <button type="button" class="btn btn-lg btn-secondary" id="recipeConfirmationNo">Cancel</button>
                    <button type="submit" class="btn btn-lg btn-success" id="recipeConfirmationYes">Confirm</button>
                </div>
            </form>
        `;

        // styling
        modalTitle.style.color = 'white';
        modalHeader.style.backgroundColor = '#4961ff';
        modalBody.style.backgroundColor = '#d2e9ff';

        // event listener (cancel)
        document.getElementById('recipeConfirmationNo').addEventListener('click', () => {
            modal.hide();
        })

        // event listener (confirm)
        document.getElementById('newRecipeForm').addEventListener('submit', (e) => {
            e.preventDefault();

            let found = false;
            // check that at least one ingredient is selected (quantity > 0)
            for (let i = 0; i < ingredients.length; i++) {
                let currentIngredientID = ingredients[i].ingredient_id;

                let currentIngredientQuantity = document.getElementById(`ingredientQuantity${currentIngredientID}`).value

                if (currentIngredientQuantity > 0) {
                    found = true;
                    break;
                }
            }

            // ingredient selected
            if (found) {
                const data =  {
                    recipe_name: document.getElementById('recipeName').value.trim(), 
                    condition: 'recipe'
                }
            
                newRecipe(data);
            
            } else {
                modalHeader.style.backgroundColor = '#ff7c70';
                displayTableContent('Recipe was not created', 'Please select at least one ingredient');
            }
        })

        modal.show();

    } else if (name == 'recipeIngredient') {
        // recipe_id, ingredient_id, quantity (optional, will default to one)
        modalTitle.innerHTML = `Create new recipe ingredient`;

        modalBody.innerHTML = `
            <form id="newRecipeIngredientForm">
                <div class="form-group mb-3">
                    <label for="recipeName2" class="fs-5">Recipe name</label>
                    <input type="text" class="form-control" id="recipeName2" required>
                </div>

                <div class="form-group mb-3">
                    <label for="ingredientName2" class="fs-5">Ingredient name</label>
                    <input type="text" class="form-control" id="ingredientName2" required>
                </div>

                <div class="form-group mb-3">
                    <label for="quantity2" class="fs-5">Quantity required</label>
                    <input type="number" class="form-control" id="quantity2" required>
                </div>

                <div class="d-flex align-items-center justify-content-end gap-2 mt-4">
                    <button type="button" class="btn btn-lg btn-secondary" id="recipeIngredientConfirmationNo">Cancel</button>
                    <button type="submit" class="btn btn-lg btn-success" id="recipeIngredientConfirmationYes">Confirm</button>
                </div>
            </form>
        `;

        // styling
        modalTitle.style.color = 'white';
        modalHeader.style.backgroundColor = 'rgb(225, 136, 225)';
        modalBody.style.backgroundColor = 'rgb(255, 238, 255)';

        // event listener (cancel)
        document.getElementById('recipeIngredientConfirmationNo').addEventListener('click', () => {
            modal.hide();
        })

        // event listener (confirm)
        document.getElementById('newRecipeIngredientForm').addEventListener('submit', (e) => {
            e.preventDefault();

            // shouldn't be necessary form should prevent non number inputs
            if (isNaN(document.getElementById('quantity2').value)) {
                modalTitle.innerHTML = `Please enter a number for quantity`;
                modalBody.innerHTML = ``;
                return;
            }

            let recipe_name = document.getElementById('recipeName2').value.trim();
            let ingredient_name = document.getElementById('ingredientName2').value.trim();

            let recipe = recipes.filter(recipe => recipe.recipe_name == recipe_name);
            let ingredient = ingredients.filter(ingredient => ingredient.ingredient_name == ingredient_name);

            if (recipe.length == 0) {
                // 404
                modalHeader.style.backgroundColor = '#ff7c70';
                displayTableContent(`${ingredient_name} was not added to recipe`, `Recipe not found`);
                return;
            } 

            if (ingredient.length == 0) {
                // 404
                modalHeader.style.backgroundColor = '#ff7c70';
                displayTableContent(`${ingredient_name} was not added to recipe`, `Ingredient not found`);
                return;
            }

            console.log('recipe', recipe)
            console.log('ingredient', ingredient)

            const data =  {
                recipe_id: recipe[0].recipe_id, 
                ingredient_id: ingredient[0].ingredient_id, 
                quantity: parseInt(document.getElementById('quantity2').value), 
                recipe_name: recipe_name, 
                ingredient_name: ingredient_name, 
                condition: 'recipeIngredient'
            }

            if (data.quantity <= 0) {
                modalHeader.style.backgroundColor = '#ff7c70';
                displayTableContent(`${ingredient_name} was not added to recipe`, `Please enter a valid positive integer for quantity (more than 0)`);
                return;
            }

            recipeIngredientsDone = 0;
            compare = 1;
            recipeIngredients = [{
                    recipe_name: recipe_name, 
                    ingredient_name: ingredient_name,
                    quantity: data.quantity, 
                    ingredient_id: data.ingredient_id
                }];

            console.log('data', data);

            newRecipeIngredient(data);
        })

        modal.show();
    }
    // else if (name == 'dish') {
    //     modalTitle.innerHTML = `Create new dish`;

    //     modalHeader.style.backgroundColor = '#d2d2d2';

    // }

}

function handleNonAdmin() {
    localStorage.setItem('role', 'user');
    window.location.href = './game_quest.html'
}

function displayTableContent(title, body) {
    modalTitle.innerHTML = title;
    modalBody.innerHTML = body;

    modal.show();
}

function handleSearch(input, data) {
    console.log(input);
    console.log(data);

    // make the search case insensitive 
    input = input.toLowerCase();

    // loops through all users and finds users with usernames that match or partially match the input in the search field
    const matchedUsers = data.filter(user => user.username.toLowerCase().includes(input));
    console.log('matches', matchedUsers);


    // format content to show only matchedUsers
    let titleContent = `Ban User`;

    // check for no match case
    if (matchedUsers.length == 0) {
        let bodyContent = `
            <div class="container">
                <form class="d-flex mb-3" id="searchUser">
                    <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" id="searchField">
                    <button class="btn btn-outline-success" type="submit">Search</button>
                </form>

                No users found with username containing ${input}
            </div>
        `;
        displayTableContent(titleContent, bodyContent);
    } else {
        let bodyContent = gridTemplate;

        for (let i = 0; i < matchedUsers.length; i++) {
            const currentUser = matchedUsers[i];

            bodyContent += `
                <div class="row">
                    <div class="col" id="userID${currentUser.user_id}">
                        ${currentUser.user_id}
                    </div>
                    <div class="col" id="username${currentUser.user_id}">
                        ${currentUser.username}
                    </div>
                    <div class="col" id="points${currentUser.user_id}">
                        ${currentUser.points}
                    </div>
                    <div class="col" id="role${currentUser.user_id}">
                        ${currentUser.role}
                    </div>
                    <div class="col">
                        <button class="btn btn-danger" id="ban${currentUser.user_id}">Ban</button>
                    </div>
                </div>
            `;
        }

        bodyContent += '</div>';
        
        // displays content
        displayTableContent(titleContent, bodyContent);
    }

    modalHeader.style.backgroundColor = '#ff7c70';
    modalBody.style.backgroundColor = '#ffece9';

    // event listener (ban button)
    if (matchedUsers.length !== 0) {
        for (let i = 0; i < matchedUsers.length; i++) {
            document.getElementById(`ban${matchedUsers[i].user_id}`).addEventListener('click', () => {
                banUser(matchedUsers[i].user_id);
            });
        }
    }

    // event listener (search)
    document.getElementById('searchUser').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('searchField').value
        handleSearch(input, data);
    })

}

function banUser(userId) {
    // confirmation modal for ban 
    let userBeingBanned = users.find(user => user.user_id == userId);

    modalTitle.innerHTML = `Are you sure you would like to ban ${userBeingBanned.username}`;
    modalBody.innerHTML = `
        <div class="d-flex align-items-center justify-content-center gap-5">
            <button type="button" class="btn btn-lg btn-success" id="banConfirmationYes">Yes</button>
            <button type="button" class="btn btn-lg btn-danger" id="banConfirmationNo">No</button>
        </div>    
    `;

    // confirm ban
    document.getElementById('banConfirmationYes').addEventListener('click', () => {
        
        // ban reason (not being stored or used currently)
        modalTitle.innerHTML = `Banning ${userBeingBanned.username}`;
        modalBody.innerHTML = `
            <form>
                <div class="form-group">
                    <label for="banReason" class="fs-5">Ban reason</label>
                    <textarea class="form-control" id="banReason" rows="3"></textarea>
                </div>
            </form>

            <div class="d-flex align-items-center justify-content-end gap-2 mt-4">
                <button type="button" class="btn btn-lg btn-secondary" id="banCancel">Cancel</button>
                <button type="button" class="btn btn-lg btn-success" id="banConfirmationYes2">Confirm</button>
            </div>    
        `;

        document.getElementById('banConfirmationYes2').addEventListener('click', () => sendBanRequest(userBeingBanned, document.getElementById('banReason').value));

        document.getElementById('banCancel').addEventListener('click', showBanMenu );
    })
    
    // cancel ban
    document.getElementById('banConfirmationNo').addEventListener('click', showBanMenu)

    modal.show();
}

function sendBanRequest(bannedUser, banReason) {
    const deleteUserURL = `http://localhost:3000/api/admin/${userId}/${bannedUser.user_id}`;

    const callback = (responseStatus, responseData) => {
        console.log(responseData);
        console.log(responseStatus)

        const admin = users.find(user => user.user_id == userId);

        // User, completion records, challenges created, ingredients, recipes, dishes deleted successfully
        if (responseStatus == 204) {

            modalTitle.innerHTML = `${bannedUser.username} has been banned. `
            modalBody.innerHTML = `
                Ban reason: ${banReason} <br>
                Banned by: ${admin.username}
            `;

            modalHeader.style.backgroundColor = '#74da58';

            modal.show();

        // User not found
        } else if (responseStatus == 404) {
            modalTitle.innerHTML = `${bannedUser.username} has not been banned. `
            modalBody.innerHTML = `
                User was not found
            `;

            modalHeader.style.backgroundColor = '#da5a58';

            modal.show();

        // No admin access
        } else if (responseStatus == 403) {
            handleNonAdmin();

        // token expired
        } else if (responseStatus == 401) {
            // redirects to login page
            window.location.href = './login.html'

        // Internal server error
        } else {
            alert('Error occured with the server. Check server is running before trying again. ')
        }

    }

    fetchMethod(deleteUserURL, callback, "DELETE", null, token);
}   

// ingredient, recipe, recipe ingredient
function handle409Case(name) {
    if (name == 'ingredient') {
        let message = 'Ingredient already exists'
        modalTitle.innerHTML = 'Ingredient was not created'
        modalBody.innerHTML = message;

    } else if (name == 'recipe') {
        let message = 'Recipe already exists'
        modalTitle.innerHTML = 'Recipe was not created'
        modalBody.innerHTML = message;

    } else if (name == 'recipeIngredient') {
        let message = 'Recipe ingredient already exists'
        modalTitle.innerHTML = 'Recipe ingredient was not created'
        modalBody.innerHTML = message;

    }

    modalHeader.style.backgroundColor = '#ff7c70';
    modal.show();
}

function handle400Case(name) {

    if (name == 'ingredient') {
        modalTitle.innerHTML = 'Ingredient was not created';
        modalBody.innerHTML = 'Missing required information (ingredient_name, rarity, description)';

    } else if (name == 'recipe') {
        modalTitle.innerHTML = 'Recipe was not created'
        modalBody.innerHTML = 'Missing required information (recipe_name)';

    } else if (name == 'recipeIngredient') {
        modalTitle.innerHTML = 'Recipe ingredient was not created';
        modalBody.innerHTML = 'Missing required information (recipe_id, ingredient_id, quantity)';

    }

    modalHeader.style.backgroundColor = '#ff7c70';
    modal.show();
}

function displayRecipeAndRecipeIngredients(recipe_name, recipeIngredients, condition) {
            
    let imageName = recipe_name.toLowerCase().split(' ').join('_');

    // format recipe ingredients
    let ingredientList = `
        <ul id="recipeIngredientList">
    `;

    for (let i = 0; i < recipeIngredients.length; i++) {
        let currIngredient = recipeIngredients[i];
        console.log('current ingredient', currIngredient)


        let formatImageName = currIngredient.ingredient_name.toLowerCase().split(' ').join('_');

        ingredientList += `
            <li class="ingredientItem">
                <img class="format-icon format-word" src="./images/ingredient_${formatImageName}.png" alt="Ingredient image hasn't been added" onerror="this.src='./images/ingredient_placeholder.png'">
                <span class="ingredientName ms-3">${currIngredient.ingredient_name}</span>
                <p class="ingredientQuantity quantity${currIngredient.ingredient_id}" id="ingredientQuantity${currIngredient.ingredient_id}">
                    x${currIngredient.quantity}
                </p>
            </li>
        `;
        console.log(ingredientList)
    }

    ingredientList += '</ul>'

    let temp = '';

    // new recipe being created
    if (condition == 'recipeIngredient') {
        modalTitle.innerHTML = 'New Recipe ingredient added';
        temp = 'Ingredient added';

    // recipe ingredient being added
    } else {
        modalTitle.innerHTML = 'New Recipe created';
        temp = 'Ingredients required';
    }

    // display ingredient created
    modalBody.innerHTML = `
        <div class="d-flex align-items-center justify-content-center mx-3">
            <img src="./images/recipe_${imageName}.png" alt="Recipe image hasn't been added"  onerror="this.src='./images/recipe_placeholder.png'">

            <div>
                <h4>
                    <strong>Recipe name: ${recipe_name}</strong><br>
                </h4>
                
                <h5>${temp} </h5>
                ${ingredientList}
            </div>
        </div>

        <div class="d-flex justify-content-end gap-2 mt-4">
            <button type="button" class="btn btn-lg btn-secondary" id="closeModal">Close</button>
        </div>
    `;

    modal.show()

    document.getElementById('closeModal').addEventListener('click', () => {
        modal.hide();
    })
}