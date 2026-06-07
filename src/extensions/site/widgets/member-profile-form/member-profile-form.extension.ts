import { extensions } from '@wix/astro/builders';

export default extensions.customElement({
  id: '7d0cc6a7-4383-4729-9695-452693cdd4d8',
  name: 'Member Profile Form',
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
      id: 'ddd0307f-777d-40c9-a5cb-8f21ce769a14',
      name: 'default',
      thumbnailUrl: '{{BASE_URL}}/member-profile-form-thumbnail.png',
    },
  ],
  
  tagName: 'member-profile-form',
  element: './extensions/site/widgets/member-profile-form/member-profile-form.tsx',
  settings: './extensions/site/widgets/member-profile-form/member-profile-form.panel.tsx',
});
