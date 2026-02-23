function handleSubmit(event) {
    event.preventDefault();
    const symptoms = Array.from(document.querySelectorAll('input[name="symptoms"]:checked')).map(cb => cb.value);
    symptoms.push(...selectedSymptoms);
    

    if (symptoms.length === 0) {
        alert('Please select at least one symptom.');
        return; 
    }
    
    const data = Object.fromEntries(new FormData(event.target)) || {};
    data.symptoms = symptoms;
    console.log('Form submitted:', data);
    alert('Symptom report submitted successfully!\n\nData:\n' + JSON.stringify(data, null, 2));
    

    setTimeout(() => {
        location.reload();
    }, 2000);
}