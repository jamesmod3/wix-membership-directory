import React, { type FC, useState, useEffect, useCallback } from 'react';
import { widget } from '@wix/editor';
import {
  SidePanel,
  WixDesignSystemProvider,
  Input,
  FormField,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';

const Panel: FC = () => {
  const [collectionId, setCollectionId] = useState<string>('');

  useEffect(() => {
    widget.getProp('collection-id')
      .then(val => setCollectionId(val || '@jameslaymusic/membership-directory/members'))
      .catch(() => setCollectionId('@jameslaymusic/membership-directory/members'));
  }, []);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    setCollectionId(val);
    widget.setProp('collection-id', val);
  }, []);

  return (
    <WixDesignSystemProvider>
      <SidePanel width="300" height="100vh">
        <SidePanel.Content noPadding stretchVertically>
          <SidePanel.Field>
            <FormField label="Collection ID">
              <Input
                type="text"
                value={collectionId}
                onChange={handleChange}
                aria-label="Collection ID"
              />
            </FormField>
          </SidePanel.Field>
        </SidePanel.Content>
      </SidePanel>
    </WixDesignSystemProvider>
  );
};

export default Panel;
