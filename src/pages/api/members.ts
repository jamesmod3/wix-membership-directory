import type { APIRoute } from 'astro';
import { items } from '@wix/data';
import { auth } from '@wix/essentials';

const COLLECTION_ID = '@jameslaymusic/membership-directory/members';

const elevatedItems = auth.elevate(items);

export const GET: APIRoute = async () => {
  try {
    const result = await elevatedItems.query(COLLECTION_ID)
      .descending('_createdDate')
      .find();

    return new Response(JSON.stringify({ items: result.items }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('GET /api/members error:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Failed to fetch members',
      details: error.details || {},
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { _id, ...data } = body;

    if (!_id) {
      return new Response(JSON.stringify({ error: '_id is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await elevatedItems.update(COLLECTION_ID, { _id, ...data });

    return new Response(JSON.stringify({ item: result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('PUT /api/members error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to update member' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'id query param is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await elevatedItems.remove(COLLECTION_ID, id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('DELETE /api/members error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to delete member' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
