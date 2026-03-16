const STOPWORDS = new Set([
  'a','an','the','is','it','in','on','of','to','and','or','for',
  'with','that','this','what','how','do','i','my','me','can','be',
  'are','was','will','have','has','at','by','from','about','which'
]);

export function preprocess(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(' ')
    .filter(word => word.length > 0 && !STOPWORDS.has(word))
    .join(' ')
    .trim();
}