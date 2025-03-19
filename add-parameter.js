// user-data-extractor.js - Updated with exact HTML structure
(function() {
  try {
    // Store user data globally so it's accessible to the application
    window.userData = {
      email: '',
      uid: '',
      company: ''
    };
    
    // Parse URL parameters - try both hash params and normal URL params
    const hashParams = new URLSearchParams(window.location.hash.replace('#/?', ''));
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get user data from URL parameters
    const email = hashParams.get('email') || urlParams.get('email') || '';
    const company = hashParams.get('company') || urlParams.get('company') || '';
    const userId = hashParams.get('uid') || urlParams.get('uid') || '';
    
    // Update global userData object
    window.userData.email = email;
    window.userData.uid = userId;
    window.userData.company = company;
    
    // Store in localStorage
    if (email) localStorage.setItem('userEmail', email);
    if (company) localStorage.setItem('companyName', company);
    if (userId) localStorage.setItem('userId', userId);
    
    console.log('User data from URL stored in localStorage:', { email, company, userId });
    
    // Function to modify any iframe URLs to include user data
    function setupIframeAutoInjection() {
      // Override the createElement method to intercept iframe creation
      const originalCreateElement = document.createElement;
      
      document.createElement = function(tagName) {
        const element = originalCreateElement.call(document, tagName);
        
        // If this is an iframe, set up a hook to modify its src when it's set
        if (tagName.toLowerCase() === 'iframe') {
          const originalSetAttribute = element.setAttribute;
          
          element.setAttribute = function(name, value) {
            // If setting the src attribute
            if (name.toLowerCase() === 'src' && value) {
              // Add user parameters to the URL
              const url = new URL(value, window.location.href);
              
              // Check if URL already has hash parameters
              if (url.hash && url.hash.includes('?')) {
                // Append to existing hash parameters
                url.hash = url.hash + '&email=' + encodeURIComponent(email) + 
                          '&uid=' + encodeURIComponent(userId) + 
                          '&company=' + encodeURIComponent(company);
              } else if (url.hash) {
                // Add parameters to hash
                url.hash = url.hash + '?email=' + encodeURIComponent(email) + 
                          '&uid=' + encodeURIComponent(userId) + 
                          '&company=' + encodeURIComponent(company);
              } else {
                // No hash, add one with parameters
                url.hash = '#/?email=' + encodeURIComponent(email) + 
                          '&uid=' + encodeURIComponent(userId) + 
                          '&company=' + encodeURIComponent(company);
              }
              
              value = url.toString();
              console.log('Modified iframe src to include user data:', value);
            }
            
            // Call the original setAttribute with potentially modified value
            return originalSetAttribute.call(this, name, value);
          };
        }
        
        return element;
      };
    }
    
    // Set up communication via postMessage
    function setupPostMessageListener() {
      window.addEventListener('message', function(event) {
        // If parent is providing user data
        if (event.data && event.data.type === 'USER_DATA' && event.data.data) {
          const receivedData = event.data.data;
          
          // Update our user data if received values are not empty
          if (receivedData.email && !window.userData.email) {
            window.userData.email = receivedData.email;
            localStorage.setItem('userEmail', receivedData.email);
          }
          
          if (receivedData.uid && !window.userData.uid) {
            window.userData.uid = receivedData.uid;
            localStorage.setItem('userId', receivedData.uid);
          }
          
          if (receivedData.company && !window.userData.company) {
            window.userData.company = receivedData.company;
            localStorage.setItem('companyName', receivedData.company);
          }
          
          console.log('Received user data via postMessage:', window.userData);
          
          // Trigger form fill after receiving data
          attempts = 0; // Reset attempt counter
          attemptFill();
        }
      });
      
      // Let parent know we're ready for user data
      try {
        window.parent.postMessage({ type: 'READY_FOR_USER_DATA' }, '*');
      } catch (e) {
        console.warn('Could not send ready message to parent:', e);
      }
    }
    
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
    
    // Initialize iframe injection
    setupIframeAutoInjection();
    
    // Initialize postMessage listener
    setupPostMessageListener();
    
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
    
    // Make user data available to the window
    window.getUserData = function() {
      return {
        email: email || localStorage.getItem('userEmail') || '',
        uid: userId || localStorage.getItem('userId') || '',
        company: company || localStorage.getItem('companyName') || ''
      };
    };
    
    console.log('User data extractor initialized successfully');
    
  } catch (err) {
    console.error('Error in user-data-extractor:', err);
  }
})();
