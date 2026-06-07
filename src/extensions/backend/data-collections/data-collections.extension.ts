import { extensions } from '@wix/astro/builders';

import membersCollection from './members';

export default extensions.dataCollections({
  id: '565e4701-5e2d-4234-a3b4-831ab1492fce',
  name: 'Data Collections',
  collections: [membersCollection],
});
