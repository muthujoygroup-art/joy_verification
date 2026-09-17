/**
 * Helper to convert various YouTube URL formats to embeddable URLs.
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export const getYouTubeEmbedUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  // Already embed URL
  if (trimmed.includes('youtube.com/embed/') || trimmed.includes('youtube-nocookie.com/embed/')) {
    const parts = trimmed.split('/embed/');
    const id = parts[1]?.split('?')[0]?.split('&')[0];
    return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&rel=0` : trimmed;
  }

  // Short URL format: https://youtu.be/ID
  if (trimmed.includes('youtu.be/')) {
    const parts = trimmed.split('youtu.be/');
    const id = parts[1]?.split('?')[0]?.split('&')[0];
    return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&rel=0` : '';
  }

  // Standard URL format: https://www.youtube.com/watch?v=ID
  if (trimmed.includes('youtube.com/watch')) {
    try {
      const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
      const v = parsed.searchParams.get('v');
      return v ? `https://www.youtube-nocookie.com/embed/${v}?autoplay=0&rel=0` : '';
    } catch {
      return '';
    }
  }

  // Shorts format: https://www.youtube.com/shorts/ID
  if (trimmed.includes('youtube.com/shorts/')) {
    const parts = trimmed.split('youtube.com/shorts/');
    const id = parts[1]?.split('?')[0]?.split('&')[0];
    return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&rel=0` : '';
  }

  return '';
};
