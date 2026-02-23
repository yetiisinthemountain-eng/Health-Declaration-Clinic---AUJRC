// Admin Log

// Accounts Data in the server
const accounts = [
    { 
        username: "Ruben Nicole L. Mendoza", 
        password: "Mendoza", 
        lrn: "1366608140400", 
        gmail: "lozadamendozarubennicole@gmail.com", 
        dateOfBirth: "2008-10-04", 
        gradeLevel: "12", 
        strand: "ICT", 
        section: "1P", 
        studentNo: "AUJR-SHS-TIC-24-01077" 
    },
    { 
        username: "Aaron Cedrick V. Bulanier", 
        password: "Bulanier", 
        lrn: "987654321098", 
        gmail: "student2@arellano.edu.ph", 
        dateOfBirth: "2008-05-12", 
        gradeLevel: "12", 
        strand: "ICT", 
        section: "1P", 
        studentNo: "AUJR-SHS-TIC-24-01077" 
    },
    { 
        username: "Isseiah Grace S. Hamto", 
        password: "Hamto", 
        lrn: "112233445566", 
        gmail: "student3@arellano.edu.ph", 
        dateOfBirth: "2008-06-06", 
        gradeLevel: "12", 
        strand: "ICT", 
        section: "1P", 
        studentNo: "AUJR-SHS-TIC-24-01077" 
    },
    { 
        username: "Arinzel A. Abrise", 
        password: "Abrise", 
        lrn: "987654321098", 
        gmail: "student4@arellano.edu.ph", 
        dateOfBirth: "2008-05-20", 
        gradeLevel: "12", 
        strand: "ICT", 
        section: "1P", 
        studentNo: "AUJR-SHS-TIC-24-01077" 
    },
    { 
        username: "Karl Randylle F. Sumapig", 
        password: "Sumapig", 
        lrn: "676767676767", 
        gmail: "madeforkarl@gmail.com", 
        dateOfBirth: "1967-06-07", 
        gradeLevel: "12", 
        strand: "ICT", 
        section: "1P", 
        studentNo: "AUJR-SHS-TIC-67-67677" 
    },
    { 
        username: "Xyrille Dela Cruz", 
        password: "DelaCruz", 
        lrn: "123456789012", 
        gmail: "student5@arellano.edu.ph", 
        dateOfBirth: "2008-06-07", 
        gradeLevel: "Teacher", 
        strand: "Teacher", 
        section: "Teacher", 
        studentNo: "N/A" 
    },
];


// below (JS)








// JS Script
// Prohibit Touching this part
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const gmail = document.getElementById('gmail').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error');


    const user = accounts.find(acc => acc.gmail === gmail && acc.password === password);

    if (user) {
        errorDiv.textContent = "";

        localStorage.setItem('loggedInUser', JSON.stringify(user));

        window.location.href = 'FirstBranch.html';
    } else {
        errorDiv.textContent = "Invalid username or password.";
    }
});