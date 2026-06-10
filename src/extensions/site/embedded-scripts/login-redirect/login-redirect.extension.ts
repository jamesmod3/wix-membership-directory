import { extensions } from '@wix/astro/builders';

export default extensions.embeddedScript({
  id: '3fc67cb3-1edd-471b-bbf2-bf0ee370d2f1',
  name: 'Login Redirect',
  placement: 'BODY_END',
  scriptType: 'ESSENTIAL',
  source: './extensions/site/embedded-scripts/login-redirect/login-redirect.html',
});
