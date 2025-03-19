// user-data-extractor.js - Updated with input.form-control targeting
(function() {
  try {
    // Parse URL parameters
    const hashParams = new URLSearchParams(window.location.hash.replace('#/?', ''));
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get user data from URL parameters
    const email = hashParams.get('email') || urlParams.get('email') || '';
    const company = hashParams.get('company') || urlParams.get('company') || '';
    const userId = hashParams.get('uid') || urlParams.get('uid') || '';
    
    // Store in localStorage
    if (email) localStorage.setItem('userEmail', email);
    if (company) localStorage.setItem('companyName', company);
    if (userId) localStorage.setItem('userId', userId);
    
    console.log('User data from URL stored in localStorage:', { email, company, userId });
    
    // A function to find and fill form fields
    function fillFormFields() {
      console.log('Attempting to fill form.control inputs');
      
      // Get all form-control inputs
      const formControls = document.querySelectorAll('input.form-control');
      console.log(`Found ${formControls.length} form-control inputs`);
      
      if (formControls.length >= 2) {
        // In the screenshot, it seems the company name is the first field and email is the second
        const companyField = formControls[0];
        const emailField = formControls[1];
        
        // Fill company field if found
        if (companyField && company) {
          console.log('Filling company field:', companyField);
          companyField.value = company;
          companyField.dispatchEvent(new Event('input', {bubbles: true}));
          companyField.dispatchEvent(new Event('change', {bubbles: true}));
        }
        
        // Fill email field if found
        if (emailField && email) {
          console.log('Filling email field:', emailField);
          emailField.value = email;
          emailField.dispatchEvent(new Event('input', {bubbles: true}));
          emailField.dispatchEvent(new Event('change', {bubbles: true}));
        }
      } else {
        // If fields aren't found, try again later
        setTimeout(fillFormFields, 1000);
      }
    }
    
    // Try repeatedly until form fields are found
    let attempts = 0;
    const maxAttempts = 20;
    
    function attemptFill() {
      if (attempts >= maxAttempts) {
        console.log('Maximum fill attempts reached');
        return;
      }
      
      attempts++;
      console.log(`Form fill attempt ${attempts}/${maxAttempts}`);
      
      // Get all form-control inputs
      const formControls = document.querySelectorAll('input.form-control');
      
      if (formControls.length >= 2) {
        // In the screenshot, it appears company name is first field and email is second
        const companyField = formControls[0];
        const emailField = formControls[1];
        
        let filled = false;
        
        // Fill company field if found and we have company data
        if (companyField && company) {
          console.log('Filling company field:', companyField);
          companyField.value = company;
          companyField.dispatchEvent(new Event('input', {bubbles: true}));
          companyField.dispatchEvent(new Event('change', {bubbles: true}));
          filled = true;
        }
        
        // Fill email field if found and we have email data
        if (emailField && email) {
          console.log('Filling email field:', emailField);
          emailField.value = email;
          emailField.dispatchEvent(new Event('input', {bubbles: true}));
          emailField.dispatchEvent(new Event('change', {bubbles: true}));
          filled = true;
        }
        
        if (filled) {
          console.log('Successfully filled form fields');
          return; // Stop attempts if we filled fields
        }
      }
      
      // If no fields filled, try again in a second
      setTimeout(attemptFill, 1000);
    }
    
    // Start attempting to fill
    attemptFill();
    
    // Also try when DOM is fully loaded
    if (document.readyState !== 'complete') {
      document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, attempting to fill form fields');
        attempts = 0; // Reset attempt counter
        attemptFill();
      });
    }
    
    // Final attempt when window is loaded
    window.addEventListener('load', () => {
      console.log('Window loaded, final attempt to fill form fields');
      attempts = 0; // Reset attempt counter
      attemptFill();
    });
    
  } catch (err) {
    console.error('Error in user-data-extractor:', err);
  }
})();
