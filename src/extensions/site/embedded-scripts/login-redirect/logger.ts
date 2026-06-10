import { authentication } from '@wix/site';

const TARGET_URL = '/membership-directory-profile';
const REDIRECTED_KEY = 'membership-directory-redirected';

function alreadyRedirected(): boolean {
  return sessionStorage.getItem(REDIRECTED_KEY) === 'true';
}

function markRedirected() {
  sessionStorage.setItem(REDIRECTED_KEY, 'true');
}

authentication.onLogin(() => {
  if (alreadyRedirected()) return;
  if (window.location.pathname === TARGET_URL) return;
  markRedirected();
  window.location.href = TARGET_URL;
});
