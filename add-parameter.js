// user-data-extractor.js - Updated with exact HTML structure
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

    // Try repeatedly until form fields are found
    let attempts = 0;
    const maxAttempts = 30;
    
    function attemptFill() {
      if (attempts >= maxAttempts) {
        console.log('Maximum fill attempts reached');
        return;
      }
      
      attempts++;
      console.log(`Form fill attempt ${attempts}/${maxAttempts}`);
      
      // Based on the HTML screenshot, target fields directly
      const companyInput = document.querySelector('input[name="companyName"]');
      const emailInput = document.querySelector('input[name="email"]');
      
      console.log('Found company input:', companyInput);
      console.log('Found email input:', emailInput);
      
      let filled = false;
      
      // Fill company field if found
      if (companyInput && company) {
        console.log('Filling company field:', companyInput);
        companyInput.value = company;
        companyInput.dispatchEvent(new Event('input', {bubbles: true}));
        companyInput.dispatchEvent(new Event('change', {bubbles: true}));
        filled = true;
      }
      
      // Fill email field if found
      if (emailInput && email) {
        console.log('Filling email field:', emailInput);
        emailInput.value = email;
        emailInput.dispatchEvent(new Event('input', {bubbles: true}));
        emailInput.dispatchEvent(new Event('change', {bubbles: true}));
        filled = true;
      }
      
      // If successful, we can stop
      if (filled) {
        console.log('Successfully filled form fields');
        return;
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
