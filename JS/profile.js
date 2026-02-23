// Check if user is logged in
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
            // If not logged in, redirect back to login
            window.location.href = 'login.html';
        } else {
            // Display welcome message
            document.getElementById('welcomeMessage').textContent = `Welcome, ${loggedInUser.username}, Of (${loggedInUser.gradeLevel} ${loggedInUser.strand} ${loggedInUser.section})!`;
            
            // Display profile info
            const profileInfo = document.getElementById('profileInfo');
            profileInfo.innerHTML = `
                <p><strong>Username:</strong> ${loggedInUser.username}</p>
                <p><strong>LRN:</strong> ${loggedInUser.lrn || 'N/A'}</p>
                <p><strong>Gmail:</strong> ${loggedInUser.gmail || 'N/A'}</p>
                <p><strong>Date of Birth:</strong> ${loggedInUser.dateOfBirth || 'N/A'}</p>
                <p><strong>Grade Level:</strong> ${loggedInUser.gradeLevel || 'N/A'}</p>
                <p><strong>Strand:</strong> ${loggedInUser.strand || 'N/A'}</p>
                <p><strong>Section:</strong> ${loggedInUser.section || 'N/A'}</p>
                <p><strong>Student No:</strong> ${loggedInUser.studentNo || 'N/A'}</p>
            `;
        }

        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', function() {
            localStorage.removeItem('loggedInUser');
            window.location.href = 'login.html'; // Redirect to login page
        });