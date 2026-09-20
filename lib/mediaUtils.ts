/**
 * Media utilities for KOUKOU Chocolatería:
 * - Transforms Google Drive share links into ultra-fast direct CDN links (lh3.googleusercontent.com)
 * - Identifies and handles direct videos (.mp4, .webm, .mov)
 * - Identifies and embeds YouTube and Vimeo links
 */

export function transformMediaUrl(rawUrl?: string | null): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const url = rawUrl.trim();

  // 1. Google Drive URLs
  // Patterns:
  // https://drive.google.com/file/d/FILE_ID/view...
  // https://drive.google.com/open?id=FILE_ID
  // https://drive.google.com/uc?id=FILE_ID
  const driveFileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  const driveIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  const fileId = driveFileMatch ? driveFileMatch[1] : driveIdMatch ? driveIdMatch[1] : null;

  if (fileId && (url.includes('drive.google.com') || url.includes('docs.google.com'))) {
    // lh3.googleusercontent.com serves high-speed CDN images from Drive file IDs directly
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  // 2. YouTube URLs -> Embed format if needed
  if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
    const ytMatch = url.match(/(?:watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}&controls=0`;
    }
  }

  // 3. Dropbox links -> direct raw=1
  if (url.includes('dropbox.com') && !url.includes('raw=1')) {
    return url.replace('dl=0', 'raw=1').replace('?dl=1', '?raw=1');
  }

  return url;
}

export function isVideoUrl(rawUrl?: string | null): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const lower = rawUrl.toLowerCase().trim();

  return (
    lower.endsWith('.mp4') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.ogg') ||
    lower.endsWith('.mov') ||
    lower.includes('.mp4?') ||
    lower.includes('youtube.com') ||
    lower.includes('youtu.be') ||
    lower.includes('vimeo.com')
  );
}

export function isYoutubeOrVimeo(rawUrl?: string | null): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const lower = rawUrl.toLowerCase().trim();
  return lower.includes('youtube.com') || lower.includes('youtu.be') || lower.includes('vimeo.com');
}
