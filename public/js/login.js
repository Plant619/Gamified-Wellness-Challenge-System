// Logging in 
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', login);

// where error/success message will be displayed
const messageField = document.getElementById('message');

function login(e) {
    e.preventDefault();

    const loginURL = 'http://localhost:3000/api/users/login';

    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');

    const loginData = {
        username: loginUsername.value, 
        password: loginPassword.value
    }

    const callback = (responseStatus, responseData) => {
        // ok
        if (responseStatus == 200) {
            if (responseData.token) {
            
                // Store the token in local storage
                localStorage.setItem("token", responseData.token);
                localStorage.setItem("userId", responseData.userId);
                checkAdmin();
                
                messageField.innerHTML = `
                    <p class = "border border-success border-3 p-3 rounded rounded-3 d-inline-block success-message">
                        Login successful. Redirecting...  
                        <button type="button" class="btn-close" id = "message-close"></button>
                    </p>
                    `;

                const closeButton = document.getElementById("message-close");

                closeButton.addEventListener('click', (e) => {
                    document.getElementById("message").textContent = '';
                })

                // Redirect user to game
                window.location.href = "/game_quest.html";
                // adds role (user/admin)
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
        // username or password is wrong
        } else if (responseStatus == 401 || responseStatus == 404) {
                messageField.innerHTML = `
                    <p class = "border border-danger border-3 p-3 rounded rounded-3 d-inline-block error-message">
                        Username or password is wrong. 

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

    fetchMethod(loginURL, callback, "POST", loginData)
}




