import { app } from '@wix/astro/builders';
import myPage from './extensions/dashboard/pages/my-page/my-page.extension.ts';

import dataCollections from './extensions/backend/data-collections/data-collections.extension.ts';

import memberProfileForm from './extensions/site/widgets/member-profile-form/member-profile-form.extension.ts';

import signupRedirect from './extensions/site/embedded-scripts/signup-redirect/signup-redirect.extension.ts';

export default app()
  .use(myPage).use(dataCollections).use(memberProfileForm).use(signupRedirect);
