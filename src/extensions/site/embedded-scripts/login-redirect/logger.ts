import { authentication } from '@wix/site';
import { items } from '@wix/data';

const COLLECTION_ID = '@jameslaymusic/membership-directory/members';
const TARGET_URL = '/membership-directory-profile';

console.log('[Login Redirect] Script loaded');

async function handleLogin() {
  console.log('[Login Redirect] onLogin fired');
  await new Promise(r => setTimeout(r, 1000));
  console.log('[Login Redirect] Checking for existing profile...');
  try {
    const result = await items.query(COLLECTION_ID).limit(1).find();
    console.log('[Login Redirect] Query result:', result.items.length, 'items');
    if (result.items.length > 0) {
      console.log('[Login Redirect] Profile exists, skipping redirect');
      return;
    }
    console.log('[Login Redirect] No profile found, redirecting to', TARGET_URL);
    window.location.href = TARGET_URL;
  } catch (err: any) {
    console.log('[Login Redirect] Query failed:', err.message);
  }
}

authentication.onLogin(() => {
  console.log('[Login Redirect] onLogin callback invoked');
  handleLogin();
});
