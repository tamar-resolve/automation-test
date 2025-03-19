
// Auto-fill form script with extensive logging
(function() {
  console.log('==========================================');
  console.log('AUTO-FILL SCRIPT STARTING - ' + new Date().toISOString());
  console.log('Current URL:', window.location.href);
  console.log('Current hash:', window.location.hash);
  
  // Parse URL parameters from hash
  function getUrlParams() {
    const hash = window.location.hash || '';
    console.log('Processing hash string:', hash);
    
    const paramString = hash.includes('?') ? hash.substring(hash.indexOf('?') + 1) : '';
    console.log('Extracted parameter string:', paramString);
    
    const searchParams = new URLSearchParams(paramString);
    
    const params = {
      email: searchParams.get('email') || '',
      company: searchParams.get('company') || '',
      uid: searchParams.get('uid') || ''
    };
    
    console.log('Parsed URL parameters:', JSON.stringify(params));
    return params;
  }
  
  // Get parameters
  const params = getUrlParams();
  
  // Store in localStorage for backup
  try {
    console.log('Attempting to store parameters in localStorage');
    
    if (params.email) {
      localStorage.setItem('userEmail', params.email);
      console.log('Stored email in localStorage:', params.email);
    } else {
      console.log('No email to store in localStorage');
    }
    
    if (params.company) {
      localStorage.setItem('companyName', params.company);
      console.log('Stored company in localStorage:', params.company);
    } else {
      console.log('No company to store in localStorage');
    }
    
    if (params.uid) {
      localStorage.setItem('userId', params.uid);
      console.log('Stored userId in localStorage:', params.uid);
    } else {
      console.log('No userId to store in localStorage');
    }
    
    // Also check if we can retrieve from localStorage
    console.log('Verification - Reading from localStorage:');
    console.log('- userEmail:', localStorage.getItem('userEmail'));
    console.log('- companyName:', localStorage.getItem('companyName'));
    console.log('- userId:', localStorage.getItem('userId'));
  } catch (e) {
    console.error('Error accessing localStorage:', e);
  }
  
  // Function to populate form fields - using exact selectors from your HTML
  function populateFormFields(attempt) {
    console.log(`--- ATTEMPT ${attempt} to populate form fields ---`);
    
    // Check if DOM is ready
    console.log('Document readyState:', document.readyState);
    console.log('Body exists:', !!document.body);
    
    // Log all inputs in the document
    const allInputs = document.querySelectorAll('input');
    console.log(`Found ${allInputs.length} total input elements`);
    
    if (allInputs.length > 0) {
      console.log('All input elements:');
      allInputs.forEach((input, i) => {
        console.log(`Input #${i+1}:`);
        console.log('  type:', input.type);
        console.log('  name:', input.name);
        console.log('  placeholder:', input.placeholder);
        console.log('  value:', input.value);
        console.log('  className:', input.className);
      });
    }
    
    // Target EXACT selectors for your form fields
    console.log('Searching for email field...');
    let emailField = document.querySelector('input[name="email"][type="email"][placeholder="Enter your email address"]');
    
    console.log('Searching for company field...');
    let companyField = document.querySelector('input[name="companyName"][type="text"][placeholder="Enter your company name"]');
    
    // Alternative selectors if exact match fails
    if (!emailField) {
      console.log('Exact email selector failed, trying alternatives...');
      emailField = document.querySelector('input[name="email"]') ||
                  document.querySelector('input[type="email"]') ||
                  document.querySelector('input[placeholder*="email" i]');
    }
    
    if (!companyField) {
      console.log('Exact company selector failed, trying alternatives...');
      companyField = document.querySelector('input[name="companyName"]') ||
                     document.querySelector('input[placeholder*="company" i]');
    }
    
    console.log('Form fields found:', {
      emailField: emailField ? {
        type: emailField.type,
        name: emailField.name,
        placeholder: emailField.placeholder,
        value: emailField.value
      } : null,
      companyField: companyField ? {
        type: companyField.type,
        name: companyField.name,
        placeholder: companyField.placeholder,
        value: companyField.value
      } : null
    });
    
    // If we couldn't find fields and we're running in an iframe, try to find the iframe content
    if ((!emailField || !companyField) && window.frameElement) {
      console.log('Running in iframe, attempting to navigate iframe DOM');
      try {
        // Try to get iframe's document
        const frameDoc = window.frameElement.contentDocument || window.frameElement.contentWindow.document;
        console.log('Found iframe document:', !!frameDoc);
        
        if (frameDoc) {
          if (!emailField) {
            emailField = frameDoc.querySelector('input[name="email"]');
            console.log('Email field from iframe:', !!emailField);
          }
          
          if (!companyField) {
            companyField = frameDoc.querySelector('input[name="companyName"]');
            console.log('Company field from iframe:', !!companyField);
          }
        }
      } catch (e) {
        console.error('Error accessing iframe content:', e);
      }
    }
    
    // Get data from multiple sources (URL params first, localStorage as fallback)
    const emailValue = params.email || localStorage.getItem('userEmail') || '';
    const companyValue = params.company || localStorage.getItem('companyName') || '';
    
    console.log('Values to populate:');
    console.log('- Email:', emailValue);
    console.log('- Company:', companyValue);
    
    // Populate email field if found
    if (emailField && emailValue) {
      console.log('Setting email field value to:', emailValue);
      
      // Store original value to check if it changed
      const originalValue = emailField.value;
      
      // Set value
      emailField.value = emailValue;
      
      // Log if value was set
      console.log('Email field value after setting:', emailField.value);
      console.log('Value changed?', originalValue !== emailField.value);
      
      // Trigger events
      console.log('Dispatching input event for email field');
      emailField.dispatchEvent(new Event('input', { bubbles: true }));
      
      console.log('Dispatching change event for email field');
      emailField.dispatchEvent(new Event('change', { bubbles: true }));
      
      console.log('Dispatching blur event for email field');
      emailField.dispatchEvent(new Event('blur', { bubbles: true }));
      
      // Set background color
      console.log('Setting email field background color');
      emailField.style.backgroundColor = 'rgb(240, 255, 255)';
      
      console.log('Email field population complete');
    } else {
      console.log('Could not populate email field:', !emailField ? 'field not found' : 'no value to set');
    }
    
    // Populate company field if found
    if (companyField && companyValue) {
      console.log('Setting company field value to:', companyValue);
      
      // Store original value to check if it changed
      const originalValue = companyField.value;
      
      // Set value
      companyField.value = companyValue;
      
      // Log if value was set
      console.log('Company field value after setting:', companyField.value);
      console.log('Value changed?', originalValue !== companyField.value);
      
      // Trigger events
      console.log('Dispatching input event for company field');
      companyField.dispatchEvent(new Event('input', { bubbles: true }));
      
      console.log('Dispatching change event for company field');
      companyField.dispatchEvent(new Event('change', { bubbles: true }));
      
      console.log('Dispatching blur event for company field');
      companyField.dispatchEvent(new Event('blur', { bubbles: true }));
      
      // Set background color
      console.log('Setting company field background color');
      companyField.style.backgroundColor = 'rgb(240, 255, 255)';
      
      console.log('Company field population complete');
    } else {
      console.log('Could not populate company field:', !companyField ? 'field not found' : 'no value to set');
    }
    
    console.log(`--- END ATTEMPT ${attempt} ---`);
  }
  
  // Try with multiple delays to catch the form after it's rendered
  const attempts = [100, 500, 1000, 2000, 3000, 5000];
  
  console.log(`Scheduling ${attempts.length} attempts to populate fields`);
  attempts.forEach((delay, index) => {
    console.log(`Scheduled attempt ${index+1} after ${delay}ms`);
    setTimeout(() => populateFormFields(index + 1), delay);
  });
  
  // Also try when user interacts with page
  let hasInteracted = false;
  function onInteraction(event) {
    console.log(`User interaction detected: ${event.type}`);
    
    if (!hasInteracted) {
      hasInteracted = true;
      console.log('First user interaction, attempting to populate fields');
      
      populateFormFields('user-interaction');
      
      // Remove all event listeners
      console.log('Removing interaction event listeners');
      ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event => {
        document.removeEventListener(event, onInteraction);
      });
    }
  }
  
  // Add interaction listeners
  console.log('Adding user interaction event listeners');
  ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, onInteraction);
    console.log(`Added listener for ${event} events`);
  });
  
  console.log('AUTO-FILL SCRIPT INITIALIZATION COMPLETE');
  console.log('==========================================');
})();
