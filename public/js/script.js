function checkAdmin() {

    const user_id = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    const validateAdminURL = `http://localhost:3000/api/admin/${user_id}`;

    // adds role admin if user is an admin
     const callback = (responseStatus, responseData) => {
        if (responseStatus == 200) {
            localStorage.setItem('role', 'admin');
            return 'admin';

        // No admin access
        } else if (responseStatus == 403) {
            localStorage.setItem('role', 'user');
            return 'user';

        // token expired
        } else if (responseStatus == 401) {
            // redirects to login page
            window.location.href = './login.html'
        // Internal server error
        } else {
            alert('Error occured with the server. Check server is running before trying again. ')
        }
    }

    fetchMethod(validateAdminURL, callback, 'GET', null, token);
}

function showAdminTab() {
    console.log('working')
    const role = localStorage.getItem('role');
    const adminTab = document.getElementById('adminTab'); 

    if (role == 'admin') {
        adminTab.style.display = 'block';

    // user
    } else {
        adminTab.style.display = 'none';

    }
}

