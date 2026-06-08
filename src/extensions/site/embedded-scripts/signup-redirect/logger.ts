const REDIRECTED_KEY = 'membership-directory-redirected';

function getConfig() {
  const el = document.getElementById('signup-redirect-config');
  if (!el) throw new Error('Config element not found');
  return el.dataset;
}

function alreadyRedirected(): boolean {
  return sessionStorage.getItem(REDIRECTED_KEY) === 'true';
}

function markRedirected() {
  sessionStorage.setItem(REDIRECTED_KEY, 'true');
}

function detectSignals() {
  const signals: Record<string, any> = {
    url: window.location.href,
    path: window.location.pathname,
    search: window.location.search,
    referrer: document.referrer,
    cookies: document.cookie,
  };

  const lsKeys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    lsKeys.push(localStorage.key(i)!);
  }
  signals.localStorageKeys = lsKeys;

  const ssKeys: string[] = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    ssKeys.push(sessionStorage.key(i)!);
  }
  signals.sessionStorageKeys = ssKeys;

  // Check for common sign-up indicators
  const qp = new URLSearchParams(window.location.search);
  signals.hasSignupParam = qp.has('registration') || qp.has('signUp') || qp.has('memberRegistered') || qp.has('registered');
  signals.signupParamValue = qp.get('registration') || qp.get('signUp') || qp.get('memberRegistered') || qp.get('registered') || null;

  // Check cookies for membership indicators
  signals.hasMemberCookie = document.cookie.includes('wixMembers') || document.cookie.includes('member');

  // Check referrer for sign-up path
  signals.referrerIsSignup = document.referrer.includes('signup') || document.referrer.includes('register') || document.referrer.includes('member');

  // Check URL path for sign-up indicators
  signals.pathIsSignup = window.location.pathname.includes('signup') || window.location.pathname.includes('register');

  return signals;
}

async function main() {
  const config = getConfig();
  const targetUrl = config.targetUrl || '/membership-directory-profile';

  if (alreadyRedirected()) {
    console.log('[Sign-up Redirect] Already redirected this session');
    return;
  }

  const signals = detectSignals();
  console.log('[Sign-up Redirect] Detection signals:', signals);

  // Check for strong sign-up signals
  const hasStrongSignal =
    signals.hasSignupParam ||
    signals.referrerIsSignup ||
    signals.pathIsSignup;

  if (hasStrongSignal && window.location.pathname !== targetUrl) {
    console.log('[Sign-up Redirect] Sign-up detected, redirecting to', targetUrl);
    markRedirected();
    window.location.href = targetUrl;
  } else if (!hasStrongSignal) {
    console.log('[Sign-up Redirect] No sign-up signal detected');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
