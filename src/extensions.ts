import { app } from '@wix/astro/builders';
import myPage from './extensions/dashboard/pages/my-page/my-page.extension.ts';

import memberProfileForm from './extensions/site/widgets/member-profile-form/member-profile-form.extension.ts';

export default app()
  .use(myPage).use(memberProfileForm);
