import type { DataCollection } from '@wix/astro/builders';

export const collectionIdSuffix = 'members';

export default {
  idSuffix: collectionIdSuffix,
  displayName: 'Members',
  displayField: 'listingTitle',
  fields: [
    { key: 'memberId', displayName: 'Member ID', type: 'TEXT' },
    { key: 'planType', displayName: 'Plan Type', type: 'TEXT' },
    { key: 'organizationName', displayName: 'Organization Name', type: 'TEXT' },
    { key: 'name', displayName: 'Contact First Name', type: 'TEXT' },
    { key: 'lastName', displayName: 'Contact Last Name', type: 'TEXT' },
    { key: 'pronouns', displayName: 'Pronouns', type: 'TEXT' },
    { key: 'email', displayName: 'Email', type: 'TEXT' },
    { key: 'phone', displayName: 'Phone', type: 'TEXT' },
    { key: 'address', displayName: 'Address', type: 'TEXT' },
    { key: 'categories', displayName: 'Categories', type: 'TEXT' },
    { key: 'listingTitle', displayName: 'Listing Title', type: 'TEXT' },
    { key: 'bio', displayName: 'Description / Bio', type: 'TEXT' },
    { key: 'website', displayName: 'Website', type: 'URL' },
    { key: 'facebook', displayName: 'Facebook', type: 'URL' },
    { key: 'instagram', displayName: 'Instagram', type: 'URL' },
    { key: 'linkedin', displayName: 'LinkedIn', type: 'URL' },
    { key: 'photo', displayName: 'Image URL', type: 'TEXT' },
    { key: 'joinDate', displayName: 'Join Date', type: 'DATE' },
    { key: 'published', displayName: 'Published', type: 'BOOLEAN' },
  ],
  dataPermissions: {
    itemRead: 'ANYONE',
    itemInsert: 'SITE_MEMBER_AUTHOR',
    itemUpdate: 'SITE_MEMBER_AUTHOR',
    itemRemove: 'PRIVILEGED',
  },
  indexes: [
    { fields: [{ path: 'email' }], unique: true },
    { fields: [{ path: 'memberId' }], unique: true },
  ],
  initialData: [],
} satisfies DataCollection;
