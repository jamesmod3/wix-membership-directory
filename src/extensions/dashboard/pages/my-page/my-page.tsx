import type { FC } from 'react';
import {
  Page,
  WixDesignSystemProvider,
  Box,
  Text,
  Card,
  Button,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';

const COLLECTION_ID = '@jameslaymusic/membership-directory/members';
const CMS_URL = `https://manage.wix.com/dashboard/1a1f2b44-82ff-4519-a4c7-4aebc8c5963f/wix-cms/data/${encodeURIComponent(COLLECTION_ID)}`;

const DashboardPage: FC = () => {
  return (
    <WixDesignSystemProvider>
      <Page>
        <Page.Header
          title="Members Directory"
          subtitle="Manage member profiles submitted through the site form"
        />
        <Page.Content>
          <Card>
            <Card.Content>
              <Box direction="vertical" gap="SP3" padding="SP4">
                <Text weight="normal" size="medium">
                  Member profiles are stored in the CMS collection
                </Text>
                <Text size="small" secondary>
                  Manage member profiles (publish, unpublish, edit, delete) in the
                  Wix Content Manager.
                </Text>
                <Box gap="SP2">
                  <Button onClick={() => window.open(CMS_URL, '_blank')}>
                    Open in Content Manager
                  </Button>
                </Box>
              </Box>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content>
              <Box direction="vertical" gap="SP2" padding="SP4">
                <Text weight="normal" size="medium">Setup Checklist</Text>
                <Box direction="vertical" gap="SP1">
                  <Text size="small" secondary>
                    ✅ Members CMS collection created
                  </Text>
                  <Text size="small" secondary>
                    ✅ Member Profile Form widget added
                  </Text>
                  <Text size="small" secondary>
                    ☐ Create a members-only page (/membership-directory-profile) and add the widget
                  </Text>
                  <Text size="small" secondary>
                    ☐ Set post-login redirect to /membership-directory-profile
                  </Text>
                  <Text size="small" secondary>
                    ☐ Create a public /members page with a repeater connected to the collection
                  </Text>
                </Box>
              </Box>
            </Card.Content>
          </Card>
        </Page.Content>
      </Page>
    </WixDesignSystemProvider>
  );
};

export default DashboardPage;
