import { authentication } from '@wix/site';
import { items } from '@wix/data';

const COLLECTION_ID = '@jameslaymusic/membership-directory/members';
const TARGET_URL = '/membership-directory-profile';

async function handleLogin() {
  await new Promise(r => setTimeout(r, 1000));
  try {
    const result = await items.query(COLLECTION_ID).limit(1).find();
    if (result.items.length > 0) return;
  } catch {
    return;
  }
  window.location.href = TARGET_URL;
}

authentication.onLogin(handleLogin);
