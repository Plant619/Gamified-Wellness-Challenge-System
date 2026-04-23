checkAdmin();
showAdminTab();

// query and display username and points
function getUsernameAndPoints() {
    // get the user_id from the local storage
    const user_id = localStorage.getItem('userId');

    const url = `http://localhost:3000/api/users/${user_id}`;

    // getting the fields where data will be displayed
    const usernameMessage = document.getElementById('usernameField');
    const pointsMessage = document.getElementById('pointsField')

    const callback = (responseStatus, responseData) => {
        console.log(responseData)
        if (responseStatus == 200) {
            usernameMessage.innerText = responseData.username;
            pointsMessage.innerText = responseData.points;

        // User not found or token expired
        } else if (responseStatus == 404 || responseStatus == 401) {
            // redirects to login page
            window.location.href = './login.html'
        // Internal server error
        } else {
            alert('Error occured with the server. Check server is running before trying again. ')
        }
    }

    fetchMethod(url, callback)
}

getUsernameAndPoints();

// query for number of challenge completed
function getChallengeCompleted() {
    // get the user_id from the local storage
    const user_id = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    // fetches all challenges
    const url = `http://localhost:3000/api/completion/user/${user_id}`;

    // getting the fields where data will be displayed
    const challengeCompletedMessage = document.getElementById('challengeCompletedField');

    const callback = (responseStatus, responseData) => {
        console.log(responseData)
        if (responseStatus == 200) {
            challengeCompletedMessage.innerText = responseData.length;

        // Token expired
        } else if (responseStatus == 401) {
            // redirects to login page
            window.location.href = './login.html'

        // Internal server error
        } else {
            alert('Error occured with the server. Check server is running before trying again. ')
        }
    }

    fetchMethod(url, callback, 'GET', null, token);
}

getChallengeCompleted();

// query for number of challenge created
function getChallengeCreated() {
    const user_id = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    const challengeCreatedMessage = document.getElementById('challengeCreatedField');

    // fetches all challenges
    const url = `http://localhost:3000/api/challenges`;
 
    const callback = (responseStatus, responseData) => {
        console.log(responseData)
        if (responseStatus == 200) {
            let created = responseData.filter(data => user_id == data.creator_id)

            challengeCreatedMessage.innerText = created.length;

        // Token expired
        } else if (responseStatus == 401) {
            // redirects to login page
            window.location.href = './login.html'

        // Internal server error
        } else {
            alert('Error occured with the server. Check server is running before trying again. ')
        }
    }

    // filter to get creator_id = user_id
    fetchMethod(url, callback, 'GET', null, token);
}

getChallengeCreated()

// query for number of friendship 
function getFriendship() {
    const user_id = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    const snorlaxFriendshipMessage = document.getElementById('snorlaxFriendshipField');

    // fetches friendship
    const url = `http://localhost:3000/api/creatures/${user_id}`;
 
    const callback = (responseStatus, responseData) => {
        console.log(responseData)
        if (responseStatus == 200) {
            // find user snorlax
            let snorlax = responseData.filter(creature => creature.creature_name == 'Snorlax');

            // user has no snorlax yet
            if (snorlax.length == 0) {
                snorlaxFriendshipMessage.innerText = 0;
            } else {
                snorlaxFriendshipMessage.innerText = snorlax[0].friendship;
            }

        // user has no creatures and no snorlax
        } else if (responseStatus == 404) {
            snorlaxFriendshipMessage.innerText = 0;

        // Token expired
        } else if (responseStatus == 401) {
            // redirects to login page
            window.location.href = './login.html'

        // Internal server error
        } else {
            alert('Error occured with the server. Check server is running before trying again. ')
        }
    }

    // filter to get creator_id = user_id
    fetchMethod(url, callback, 'GET', null, token);
}

getFriendship();



// ----------------------------------------------------------------------------------------------------------------
// LOGGING OUT
// ----------------------------------------------------------------------------------------------------------------
const logOutButton = document.getElementById("log-out");
logOutButton.addEventListener('click', checkLogOut)

// Checks if user actually wants to log out (so user doesn't accidentally log out)
function checkLogOut() {
    document.getElementById("log-out-modal").style.display = "flex";
}

// user does not want to log out
const logOutCloseButton = document.getElementById("log-out-close");
// Hides modal when exit button or 'no' is clicked
logOutCloseButton.addEventListener('click', e => document.getElementById("log-out-modal").style.display = "none");
document.getElementById("logout-false").addEventListener('click', e => document.getElementById("log-out-modal").style.display = "none");

// user verifies that they want to log out
document.getElementById('logout-true').addEventListener('click', logOut);

// logs users out and redirects them to login page
function logOut() {
    // delete their token 
    localStorage.removeItem('token');
    // delete userId
    localStorage.removeItem('userId');
    // delete role
    localStorage.removeItem('role');

    // redirect to log in page
    window.location.href = '/login.html';
}
