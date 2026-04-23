document.addEventListener('DOMContentLoaded', () => {
    checkAdmin()
    showAdminTab();

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    // stores user specific snorlax
    let snorlax = [];
    let snorlaxCreatureID = null;
    let snorlaxMood = '';
    let recipeFed = [];
    let dishesData = [];
    let updatePoints = false;

    const offcanvasBody = document.getElementById('feedOffcanvasBody');

    // fetches general snorlax data from creatures
    function fetchSnorlax() {
        const creaturesURL = `http://localhost:3000/api/creatures/snorlax`;

        const creatureCallback = (responseStatus, responseData) => {
            if (responseStatus == 200) {

                console.log('fetch snorlax', responseData);

                if (responseData.length == 0) {
                    alert('Snorlax not found')
                } else {
                    // store snorlax creature id for later
                    snorlaxCreatureID = responseData[0].creature_id;
                    fetchUserSnorlax();
                }

            // snorlax not found 
            } else if (responseStatus == 404) {
                alert('Snorlax not found');

            // token expired
            } else if (responseStatus == 401) {
                // redirects to login page
                window.location.href = './login.html'

            // Internal server error
            } else {
                alert('Error occured with the server. Check server is running before trying again. ')
            }
        }

        fetchMethod(creaturesURL, creatureCallback, 'GET', null, token);
    }

    // fetches user's specific snorlax or creates on if they don't have one
    function fetchUserSnorlax() {
        const creaturesURL = `http://localhost:3000/api/creatures/${userId}`;

        const creatureCallback = (responseStatus, responseData) => {
            if (responseStatus == 200) {

                // response data provides: 
                // creature_id, creature_name, favourite_food, hated_food, friendship, last_fed, user_id

                console.log('fetch user snorlax', responseData)

                // filter to see if user has a snorlax
                snorlax = responseData.filter(creature => creature.creature_name == 'Snorlax')
                console.log('snorlax', snorlax)

                // user doesn't have a snorlax
                if (snorlax.length == 0) {
                    createSnorlax();
                } else {
                    // only updates points not bg
                    if (updatePoints) {
                        document.getElementById('currentFriendship').innerText = snorlax[0].friendship;

                    } else {
                        document.getElementById('currentFriendship').innerText = snorlax[0].friendship;
                        fetchSnorlaxMood();
                    }
                }
            // user has no creatures and no snorlax
            } else if (responseStatus == 404) {
                createSnorlax();

            // token expired
            } else if (responseStatus == 401) {
                // redirects to login page
                window.location.href = './login.html'

            // Internal server error
            } else {
                alert('Error occured with the server. Check server is running before trying again. ')
            }
        }

        fetchMethod(creaturesURL, creatureCallback, 'GET', null, token);
    }

    fetchSnorlax();

    function createSnorlax() {
        const creaturesURL = `http://localhost:3000/api/creatures/snorlax/${userId}`;

        const data = {
            creature_id: snorlaxCreatureID
        }

        const creatureCallback = (responseStatus, responseData) => {
            if (responseStatus == 201) {

                console.log('create creature data', responseData)
                // ensures that user's snorlax is stored
                fetchUserSnorlax();

            // already owns snorlax or creature_id is undefined (not provided) (shouldn't happen with previous checks)
            } else if (responseStatus == 400) {
                alert('You already own a snorlax or creature id is undefined')

            // snorlax not found in creature db (shouldn't occur because of check previously) 
            } else if (responseStatus == 404) {
                alert('Snorlax not found in creature database')

            // token expired
            } else if (responseStatus == 401) {
                // redirects to login page
                window.location.href = './login.html'

            // Internal server error
            } else {
                alert('Error occured with the server. Check server is running before trying again. ')
            }
        }

        fetchMethod(creaturesURL, creatureCallback, 'POST', data, token);
    }

    function fetchSnorlaxMood() {
        const creaturesURL = `http://localhost:3000/api/creatures/status/${userId}/${snorlaxCreatureID}`;

        const creatureCallback = (responseStatus, responseData) => {
            if (responseStatus == 200) {
                console.log('fetch snorlax mood', responseData);
                snorlaxMood = responseData.message.slice(11, 16);

                if (responseData.message.slice(11, 16) == 'happy') {
                    snorlaxMood = 'happy';
                    
                } else if (responseData.message.slice(11, 16) == 'angry') {
                    snorlaxMood = 'angry';

                // neutral
                } else {
                    snorlaxMood = 'neutral';
                }

                getBackground();

            // snorlax or user not found 
            } else if (responseStatus == 404) {
                alert('Snorlax or User not found');

            // token expired
            } else if (responseStatus == 401) {
                // redirects to login page
                window.location.href = './login.html'

            // Internal server error
            } else {
                alert('Error occured with the server. Check server is running before trying again. ')
            }
        }

        fetchMethod(creaturesURL, creatureCallback, 'GET', null, token);
    }

    // let backgrounds = [
    //     "./images/snorlax_shiny_ditto_bg.png", 
    //     "./images/snorlax_ditto_bg.png", 
    //     "./images/snorlax_smiling_ditto_bg.png", 
    //     "./images/snorlax_smiling_shiny_ditto_bg.png", 
    //     "./images/snorlax_angry_ditto_bg.png", 
    //     "./images/snorlax_angry_shiny_ditto_bg.png", 
    // ]

    function getBackground() {
        const randIndex = Math.floor(Math.random() * 2);
        let word = '';

        if (snorlaxMood == 'angry') {
            word = '_angry';

        } else if (snorlaxMood == 'neutral') {
            word = '';

        } else {
            word = '_smiling'
        }

        // chooses whether ditto is shiny
        // shiny
        if (randIndex == 0) {
            console.log('bg', `./images/snorlax${word}_shiny_ditto_bg.png`);
            document.getElementById('feed-bg').style.backgroundImage = `url(./images/snorlax${word}_shiny_ditto_bg.png)`;

        // normal
        } else {
            console.log('bg', `./images/snorlax${word}_ditto_bg.png`);
            document.getElementById('feed-bg').style.backgroundImage = `url(./images/snorlax${word}_ditto_bg.png)`;

        }

    }

    // fetch dishes
    function fetchDish() {
        const dishesURL = `http://localhost:3000/api/dishes/${userId}`;

        const dishCallback = (responseStatus, responseData) => {
            if (responseStatus == 200) {
                if (responseData.length == 0) {
                    offcanvasBody.innerText = 'You do not own any dishes at the moment';
                    return;
                }

                dishesData = responseData;
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

    fetchDish();

    // shows dishes in offcanvas
    function displayDishes(dishes) {

        // dishes contains 
        // quantity, recipe_id, recipe_name, user_id

        let tempHTML = '';

        // loops through each recipe a user owns
        for (let i = 0; i < dishes.length; i++) {
            let currentDish = dishes[i];

            let dishImgName = currentDish.recipe_name.toLowerCase().split(' ').join('_');

            tempHTML += `
                <div class="mb-5">
                    <h4>${currentDish.recipe_name} - x${currentDish.quantity}</h4>
                    <img src="./images/dish_${dishImgName}.png" alt="${currentDish.recipe_name}" onerror="this.src='./images/dish_placeholder.png'" class="format-dish-image">
                    <button id="feedSnorlax${currentDish.recipe_id}" class="btn btn-primary btn-lg">Feed Snorlax</button>
                </div>
            `;
        }

        offcanvasBody.innerHTML = tempHTML;
        addFeedSnorlaxEventListener(dishes);
    }

    function addFeedSnorlaxEventListener(dishes) {
        dishes.forEach(dish => {
            let recipe_id = dish.recipe_id
            let button_id = `feedSnorlax${dish.recipe_id}`;

            document.getElementById(button_id).addEventListener('click', () => feedSnorlax(recipe_id));
        })
    }

    function feedSnorlax(recipe_id) {
       const dishesURL = `http://localhost:3000/api/creatures/feed/${userId}`;

        const data = {
            recipe_id: recipe_id, 
            creature_id: snorlaxCreatureID
        }

        const feedCallback = (responseStatus, responseData) => {
            if (responseStatus == 201) {
                recipeFed = dishesData.find(dish => dish.recipe_id == recipe_id);

                fetchDish();
                updatePoints = true;
                fetchUserSnorlax();

                const feedOffcanvas = document.getElementById('feedOffcanvas');
                const offcanvas = bootstrap.Offcanvas.getInstance(feedOffcanvas);
                offcanvas.hide(); 

                console.log('feed data', responseData);

                // display dishes
                displaySuccessfulFeed(responseData.message);

            // creature or recipe or dish not found
            } else if (responseStatus == 404) {
                console.log('missing')
                alert('creature or recipe or dish not found')

            // recipe_id or creature_id undefined (not provided)
            } else if (responseStatus == 400) {
                alert('recipe_id or creature_id undefined')

            // token expired
            } else if (responseStatus == 401) {
                // redirects to login page
                window.location.href = './login.html'

            // Internal server error
            } else {
                alert('Error occured with the server. Check server is running before trying again. ')
            }
        }

        fetchMethod(dishesURL, feedCallback, 'PUT', data, token);
    }

    function displaySuccessfulFeed(str) {
        console.log('successful feed message', str)

        // get background based on mood after feeding 
        if (str.includes('not happy')) {
            console.log('not happy');
            snorlaxMood = 'angry';


        } else if (str.includes('neutral')) {
            console.log('neutral');
            snorlaxMood = 'neutral';


        // neutral
        } else {
            console.log('happy')
            snorlaxMood = 'happy';

        }

        getBackground();
        
        // display successful message in toast
        const feedToast = document.getElementById('feedToast');
        const toast = new bootstrap.Toast(feedToast);
        const toastHeader = document.getElementById('feedToastHeader');
        const toastBody = document.getElementById('feedToastBody');
        const toastTitle = document.getElementById('feedToastTitle');
        const dishOverlay = document.getElementById('dishOverlay');

        let dishImgName = recipeFed.recipe_name.toLowerCase().split(' ').join('_');

        dishOverlay.innerHTML = `
            <img class="" src="./images/dish_${dishImgName}.png" alt="${recipeFed.recipe_name}" onerror="this.src='./images/dish_placeholder.png'">
            <button type="button" id="hideOverlayBtn" class="btn-close"></button>
        `;

        dishOverlay.style.display = 'block';

        const hideOverlayBtn = document.getElementById('hideOverlayBtn');

        // hides the overlay
        hideOverlayBtn.addEventListener('click', () => {
            dishOverlay.style.display = 'none';
        })

        toastHeader.style.backgroundColor = '#71c992';
        toastTitle.innerText = 'Snorlax has been fed';
        toastBody.innerHTML = `
            <div>
                <h5>Snorlax is ${snorlaxMood}. </h5>
            </div>
        `;

        toast.show();
    }

})
