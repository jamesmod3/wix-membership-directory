console.log('[Login Redirect] Script loaded, logging in 3 seconds...');
setTimeout(() => {
  console.log('[Login Redirect] 3 seconds have passed');
  document.title = '[LOGIN REDIRECT ACTIVE] ' + document.title;
}, 3000);
