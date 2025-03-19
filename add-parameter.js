// user-data-extractor.js
(function() {
    try {
      // Parse URL parameters from the hash portion (for SPAs using hash router)
      const hashParams = new URLSearchParams(window.location.hash.replace('#/?', ''));
      const urlParams = new URLSearchParams(window.location.search);
      
      // Get user data from URL parameters
      const email = hashParams.get('email') || urlParams.get('email') || '';
      const company = hashParams.get('company') || urlParams.get('company') || '';
      const userId = hashParams.get('uid') || urlParams.get('uid') || '';
      
      // Store in localStorage if values exist
      if (email) localStorage.setItem('userEmail', email);
      if (company) localStorage.setItem('companyName', company);
      if (userId) localStorage.setItem('userId', userId);
      
      console.log('User data from URL stored in localStorage:', { email, company, userId });
    } catch (err) {
      console.error('Error processing URL parameters:', err);
    }
  })();