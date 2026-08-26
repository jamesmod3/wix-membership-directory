export type PhotoValue = string | { url?: string; id?: string } | undefined | null;

const WIX_IMAGE_CDN = 'https://static.wixstatic.com/media/';
const WIX_IMAGE_URI = /^(?:wix:)?image:\/\/v1\/([^/#]+)/;

function toCdnUrl(value: string): string {
  const match = value.match(WIX_IMAGE_URI);
  return match ? `${WIX_IMAGE_CDN}${match[1]}` : value;
}

export function resolveMediaUrl(value: unknown): string | undefined {
  if (!value) return undefined;

  if (typeof value === 'string') {
    const url = value.trim();
    return url ? toCdnUrl(url) : undefined;
  }

  if (typeof value === 'object') {
    const obj = value as { url?: unknown; id?: unknown };
    if (typeof obj.url === 'string' && obj.url.trim()) return obj.url.trim();
    if (typeof obj.id === 'string' && obj.id.trim()) return toCdnUrl(obj.id);
  }

  return undefined;
}
