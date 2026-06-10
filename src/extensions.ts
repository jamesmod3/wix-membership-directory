import { app } from '@wix/astro/builders';
import myPage from './extensions/dashboard/pages/my-page/my-page.extension.ts';

import memberProfileForm from './extensions/site/widgets/member-profile-form/member-profile-form.extension.ts';

import dataCollections from './extensions/backend/data-collections/data-collections.extension.ts';

import loginRedirect from './extensions/site/embedded-scripts/login-redirect/login-redirect.extension.ts';

export default app()
  .use(myPage).use(memberProfileForm).use(dataCollections).use(loginRedirect);
