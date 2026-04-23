// Registering
const registerForm = document.getElementById('registerForm');

// calls register when the submit button is clicked
registerForm.addEventListener('submit', register);

// Where error/success messages will be shown
const messageField = document.getElementById('message');

function register(e) {
    // prevents reload 
    e.preventDefault();

    const registerURL = 'http://localhost:3000/api/users/register';

    // get inputted value by user
    const registerUsername = document.getElementById('registerUsername');
    const registerPassword = document.getElementById('registerPassword');

    const registerData = {
        username: registerUsername.value, 
        password: registerPassword.value
    }

    const callback = (responseStatus, responseData) => {
        // ok user registered
        if (responseStatus == 200) {
            if (responseData.token) {

                // Store the token in local storage
                localStorage.setItem("token", responseData.token);
                localStorage.setItem("userId", responseData.userId);
                
                // button redirects users to login page
                messageField.innerHTML = `
                    <p class = "border border-success border-3 p-3 rounded rounded-3 d-inline-block success-message">
                        Successfully registered. Proceed to login. 
                        <button type="button" class="btn-close" id = "message-close"></button>
                    </p>
                    
                    <div class="me-3">
                        <a class="btn btn-info text-light" href="login.html" role="button">Proceed to Login!</a>
                    </div>
                    `;

                const closeButton = document.getElementById("message-close");

                closeButton.addEventListener('click', (e) => {
                    document.getElementById("message").textContent = '';
                })

            }
        // missing username or password
        } else if (responseStatus == 400) {
            messageField.innerHTML = `
            <p class = "border border-danger border-3 p-3 rounded rounded-3 d-inline-block error-message">
                Username or password is missing. Please fill in both fields.

                <button type="button" class="btn-close" id = "message-close"></button>
            </p>
            `;

            const closeButton = document.getElementById("message-close");
            
            closeButton.addEventListener('click', (e) => {
                document.getElementById("message").textContent = '';
            })
        // Conflict with another user's username (username is taken)
        } else if (responseStatus == 409) {
            messageField.innerHTML = `
                <p class = "border border-danger border-3 p-3 rounded rounded-3 d-inline-block error-message">
                    Username is taken. Please choose a different username. 

                    <button type="button" class="btn-close" id = "message-close"></button>
                </p>
                `;
            const closeButton = document.getElementById("message-close");

            closeButton.addEventListener('click', (e) => {
                document.getElementById("message").textContent = '';
            })
        // Internal sever error
        } else if (responseStatus == 500) {
            messageField.innerHTML = `
                    <p class = "border border-success border-3 p-3 rounded rounded-3 d-inline-block success-message">
                        Error occured with the server. Try again later. 
                        <button type="button" class="btn-close" id = "message-close"></button>
                    </p>
                    
                    <div class="me-3">
                        <a class="btn btn-info text-light" href="login.html" role="button">Proceed to Login!</a>
                    </div>
                    `;
                    
            const closeButton = document.getElementById("message-close");

            closeButton.addEventListener('click', (e) => {
                document.getElementById("message").textContent = '';
            })
        }
    }

    fetchMethod(registerURL, callback, "POST", registerData)
}



