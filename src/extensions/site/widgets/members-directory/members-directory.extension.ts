import { extensions } from '@wix/astro/builders';

export default extensions.customElement({
  id: 'b61ecbc4-a3b8-4a92-aa5b-7350675ad023',
  name: 'Members Directory',
  width: {
    defaultWidth: 450,
    allowStretch: true
  },
  height: {
    defaultHeight: 250
  },
  installation: {
    autoAdd: false
  },
  presets: [
    {
      id: '59128e73-61ff-4691-ab6a-da734cb1e437',
      name: 'default',
      thumbnailUrl: '{{BASE_URL}}/members-directory-thumbnail.png',
    },
  ],
  
  tagName: 'members-directory',
  element: './extensions/site/widgets/members-directory/members-directory.tsx',
  settings: './extensions/site/widgets/members-directory/members-directory.panel.tsx',
});
