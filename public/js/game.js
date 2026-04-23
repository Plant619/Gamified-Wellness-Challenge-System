// query and display user points
function getPoints() {
    // get the user_id from the local storage
    const user_id = localStorage.getItem('userId');

    const url = `http://localhost:3000/api/users/${user_id}`;

    const pointsMessage = document.getElementById('currentPoints')

    const callback = (responseStatus, responseData) => {
        if (responseStatus == 200) {
            pointsMessage.innerText = `${responseData.points}`;

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

getPoints();

checkAdmin();

showAdminTab();
