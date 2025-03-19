// This script goes in your GitHub Pages app (the first iframe)
(function() {
  console.log('Nested iframe handler starting...');
  
  // Extract parameters from our own URL
  function getUrlParams() {
    const hash = window.location.hash || '';
    const paramString = hash.includes('?') ? hash.substring(hash.indexOf('?') + 1) : '';
    const searchParams = new URLSearchParams(paramString);
    
    return {
      email: searchParams.get('email') || '',
      company: searchParams.get('company') || '',
      uid: searchParams.get('uid') || ''
    };
  }
  
  // Get our parameters
  const params = getUrlParams();
  console.log('Parameters received by GitHub Pages app:', params);
  
  // Function to pass parameters to inner iframe
  function updateInnerIframe() {
    // Find all iframes
    const iframes = document.querySelectorAll('iframe');
    console.log(`Found ${iframes.length} iframes on the page`);
    
    // Try to update each iframe's src to include our parameters
    iframes.forEach((iframe, index) => {
      try {
        console.log(`Processing iframe #${index+1}:`, iframe.src);
        
        // Get current src
        let src = iframe.src;
        
        // Check if this iframe already has our parameters
        if (src.includes('email=') && params.email) {
          console.log('Iframe already has parameters, skipping');
          return;
        }
        
        // Prepare to add parameters
        const separator = src.includes('?') ? '&' : '?';
        
        // Build parameter string
        let paramString = '';
        if (params.email) paramString += `email=${encodeURIComponent(params.email)}&`;
        if (params.company) paramString += `company=${encodeURIComponent(params.company)}&`;
        if (params.uid) paramString += `uid=${encodeURIComponent(params.uid)}`;
        
        // Remove trailing & if present
        if (paramString.endsWith('&')) {
          paramString = paramString.slice(0, -1);
        }
        
        // Only proceed if we have parameters to add
        if (paramString) {
          // Create new src with parameters
          const newSrc = `${src}${separator}${paramString}`;
          console.log(`Updating iframe src to: ${newSrc}`);
          
          // Update src
          iframe.src = newSrc;
          console.log('Iframe src updated successfully');
        }
      } catch (e) {
        console.error(`Error updating iframe #${index+1}:`, e);
      }
    });
  }
  
  // Wait for iframes to be available, then update them
  function waitForIframes() {
    const iframes = document.querySelectorAll('iframe');
    
    if (iframes.length > 0) {
      console.log('Iframes found, updating their src attributes');
      updateInnerIframe();
    } else {
      console.log('No iframes found yet, waiting...');
      setTimeout(waitForIframes, 1000);
    }
  }
  
  // Start looking for iframes
  waitForIframes();
  
  // Also use a MutationObserver to detect when iframes are added
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if any of the added nodes are iframes
        for (const node of mutation.addedNodes) {
          if (node.tagName === 'IFRAME' || 
              (node.querySelectorAll && node.querySelectorAll('iframe').length > 0)) {
            console.log('New iframe detected, updating parameters');
            updateInnerIframe();
            break;
          }
        }
      }
    }
  });
  
  // Start observing for iframes
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  
  // Also try after various delays
  [2000, 5000, 10000].forEach(delay => {
    setTimeout(updateInnerIframe, delay);
  });
  
  console.log('Nested iframe handler initialization complete');
})();
