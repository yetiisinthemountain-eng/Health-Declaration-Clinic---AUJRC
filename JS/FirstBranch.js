
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const loginLink = document.getElementById('login-link');
    const navUl = document.querySelector('nav ul');

    if (loggedInUser) {
      const profileLi = document.createElement('li');
      profileLi.innerHTML = '<a href="profile.html">Profile</a>';
      navUl.insertBefore(profileLi, loginLink);
      
      loginLink.innerHTML = '<a href="#" id="logout-link">Logout</a>';

      document.getElementById('logout-link').addEventListener('click', function(event) {
        event.preventDefault();
        localStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';

      });
    } else {

    }