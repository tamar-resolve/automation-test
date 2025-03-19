
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

