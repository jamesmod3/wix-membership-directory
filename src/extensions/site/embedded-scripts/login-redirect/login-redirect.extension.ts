import { extensions } from '@wix/astro/builders';

export default extensions.embeddedScript({
  id: 'e71ba26b-21d2-4a5b-9e1a-b80b7291040a',
  name: 'Login Redirect',
  placement: 'BODY_END',
  scriptType: 'ESSENTIAL',
  source: './extensions/site/embedded-scripts/login-redirect/login-redirect.html',
});
