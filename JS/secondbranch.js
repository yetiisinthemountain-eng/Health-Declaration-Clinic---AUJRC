// ====== KEEP ALL OF THIS (No changes needed) ======

// Check if user is logged in
const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
if (!loggedInUser) {
    window.location.href = 'login.html';
} else {
    // Pre-fill form with user data
    document.getElementById('name').value = loggedInUser.username || '';
    
    const gmailInput = document.getElementById('gmail');
    gmailInput.value = loggedInUser.gmail || '';
    if (gmailInput.value) {
        gmailInput.readOnly = true;
    }
    
    const gradeSelect = document.getElementById('grade');
    let gradeValue = '';
    const gradeLevel = loggedInUser.gradeLevel;
    const parsedGrade = parseInt(gradeLevel, 10);
    
    if (!isNaN(parsedGrade)) {
        if (parsedGrade >= 0 && parsedGrade <= 6) {
            gradeValue = 'Elementary';
        } else if (parsedGrade >= 7 && parsedGrade <= 10) {
            gradeValue = 'Highschool';
        } else if (parsedGrade >= 11 && parsedGrade <= 12) {
            gradeValue = 'SHS';
        }
    } else if (gradeLevel === 'Teacher') {
        gradeValue = 'Teacher';
    } else if (gradeLevel === 'Staff') {
        gradeValue = 'Staff';
    } else if (gradeLevel === 'N/A' || !gradeLevel) {
        if (loggedInUser.role === 'Teacher') {
            gradeValue = 'Teacher';
        } else if (loggedInUser.role === 'Staff') {
            gradeValue = 'Staff';
        }
    }
    
    gradeSelect.value = gradeValue;
    
    const options = gradeSelect.querySelectorAll('option');
    options.forEach(option => {
        if (option.value !== gradeValue) {
            option.disabled = true;
        } else {
            option.disabled = false;
        }
    });
    
    const sectionInput = document.getElementById('section');
    const adviserInput = document.getElementById('adviserName');
    if (gradeValue === 'Teacher' || gradeValue === 'Staff') {
        sectionInput.disabled = true;
        sectionInput.required = false;
        sectionInput.value = '';
        adviserInput.disabled = true;
        adviserInput.required = false;
        adviserInput.value = '';
    } else {
        sectionInput.disabled = false;
        sectionInput.required = true;
        adviserInput.disabled = false;
        adviserInput.required = true;
    }
    
    gradeSelect.dispatchEvent(new Event('change'));
    
    document.getElementById('section').value = `${loggedInUser.gradeLevel || ''}, ${loggedInUser.strand || ''}, ${loggedInUser.section || ''}`.trim().replace(/^,|,$/g, '');
    
    if (loggedInUser.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(loggedInUser.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        const ageInput = document.getElementById('age');
        ageInput.value = age;
        ageInput.readOnly = true;
    }
}

// Symptom to medicine mapping
const symptomMedicineMap = {
    'fever': 'Paracetamol',
    'cough': 'Dextromethorpan',
    'headache': 'Ibuprofen',
    'sorethroat': 'Symdex',
    'runnynose': 'Symdex',
    'fatigue': 'Not sure / Don\'t know',
    'nausea': 'Dicycloverin',
    'dizziness': 'Not sure / Don\'t know',
    'shortnessofbreath': 'Not sure / Don\'t know',
    'bodyaches': 'Ibuprofen',
    'stomachaches': 'Not sure / Don\'t know',
};

function updateMedicines() {
    const selectedMedicines = new Set();
    selectedSymptoms.forEach(symptom => {
        const lowerSymptom = symptom.toLowerCase().replace(/\s+/g, '');
        if (symptomMedicineMap[lowerSymptom]) {
            selectedMedicines.add(symptomMedicineMap[lowerSymptom]);
        }
    });
    const medicineInput = document.getElementById('medicineneeded');
    if (selectedMedicines.size > 0) {
        medicineInput.value = Array.from(selectedMedicines).join(' | ');
        document.getElementById('medicineNote').style.display = 'block';
    } else {
        medicineInput.value = '';
        document.getElementById('medicineNote').style.display = 'none';
    }
}

let selectedSymptoms = [];

function updateSymptomDisplay() {
    const container = document.getElementById('symptomTags');
    const displayDiv = document.getElementById('selectedSymptoms');

    if (selectedSymptoms.length > 0) {
        container.innerHTML = selectedSymptoms
            .map(s => `<span class="symptom-tag">${s}</span>`)
            .join('');
        displayDiv.style.display = 'block';
    } else {
        displayDiv.style.display = 'none';
    }
    updateMedicines();
}

document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            selectedSymptoms.push(this.value);
        } else {
            selectedSymptoms = selectedSymptoms.filter(s => s !== this.value);
        }
        updateSymptomDisplay();
    });
});

document.getElementById('addCustomSymptomBtn').addEventListener('click', function() {
    const input = document.getElementById('customSymptom');
    const val = input.value.trim();
    const btn = this;
    
    if (!val) {
        alert('Please enter a symptom.');
        return;
    }

    if (!confirm('Are you sure? This symptom will be permanently added.')) {
        return;
    }

    // Add symptom to the list
    selectedSymptoms.push(val);
    updateSymptomDisplay();

    // Create hidden input for form submission
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'data[Custom Symptom]';
    hiddenInput.value = val;
    document.getElementById('sheetdb-form').appendChild(hiddenInput);

    // Disable the input and gray it out
    input.disabled = true;
    input.classList.add('gray-out');
    
    // Disable the button
    btn.disabled = true;
    btn.textContent = 'Added';
});

document.getElementById('grade').addEventListener('change', function() {
    const isTeacherOrStaff = this.value === 'Teacher' || this.value === 'Staff';
    const sectionInput = document.getElementById('section');
    const adviserInput = document.getElementById('adviserName');

    if (isTeacherOrStaff) {
        sectionInput.disabled = true;
        sectionInput.required = false;
        sectionInput.value = '';
        adviserInput.disabled = true;
        adviserInput.required = false;
        adviserInput.value = '';
    } else {
        sectionInput.disabled = false;
        sectionInput.required = true;
        adviserInput.disabled = false;
        adviserInput.required = true;
    }
});

document.querySelectorAll('select').forEach(select => {
    select.addEventListener('focus', function() {
        const placeholder = this.querySelector('option[value=""]');
        if (placeholder) {
            placeholder.remove();
        }
    });
});


// ====== NEW ACCOUNT-BASED COOLDOWN SYSTEM (20 MINUTES) ======

const COOLDOWN_TIME = 20 * 60 * 1000; // 20 minutes
const submitBtn = document.getElementById('submitBtn');

function getLastSubmissionTime() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser || !loggedInUser.gmail) return null;
    const key = `lastSubmit_${loggedInUser.gmail}`;
    return localStorage.getItem(key);
}

function saveSubmissionTime() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser || !loggedInUser.gmail) return;
    const key = `lastSubmit_${loggedInUser.gmail}`;
    localStorage.setItem(key, Date.now().toString());
}

function canSubmit() {
    const lastTime = getLastSubmissionTime();
    if (!lastTime) return { canSubmit: true, remaining: 0 };
    const elapsed = Date.now() - parseInt(lastTime);
    const remaining = COOLDOWN_TIME - elapsed;
    return { canSubmit: remaining <= 0, remaining: remaining > 0 ? remaining : 0 };
}

function formatRemainingTime(ms) {
    if (ms <= 0) return "0:00";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function updateSubmitButton() {
    const status = canSubmit();
    const cooldownMsg = document.getElementById('cooldownMessage');
    
    if (!status.canSubmit) {
        submitBtn.disabled = true;
        submitBtn.innerText = `Wait ${formatRemainingTime(status.remaining)} to submit again`;
        
        if (!cooldownMsg) {
            const msg = document.createElement('p');
            msg.id = 'cooldownMessage';
            msg.style.cssText = 'color: red; text-align: center; margin-top: 10px;';
            msg.innerHTML = `<strong>Please wait ${formatRemainingTime(status.remaining)} before submitting again.</strong><br>Each account can only submit once every 20 minutes.`;
            submitBtn.parentNode.insertBefore(msg, submitBtn.nextSibling);
        } else {
            cooldownMsg.innerHTML = `<strong>Please wait ${formatRemainingTime(status.remaining)} before submitting again.</strong><br>Each account can only submit once every 20 minutes.`;
        }
        setTimeout(updateSubmitButton, 1000);
    } else {
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit Symptom Report";
        if (cooldownMsg) cooldownMsg.remove();
    }
}

// Check cooldown on page load
window.addEventListener('DOMContentLoaded', function() {
    const status = canSubmit();
    if (!status.canSubmit) {
        updateSubmitButton();
    }
});

// Form submission handler
var form = document.getElementById('sheetdb-form');
form.addEventListener("submit", e => {
    e.preventDefault();

    const status = canSubmit();
    if (!status.canSubmit) {
        alert(`You must wait ${formatRemainingTime(status.remaining)} before submitting again.`);
        return;
    }

    if (selectedSymptoms.length === 0) {
        alert('Please check at least one symptom or type a custom symptom before submitting.');
        return;
    }

    const symptomsString = selectedSymptoms.join(', ');
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'data[Selected Symptoms]';
    hiddenInput.value = symptomsString;
    form.appendChild(hiddenInput);

    const now = new Date();
    const utcOffset = 8 * 60 * 60 * 1000;
    const localTime = new Date(now.getTime() + utcOffset);
    const year = localTime.getUTCFullYear();
    const month = String(localTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(localTime.getUTCDate()).padStart(2, '0');
    const hours = localTime.getUTCHours();
    const minutes = String(localTime.getUTCMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    const formattedTimestamp = `${month}-${day}-${year} ${hour12}:${minutes} ${ampm}`;
    
    const timestampInput = document.createElement('input');
    timestampInput.type = 'hidden';
    timestampInput.name = 'data[Timestamp]';
    timestampInput.value = formattedTimestamp;
    form.appendChild(timestampInput);

    fetch(form.action, {
        method: "POST",
        body: new FormData(form),
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    }).then((data) => {
        saveSubmissionTime();
        updateSubmitButton();
        alert('Submitted the Health Declaration Form. Please Head to the Clinic to get Treated. ' + document.getElementById('name').value);
        location.reload();
    }).catch((error) => {
        console.error('Error submitting form:', error);
        alert('There was an error submitting the form. Please try again.');
    });
});