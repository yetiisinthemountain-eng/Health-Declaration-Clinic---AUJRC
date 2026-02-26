// ====== NEW ACCOUNT-BASED COOLDOWN SYSTEM (20 MINUTES) ======

const COOLDOWN_TIME = 20 * 60 * 1000; // 20 minutes
const submitBtn = document.getElementById('submitBtn');
let isSubmitting = false; // Flag to prevent multiple clicks

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
    
    // Prevent spam clicks - check if already submitting
    if (isSubmitting) {
        return;
    }
    
    const status = canSubmit();
    if (!status.canSubmit) {
        alert(`You must wait ${formatRemainingTime(status.remaining)} before submitting again.`);
        return;
    }

    if (selectedSymptoms.length === 0) {
        alert('Please check at least one symptom or type a custom symptom before submitting.');
        return;
    }

    // Mark as submitting and disable button immediately
    isSubmitting = true;
    submitBtn.disabled = true;
    submitBtn.innerText = "Submitting...";

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
        // Re-enable button on error so user can try again
        isSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit Symptom Report";
        alert('There was an error submitting the form. Please try again.');
    });
});
