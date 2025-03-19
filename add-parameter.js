
  // Extract user data from URL
  function getHashParams() {
    const hashParams = {};
    const hash = window.location.hash.substr(1);
    const paramString = hash.indexOf('?') >= 0 ? hash.substr(hash.indexOf('?')+1) : '';
    const params = paramString.split('&');
    
    for (let i = 0; i < params.length; i++) {
      if (!params[i]) continue;
      const pair = params[i].split('=');
      if (pair.length < 2) continue;
      hashParams[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return hashParams;
  }
  
  // Store parameters in a global variable for React to access
  window.userDataFromUrl = getHashParams();
  console.log('URL parameters extracted before React loads:', window.userDataFromUrl);
  
  // Immediately store in localStorage
  try {
    if (window.userDataFromUrl.email) {
      localStorage.setItem('userEmail', window.userDataFromUrl.email);
      console.log('Email stored in localStorage:', window.userDataFromUrl.email);
    }
    if (window.userDataFromUrl.company) {
      localStorage.setItem('companyName', window.userDataFromUrl.company);
      console.log('Company stored in localStorage:', window.userDataFromUrl.company);
    }
    if (window.userDataFromUrl.uid) {
      localStorage.setItem('userId', window.userDataFromUrl.uid);
      console.log('User ID stored in localStorage:', window.userDataFromUrl.uid);
    }
  } catch (e) {
    console.error('Error storing in localStorage:', e);
  }

// This script should be added to your GitHub Pages site (ideally at the top of your main HTML file)
// Extract and store URL parameters before React loads
(function() {
  // Extract user data from URL hash
  function getHashParams() {
    const hashParams = {};
    const hash = window.location.hash.substr(1);
    const paramString = hash.indexOf('?') >= 0 ? hash.substr(hash.indexOf('?')+1) : '';
    const params = paramString.split('&');
    
    for (let i = 0; i < params.length; i++) {
      if (!params[i]) continue;
      const pair = params[i].split('=');
      if (pair.length < 2) continue;
      hashParams[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return hashParams;
  }
  
  // Store parameters in a global variable and localStorage
  const urlParams = getHashParams();
  window.urlParams = urlParams;
  console.log('URL parameters extracted before React loads:', urlParams);
  
  // Store in localStorage for React to access later
  try {
    if (urlParams.email) {
      localStorage.setItem('userEmail', urlParams.email);
      console.log('Email stored in localStorage:', urlParams.email);
    }
    if (urlParams.company) {
      localStorage.setItem('companyName', urlParams.company);
      console.log('Company stored in localStorage:', urlParams.company);
    }
    if (urlParams.uid) {
      localStorage.setItem('userId', urlParams.uid);
      console.log('User ID stored in localStorage:', urlParams.uid);
    }
  } catch (e) {
    console.error('Error storing in localStorage:', e);
  }
  
  // Function to populate form fields - we'll run this multiple times
  function populateFormFields() {
    console.log('Attempting to populate form fields...');
    
    // Check both localStorage and URL parameters for values
    const email = localStorage.getItem('userEmail') || urlParams.email || '';
    const company = localStorage.getItem('companyName') || urlParams.company || '';
    
    // Target the exact field structure from DownloadSection component
    // Using multiple selectors to maximize chances of finding the fields
    const emailSelectors = [
      'input[name="email"]',
      'input[type="email"]',
      'input.form-control[type="email"]',
      'input[placeholder*="email" i]',
      '[data-testid="email-input"]',
      '.form-group input[type="email"]'
    ];
    
    const companySelectors = [
      'input[name="companyName"]',
      'input[placeholder*="company" i]',
      '[data-testid="company-input"]',
      '.form-group:first-child input',
      'input[type="text"]'
    ];
    
    // Helper to try multiple selectors
    function findElement(selectors) {
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) return element;
      }
      return null;
    }
    
    // Find form fields
    const emailField = findElement(emailSelectors);
    const companyField = findElement(companySelectors);
    
    // Log what we found
    console.log('Form population - Found fields:', {
      emailField: emailField ? emailField.outerHTML.substring(0, 50) + '...' : null,
      companyField: companyField ? companyField.outerHTML.substring(0, 50) + '...' : null,
      email,
      company
    });
    
    // Set fields if found
    if (emailField && email) {
      emailField.value = email;
      
      // Trigger events to notify React
      emailField.dispatchEvent(new Event('input', { bubbles: true }));
      emailField.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Try to target React internals directly
      const reactKey = Object.keys(emailField).find(key => key.startsWith('__reactProps$'));
      if (reactKey && emailField[reactKey].onChange) {
        try {
          const fakeEvent = { target: emailField };
          emailField[reactKey].onChange(fakeEvent);
          console.log('Triggered React onChange handler for email');
        } catch (e) {
          console.error('Error triggering React onChange:', e);
        }
      }
      
      console.log('Email field populated with:', email);
    } else {
      console.log('Email field not found or no email value');
    }
    
    if (companyField && company) {
      companyField.value = company;
      
      // Trigger events to notify React
      companyField.dispatchEvent(new Event('input', { bubbles: true }));
      companyField.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Try to target React internals directly
      const reactKey = Object.keys(companyField).find(key => key.startsWith('__reactProps$'));
      if (reactKey && companyField[reactKey].onChange) {
        try {
          const fakeEvent = { target: companyField };
          companyField[reactKey].onChange(fakeEvent);
          console.log('Triggered React onChange handler for company');
        } catch (e) {
          console.error('Error triggering React onChange:', e);
        }
      }
      
      console.log('Company field populated with:', company);
    } else {
      console.log('Company field not found or no company value');
    }
  }
  
  // Add a MutationObserver to detect when form fields are added to DOM
  function setupMutationObserver() {
    // This will run once the document is ready
    const observer = new MutationObserver(function(mutations) {
      // Check if any new nodes match our target selectors
      let shouldPopulate = false;
      
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            // Check if this is an Element
            if (node.nodeType === 1) {
              // Check if it's a form control or contains one
              if (node.tagName === 'INPUT' || 
                  node.querySelector('input') ||
                  node.classList.contains('form-group') ||
                  node.classList.contains('form-control')) {
                shouldPopulate = true;
                break;
              }
            }
          }
        }
      });
      
      if (shouldPopulate) {
        console.log('New form fields detected in DOM, attempting to populate');
        populateFormFields();
      }
    });
    
    // Start observing the entire document
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
    
    console.log('MutationObserver set up to watch for form fields');
  }
  
  // Schedule population attempts with increasing delays
  // This covers a variety of React rendering scenarios
  const populationAttempts = [
    0,      // Immediate attempt
    100,    // After 100ms
    500,    // After 500ms
    1000,   // After 1 second
    2000,   // After 2 seconds
    5000    // After 5 seconds
  ];
  
  // Schedule our attempts
  populationAttempts.forEach(delay => {
    setTimeout(populateFormFields, delay);
  });
  
  // Set up the MutationObserver once the document is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMutationObserver);
  } else {
    setupMutationObserver();
  }
  
  // Listen for postMessage events from parent frame
  window.addEventListener('message', (event) => {
    // Verify origin for security if needed
    // if (event.origin !== 'https://your-trusted-domain.com') return;
    
    try {
      if (event.data && event.data.type === 'USER_DATA') {
        console.log("Received user data via postMessage:", event.data);
        
        // Store in localStorage
        if (event.data.email) localStorage.setItem('userEmail', event.data.email);
        if (event.data.companyName) localStorage.setItem('companyName', event.data.companyName);
        if (event.data.userId) localStorage.setItem('userId', event.data.userId);
        
        // Try to populate form fields immediately
        populateFormFields();
      }
    } catch (error) {
      console.error("Error processing postMessage data:", error);
    }
  });
})();
