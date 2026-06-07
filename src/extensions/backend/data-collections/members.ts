import type { DataCollection } from '@wix/astro/builders';

export const collectionIdSuffix = 'members';

export default {
  idSuffix: collectionIdSuffix,
  displayName: 'Members',
  displayField: 'name',
  fields: [
    { key: 'memberId', displayName: 'Member ID', type: 'TEXT' },
    { key: 'name', displayName: 'Full Name', type: 'TEXT' },
    { key: 'title', displayName: 'Title / Role', type: 'TEXT' },
    { key: 'bio', displayName: 'Biography', type: 'TEXT' },
    { key: 'photo', displayName: 'Photo URL', type: 'TEXT' },
    { key: 'email', displayName: 'Email', type: 'TEXT' },
    { key: 'phone', displayName: 'Phone', type: 'TEXT' },
    { key: 'website', displayName: 'Website', type: 'URL' },
    { key: 'socialLinks', displayName: 'Social Links', type: 'TEXT' },
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
