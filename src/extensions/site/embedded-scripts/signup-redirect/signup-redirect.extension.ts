import { extensions } from '@wix/astro/builders';

export default extensions.embeddedScript({
  id: '8249340d-6a4c-4c36-8369-53b1b71d5981',
  name: 'Sign-up Redirect',
  placement: 'BODY_END',
  scriptType: 'ESSENTIAL',
  source: './extensions/site/embedded-scripts/signup-redirect/signup-redirect.html',
});
