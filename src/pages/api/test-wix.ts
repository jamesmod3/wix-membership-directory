import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    const dataModule = await import('@wix/data');
    const hasItems = typeof dataModule.items === 'object';
    const methods = dataModule.items ? Object.keys(dataModule.items) : [];

    return new Response(JSON.stringify({
      canImport: true,
      hasItems,
      methods,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      canImport: false,
      error: error.message,
      stack: error.stack?.split('\n').slice(0, 5),
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
