import type { FC } from 'react';
import { useState, useEffect, useCallback } from 'react';
import {
  Page,
  WixDesignSystemProvider,
  Table,
  TableToolbar,
  Button,
  Box,
  Text,
  Card,
  Loader,
  EmptyState,
  TextButton,
  Badge,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import { items } from '@wix/data';
import { auth } from '@wix/essentials';

const COLLECTION_ID = '@jameslaymusic/membership-directory/members';

interface MemberItem {
  _id: string;
  _createdDate?: string;
  memberId?: string;
  name?: string;
  title?: string;
  bio?: string;
  photo?: string;
  email?: string;
  phone?: string;
  website?: string;
  socialLinks?: string;
  joinDate?: string;
  published?: boolean;
}

const DashboardPage: FC = () => {
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await items.query(COLLECTION_ID)
        .descending('_createdDate')
        .find();
      setMembers(result.items as MemberItem[]);
    } catch (err: any) {
      console.error('Failed to fetch members:', err);
      const details = err.details || {};
      const msg = err.message || 'Unknown error';
      setError(`${msg}${details.applicationError ? ` (code: ${details.applicationError.code})` : ''}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleTogglePublish = async (item: MemberItem) => {
    setTogglingId(item._id);
    try {
      const elevatedUpdate = auth.elevate(items.update);
      await elevatedUpdate(COLLECTION_ID, { _id: item._id, published: !item.published });
      setMembers(prev => prev.map(m => m._id === item._id ? { ...m, published: !m.published } : m));
    } catch (err) {
      console.error('Failed to toggle publish:', err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (itemId: string) => {
    setDeletingId(itemId);
    try {
      const elevatedRemove = auth.elevate(items.remove);
      await elevatedRemove(COLLECTION_ID, itemId);
      setMembers(prev => prev.filter(m => m._id !== itemId));
    } catch (err) {
      console.error('Failed to delete member:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const columns = [
    {
      title: 'Name',
      render: (row: MemberItem) => (
        <Box verticalAlign="middle" gap="8px">
          <Box direction="vertical">
            <Text weight="normal" size="medium">{row.name || 'Unnamed'}</Text>
            {row.email && <Text size="small" secondary>{row.email}</Text>}
          </Box>
        </Box>
      ),
      width: '200px',
    },
    {
      title: 'Title',
      render: (row: MemberItem) => <Text size="small">{row.title || '-'}</Text>,
      width: '150px',
    },
    {
      title: 'Joined',
      render: (row: MemberItem) => (
        <Text size="small">{row.joinDate || row._createdDate?.split('T')[0] || '-'}</Text>
      ),
      width: '120px',
    },
    {
      title: 'Status',
      render: (row: MemberItem) => (
        row.published
          ? <Badge skin="success">Published</Badge>
          : <Badge skin="warning">Draft</Badge>
      ),
      width: '100px',
    },
    {
      title: 'Actions',
      render: (row: MemberItem) => (
        <Box gap="8px">
          <TextButton
            size="tiny"
            disabled={togglingId === row._id}
            onClick={() => handleTogglePublish(row)}
          >
            {togglingId === row._id ? '...' : row.published ? 'Unpublish' : 'Publish'}
          </TextButton>
          <TextButton
            size="tiny"
            skin="destructive"
            disabled={deletingId === row._id}
            onClick={() => handleDelete(row._id)}
          >
            {deletingId === row._id ? '...' : 'Delete'}
          </TextButton>
        </Box>
      ),
      width: '150px',
    },
  ];

  return (
    <WixDesignSystemProvider>
      <Page>
        <Page.Header
          title="Members Directory"
          subtitle="Manage member profiles submitted through the site form"
        />
        <Page.Content>
          {loading ? (
            <Box align="center" padding="40px">
              <Loader text="Loading members..." />
            </Box>
          ) : error ? (
            <Card>
              <Card.Content>
                <EmptyState
                  title="Something went wrong"
                  subtitle={error}
                  skin="page"
                >
                  <Button onClick={fetchMembers}>Retry</Button>
                </EmptyState>
              </Card.Content>
            </Card>
          ) : members.length === 0 ? (
            <Card>
              <Card.Content>
                <EmptyState
                  title="No members yet"
                  subtitle="Member profiles submitted via the site form will appear here."
                  skin="page"
                />
              </Card.Content>
            </Card>
          ) : (
            <Card>
              <Table data={members} columns={columns}>
                <Table.ToolbarContainer>
                  {() => (
                    <TableToolbar>
                      <TableToolbar.ItemGroup position="start">
                        <TableToolbar.Item>
                          <TableToolbar.Label>{members.length} member{members.length !== 1 ? 's' : ''}</TableToolbar.Label>
                        </TableToolbar.Item>
                      </TableToolbar.ItemGroup>
                    </TableToolbar>
                  )}
                </Table.ToolbarContainer>
                <Table.Content />
              </Table>
            </Card>
          )}
        </Page.Content>
      </Page>
    </WixDesignSystemProvider>
  );
};

export default DashboardPage;
