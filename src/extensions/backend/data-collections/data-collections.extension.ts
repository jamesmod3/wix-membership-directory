import { extensions } from '@wix/astro/builders';

import membersCollection from './members';

export default extensions.dataCollections({
  id: 'cb194447-bb36-4311-9f1b-4c63749cc5b5',
  name: 'Data Collections',
  collections: [membersCollection],
});
