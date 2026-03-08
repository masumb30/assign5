
const signinBtn = document.getElementById('signin-btn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
signinBtn.addEventListener('click', function() {
    // check login info first
    const username = usernameInput.value;
    const password = passwordInput.value;
    if(username === 'admin' && password === 'admin123'){

        window.location.assign('dashboard.html');
    }else{
        alert('Invalid Credentials')
    }
})