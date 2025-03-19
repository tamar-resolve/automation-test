// user-data-extractor.js - Modified for delayed execution
(function() {
  // Keep track of whether we've successfully filled the form
  let formFilled = false;
  
  // Function to extract and process URL parameters
  function processUrlParams() {
    try {
      // Parse URL parameters
      const hashParams = new URLSearchParams(window.location.hash.replace('#/?', ''));
      const urlParams = new URLSearchParams(window.location.search);
      
      // Get user data from URL parameters
      const email = hashParams.get('email') || urlParams.get('email') || '';
      const company = hashParams.get('company') || urlParams.get('company') || '';
      const userId = hashParams.get('uid') || urlParams.get('uid') || '';
      
      // Only proceed if we have an email (our primary identifier)
      if (email) {
        // Store in localStorage
        localStorage.setItem('userEmail', email);
        if (company) localStorage.setItem('companyName', company);
        if (userId) localStorage.setItem('userId', userId);
        
        console.log('Valid user data from URL stored in localStorage:', { email, company, userId });
        
        // Try to fill the form with this data
        fillFormFields(email, company);
      } else {
        // Check if we have data in localStorage already
        const storedEmail = localStorage.getItem('userEmail');
        const storedCompany = localStorage.getItem('companyName');
        
        if (storedEmail) {
          console.log('Using previously stored user data:', { email: storedEmail, company: storedCompany });
          fillFormFields(storedEmail, storedCompany);
        }
      }
    } catch (err) {
      console.error('Error processing URL parameters:', err);
    }
  }
  
  // Function to directly find and fill form fields
  function fillFormFields(email, company) {
    // Don't proceed if we don't have an email or if we've already filled the form
    if (!email || formFilled) return;
    
    console.log('Attempting to fill form fields with email:', email);
    
    // Wait for React to fully render components
    setTimeout(() => {
      let emailField = null;
      let companyField = null;
      
      // Search for all input fields
      const inputs = document.querySelectorAll('input');
      console.log('Found', inputs.length, 'input fields');
      
      // Examine each input field to find email and company
      inputs.forEach(input => {
        const type = input.type.toLowerCase();
        const name = (input.name || '').toLowerCase();
        const id = (input.id || '').toLowerCase();
        const placeholder = (input.placeholder || '').toLowerCase();
        
        // Check if this looks like an email field
        if (type === 'email' || 
            name.includes('email') || 
            id.includes('email') || 
            placeholder.includes('email')) {
          emailField = input;
        }
        
        // Check if this looks like a company field
        if (name.includes('company') || 
            id.includes('company') || 
            placeholder.includes('company')) {
          companyField = input;
        }
      });
      
      // Fill email field if found
      if (emailField && (!emailField.value || emailField.value === '')) {
        console.log('Found and filling email field:', emailField);
        emailField.value = email;
        
        // Trigger events to notify React
        emailField.dispatchEvent(new Event('input', {bubbles: true}));
        emailField.dispatchEvent(new Event('change', {bubbles: true}));
        
        // Consider form partially filled
        formFilled = true;
      } else {
        console.log('Email field not found or already has a value');
      }
      
      // Fill company field if found and we have a company name
      if (companyField && company && (!companyField.value || companyField.value === '')) {
        console.log('Found and filling company field:', companyField);
        companyField.value = company;
        
        // Trigger events to notify React
        companyField.dispatchEvent(new Event('input', {bubbles: true}));
        companyField.dispatchEvent(new Event('change', {bubbles: true}));
      } else if (company) {
        console.log('Company field not found or already has a value');
      }
    }, 1000); // Wait a second for React to render
  }
  
  // Try immediately and periodically until successful
  processUrlParams();
  
  // Keep trying every 2 seconds until we fill the form or hit max attempts
  let attempts = 0;
  const maxAttempts = 10;
  
  const attemptInterval = setInterval(() => {
    if (formFilled || attempts >= maxAttempts) {
      clearInterval(attemptInterval);
      console.log(formFilled ? 'Form successfully filled' : 'Max attempts reached');
    } else {
      attempts++;
      console.log(`Attempt ${attempts} to fill form`);
      processUrlParams();
    }
  }, 2000);
})();
