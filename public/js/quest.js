checkAdmin();
showAdminTab();

let challenges = [];

// Fetch and display challenges
function fetchChallenges() {

    // get the user_id from the local storage
    const token = localStorage.getItem('token');

    const url = `http://localhost:3000/api/challenges`;

    let carouselItemField = document.getElementById('carouselItemField');
    let indicatorsField = document.getElementById('indicators')

    carouselItemField.innerHTML = '';
    indicatorsField.innerHTML = '';

    let tempHTML = ``;


    // Displays challenges
    const callback = (responseStatus, responseData) => {
        console.log(responseData);

        if (responseStatus == 200) {
            challenges = responseData
            let slidesNeeded = Math.ceil(responseData.length / 3);

            // DISPLAY THE CHALLENGES
            // Repeats for the number of slides needed
            for (let i = 0; i < slidesNeeded; i++) {

                // less than 3 items left 
                if (responseData.length - 3 * i < 3) {
                    let cardsNeeded = responseData.length - 3 * i;
                    
                    if (cardsNeeded == 1) {
                        let challenge1 = responseData[i * 3];

                        // Adds the challenges
                        //  ${i === 0 ? 'active' : ''}: Checks if i == 0, if yes adds active class if not nothing added
                        carouselItemField.insertAdjacentHTML('beforeend', `
                            <div class="carousel-item ${i == 0 ? 'active' : ''}">
                                <div class="container d-flex justify-content-center">

                                    <div class="card m-3" style="width: 18rem;" id=card${challenge1.challenge_id}>
                                        <div class="card-body">
                                            <h5 class="card-title">Challenge ID: ${challenge1.challenge_id}</h5>
                                            <h6 class="card-subtitle mb-2 text-muted">Creator ID: ${challenge1.creator_id}</h6>
                                            <p class="card-text"><strong>Challenge Description:</strong> ${challenge1.description}</p>
                                            <div class="mb-2">
                                                <img src="./images/points_icon.png" alt="Points icon" class="format-quest-points-icon">
                                                <span class="card-text">Points: ${challenge1.points}</span>
                                            </div>
                                            <button class="btn btn-primary" id="card${challenge1.challenge_id}-btn">Complete</button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        `);

                        // Adds the indicator
                        indicatorsField.innerHTML += `
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${i}" class="${i == 0 ? 'active' : ''}"></button>
                        `;

                        // Adds event listener to the Complete button
                        document.getElementById(`card${challenge1.challenge_id}-btn`).addEventListener('click', () => {
                            getChallengeDetails(challenge1.challenge_id);
                        });

                    // cardsNeeded == 2
                    } else {
                        let challenge1 = responseData[i * 3];
                        let challenge2 = responseData[(i * 3) + 1];

                        //  ${i === 0 ? 'active' : ''}: Checks if i == 0, if yes adds active class if not nothing added
                        carouselItemField.insertAdjacentHTML('beforeend', `
                            <div class="carousel-item ${i == 0 ? 'active' : ''}">
                                <div class="container d-flex justify-content-center">

                                <div class="card m-3" style="width: 18rem;" id="card${challenge1.challenge_id}">
                                    <div class="card-body">
                                        <h5 class="card-title">Challenge ID: ${challenge1.challenge_id}</h5>
                                        <h6 class="card-subtitle mb-2 text-muted">Creator ID: ${challenge1.creator_id}</h6>
                                        <p class="card-text"><strong>Challenge Description:</strong> ${challenge1.description}</p>
                                        <div class="mb-2">
                                            <img src="./images/points_icon.png" alt="Points icon" class="format-quest-points-icon">
                                            <span class="card-text">Points: ${challenge1.points}</span>
                                        </div>
                                        <button class="btn btn-primary" id="card${challenge1.challenge_id}-btn">Complete</button>
                                    </div>
                                </div>

                                <div class="card m-3" style="width: 18rem;" id="card${challenge2.challenge_id}">
                                    <div class="card-body">
                                        <h5 class="card-title">Challenge ID: ${challenge2.challenge_id}</h5>
                                        <h6 class="card-subtitle mb-2 text-muted">Creator ID: ${challenge2.creator_id}</h6>
                                        <p class="card-text"><strong>Challenge Description:</strong> ${challenge2.description}</p>
                                        <div class="mb-2">
                                            <img src="./images/points_icon.png" alt="Points icon" class="format-quest-points-icon">
                                            <span class="card-text">Points: ${challenge2.points}</span>
                                        </div>
                                        <button class="btn btn-primary" id="card${challenge2.challenge_id}-btn">Complete</button>
                                    </div>
                                </div>

                                </div>
                            </div>
                        `);

                        
                        indicatorsField.innerHTML += `
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${i}" class="${i == 0 ? 'active' : ''}"></button>
                        `;

                        // Adds event listener to the Complete button
                        document.getElementById(`card${challenge1.challenge_id}-btn`).addEventListener('click', () => {
                            getChallengeDetails(challenge1.challenge_id);
                        });

                        document.getElementById(`card${challenge2.challenge_id}-btn`).addEventListener('click', () => {
                            getChallengeDetails(challenge2.challenge_id);
                        });

                    }

                // cardsNeeded == 3
                } else {
                    let challenge1 = responseData[i * 3];
                    let challenge2 = responseData[(i * 3) + 1];
                    let challenge3 = responseData[(i * 3) + 2];

                    //  ${i === 0 ? 'active' : ''}: Checks if i == 0, if yes adds active class if not nothing added
                    carouselItemField.insertAdjacentHTML('beforeend', `
                        <div class="carousel-item ${i == 0 ? 'active' : ''}">
                            <div class="container d-flex justify-content-center">

                                <div class="card m-3" style="width: 18rem;" id="card${challenge1.challenge_id}">
                                    <div class="card-body">
                                        <h5 class="card-title">Challenge ID: ${challenge1.challenge_id}</h5>
                                        <h6 class="card-subtitle mb-2 text-muted">Creator ID: ${challenge1.creator_id}</h6>
                                        <p class="card-text"><strong>Challenge Description:</strong> ${challenge1.description}</p>
                                        <div class="mb-2">
                                            <img src="./images/points_icon.png" alt="Points icon" class="format-quest-points-icon">
                                            <span class="card-text">Points: ${challenge1.points}</span>
                                        </div>
                                        <button class="btn btn-primary" id="card${challenge1.challenge_id}-btn">Complete</button>
                                    </div>
                                </div>

                                <div class="card m-3" style="width: 18rem;" id="card${challenge2.challenge_id}">
                                    <div class="card-body">
                                        <h5 class="card-title">Challenge ID: ${challenge2.challenge_id}</h5>
                                        <h6 class="card-subtitle mb-2 text-muted">Creator ID: ${challenge2.creator_id}</h6>
                                        <p class="card-text"><strong>Challenge Description:</strong> ${challenge2.description}</p>
                                        <div class="mb-2">
                                            <img src="./images/points_icon.png" alt="Points icon" class="format-quest-points-icon">
                                            <span class="card-text">Points: ${challenge2.points}</span>
                                        </div>
                                        <button class="btn btn-primary" id="card${challenge2.challenge_id}-btn">Complete</button>
                                    </div>
                                </div>

                                <div class="card m-3" style="width: 18rem;" id="card${challenge3.challenge_id}">
                                    <div class="card-body">
                                        <h5 class="card-title">Challenge ID: ${challenge3.challenge_id}</h5>
                                        <h6 class="card-subtitle mb-2 text-muted">Creator ID: ${challenge3.creator_id}</h6>
                                        <p class="card-text"><strong>Challenge Description:</strong> ${challenge3.description}</p>
                                        <div class="mb-2">
                                            <img src="./images/points_icon.png" alt="Points icon" class="format-quest-points-icon">
                                            <span class="card-text">Points: ${challenge3.points}</span>
                                        </div>
                                        <button class="btn btn-primary" id="card${challenge3.challenge_id}-btn">Complete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `);

                    
                    indicatorsField.innerHTML += `
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${i}" class="${i == 0 ? 'active' : ''}"></button>
                    `;

                    // Adds event listener to the Complete button
                    document.getElementById(`card${challenge1.challenge_id}-btn`).addEventListener('click', () => {
                        getChallengeDetails(challenge1.challenge_id);
                    });

                    document.getElementById(`card${challenge2.challenge_id}-btn`).addEventListener('click', () => {
                        getChallengeDetails(challenge2.challenge_id);
                    });

                    document.getElementById(`card${challenge3.challenge_id}-btn`).addEventListener('click', () => {
                        getChallengeDetails(challenge3.challenge_id);
                    });
                }
            } 

        // Token expired
        } else if (responseStatus == 401) {
            // redirects to login page
            window.location.href = './login.html'

        // Internal server error
        } else {
            alert('Error occured with the server. Check server is running before trying again. ')
        }
    }

    fetchMethod(url, callback, "GET", null, token);
}

fetchChallenges();
// -------------------------------------------------------------------------------------------------
// Completing challenge

// current challenge being done (challenge that the user clicks complete on)
let currentChallengeId = null;

// getting modal 
const modalElement = document.getElementById('challengeDetailsModal');
const modal = new bootstrap.Modal(modalElement);


// Opens modal to allow user to enter details about challenge completion
function getChallengeDetails(challenge_id) {
    // prompt user to give details through modal with form
    modal.show();

    // stores challenge id for event listener 
    currentChallengeId = challenge_id;
}

// waits for user to enter details and submit form
document.getElementById('challengeForm').addEventListener('submit', (e) => {
    e.preventDefault()
    // hides modal
    modal.hide();
    completeChallenge(currentChallengeId);
})

// Sends the fetch request and shows the toast if successful
function completeChallenge(challenge_id) {

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    // get details entered
    const details = document.getElementById('challengeDetailsField').value;

    // clears the form textarea 
    document.getElementById('challengeDetailsField').value = '';

    const url = `http://localhost:3000/api/completion/${challenge_id}`;

    const data = {
        user_id: userId, 
        details: details
    }

    const callback = (responseStatus, responseData) => {
        // ok
        if (responseStatus == 201) {

            // show that completion record created using the toast 
            const successToast = document.getElementById('successToast');
            const toast = new bootstrap.Toast(successToast)

            // call to show updated points
            getPoints();

            toast.show();

        // token expired or challenge or user not found
        } else if (responseStatus == 401 || responseStatus == 404) {
            // redirect to login
            window.location.href = '/login.html';

        // details or user_id missing
        } else if (responseStatus == 400) {
            alert('Please enter challenge details');

        // Internal server error
        } else {
            alert('Error occured with the server. Check that server is running before trying again. ')
        }
    }

    fetchMethod(url, callback, "POST", data, token);
}

// -------------------------------------------------------------------------------------------------
// Creating challenge

document.getElementById('create-button').addEventListener('click', getCreateChallengeDetails)

const createChallengeModalElement = document.getElementById('createChallengeModal');
const createChallengeModal = new bootstrap.Modal(createChallengeModalElement);

// user_id , description and points

// Opens modal to get challenge details for new challenge
function getCreateChallengeDetails() {
    // opens create challenge modal
    createChallengeModal.show();
}

document.getElementById('createChallengeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // hide the modal
    createChallengeModal.hide()
    createChallenge()
});

// reload browser after challenge created to show new challenge
function createChallenge() {

    const url = `http://localhost:3000/api/challenges`;

    const user_id = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    const points = document.getElementById('createChallengePointsField').value;
    const description = document.getElementById('createChallengeDetailsField').value;

    // check that points is an integer
    if (isNaN(points)) {
        const errorToast = document.getElementById('errorToast');
        const toast = new bootstrap.Toast(errorToast);

        document.getElementById('error-text').textContent = 'Please enter an integer for points value'
        
        toast.show();
        return;
    }

    const data = {
        user_id: user_id, 
        points: points, 
        description: description
    }

    const callback = (responseStatus, responseData) => {
        // ok
        if (responseStatus == 201) {
            console.log('running')

            // show that completion record created using the toast 
            const challengeCreatedToast = document.getElementById('challengeCreatedToast');
            const toast = new bootstrap.Toast(challengeCreatedToast);

            // refetch challenges to show the newly created one 
            fetchChallenges();

            toast.show();

        // token expired or challenge or user not found
        } else if (responseStatus == 401 || responseStatus == 404) {
            // redirect to login
            window.location.href = '/login.html';

        // details or user_id missing
        } else if (responseStatus == 400) {
            alert('Please enter challenge details');

        // Internal server error
        } else {
            alert('Error occured with the server. Check that server is running before trying again. ')
        }
    }

    fetchMethod(url, callback, 'POST', data, token);

    document.getElementById('createChallengeForm').reset();
}

// ---------------------------- VIEW CHALLENGE RECORDS --------------------------------
document.getElementById('viewChallengeRecordsBtn').addEventListener('click', () => {

    fetchCompletedChallenges();
    fetchCreatedChallenges();

    const challengeRecordsModal = document.getElementById('viewChallengeRecordsModal');
    const recordsModal = new bootstrap.Modal(challengeRecordsModal);

    recordsModal.show();
})

const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

function fetchCompletedChallenges() {
    const url = `http://localhost:3000/api/completion/user/${userId}`;

    const callback = (responseStatus, responseData) => {
        if (responseStatus == 200) {
            // responseData contains: 
            // challenge_id, completion_id, details, user_id

            let body = document.getElementById('completedChallengesContainer');

            // user has not completed any challenges
            if (responseData.length == 0) {
                body.innerText = 'You have not completed any challenges yet';
            } else {
                let tempHTML = `<div class="row g-2">`;
                for (let i = 0; i < responseData.length; i++) {
                    let challenge = challenges.find(challenge => challenge.challenge_id == responseData[i].challenge_id);

                    tempHTML += `
                        <div class="col-12 col-md-6 col-lg-4">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h5 class="card-title">${challenge.description}</h5>
                                    <p class="card-text">
                                        Details provided: ${responseData[i].details}
                                    </p>
                                    <span class="badge bg-success">
                                        Completed
                                    </span>
                                </div>
                            </div>
                        </div>
                    `;
                }

                tempHTML += '</div>'
                body.innerHTML = tempHTML;
            }

            console.log('Completed Challenges: ', responseData);
            console.log('challenges', challenges);

        // token expired
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

function fetchCreatedChallenges() {
    const url = `http://localhost:3000/api/challenges/user/${userId}`;

    const callback = (responseStatus, responseData) => {
        if (responseStatus == 200) {
            // responseData contains: 
            // challenge_id, creator_id, description, points

            let body = document.getElementById('createdChallengesContainer');

            // user has not completed any challenges
            if (responseData.length == 0) {
                body.innerText = 'You have not created any challenges yet';
            } else {
                let tempHTML = `<div class="row g-2">`;
                for (let i = 0; i < responseData.length; i++) {
                    let challenge = challenges.find(challenge => challenge.challenge_id == responseData[i].challenge_id);

                    tempHTML += `
                        <div class="col-12 col-md-6 col-lg-4">
                            <div class="card h-100">
                                <div class="card-body d-flex flex-column">
                                    <h5 class="card-title">${challenge.description}</h5>
                                    <div class="mt-auto">
                                        <img src="./images/points_icon.png" alt="Points icon" class="format-quest-points-icon me-2">
                                        <span class="card-text">Points: ${responseData[i].points}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }

                tempHTML += '</div>'
                body.innerHTML = tempHTML;
            }

            console.log('Created Challenges: ', responseData);

        // token expired
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






    /* Templates

    // template for indicator
    const indicator = `<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${current_slide_index}" class="active"></button>`;

    // template for 1 carousel item (fits 3 cards)
    const templateOuter = `
    <div class="carousel-item">
        <div class="container d-flex justify-content-center">

        </div>
    </div>
    `;

    // template for 1 card 
    const templateCard = `
        <div class="carousel-item ${i == 0 ? 'active' : ''}">
            <div class="container d-flex justify-content-center">

                <div class="card m-3" style="width: 18rem;" id=card1>
                    <div class="card-body">
                        <h5 class="card-title">Challenge ID: ${challenge1.challenge_id}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Creator ID: ${challenge1.creator_id}</h6>
                        <p class="card-text"><strong>Challenge Description:</strong> ${challenge1.description}</p>
                        <div class="mb-2">
                            <img src="./images/points_icon.png" alt="Points icon" class="format-quest-points-icon">
                            <span class="card-text">Points: ${challenge1.points}</span>
                        </div>
                        <button class="btn btn-primary" id="card1-btn">Complete</button>
                    </div>
                </div>

            </div>
        </div>
    `;

    */