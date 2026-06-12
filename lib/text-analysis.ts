export const STOPWORDS = new Set([
  "the", "a", "an", "is", "in", "of", "to", "and", "for", "it", "that", "this", "was", "with", "on", "at", "be", "as", "by", "from", "or", "but", "not", "are", "have", "had", "has", "he", "she", "they", "we", "you", "i", "his", "her", "its", "their", "our", "which", "who", "will", "would", "can", "could", "do", "did", "does", "been", "more", "also", "than", "then", "when", "where", "how", "all", "some", "if", "so", "up", "out", "about", "into", "over", "after", "between", "through", "during", "before", "while", "no", "yes", "just", "now", "only", "even", "back", "get", "use", "may"
]);

export function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function countSentences(text: string) {
  if (!text.trim()) return 0;
  return (text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? []).length;
}

export function countParagraphs(text: string) {
  return text.trim() ? text.split(/\n+/).filter((item) => item.trim()).length : 0;
}

export function countSyllables(word: string): number {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!cleaned) return 0;
  if (cleaned.length <= 3) return 1;

  const vowels = "aeiouy";
  let count = 0;
  let prevVowel = false;

  for (let i = 0; i < cleaned.length; i++) {
    const isVowel = vowels.includes(cleaned[i]);
    if (isVowel && !prevVowel) count++;
    prevVowel = isVowel;
  }

  if (cleaned.endsWith("e") && count > 1 && !cleaned.endsWith("le")) count--;
  if (cleaned.endsWith("le") && cleaned.length > 2 && !vowels.includes(cleaned[cleaned.length - 3])) count++;

  return Math.max(1, count);
}

export function totalSyllables(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.reduce((sum, word) => sum + countSyllables(word), 0);
}

export function polysyllableCount(text: string) {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .filter((word) => countSyllables(word) >= 3).length;
}

export function complexWordCount(text: string) {
  return polysyllableCount(text);
}

export function keywordFrequency(text: string, limit = 10) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));

  const freq = new Map<string, number>();
  for (const word of words) {
    freq.set(word, (freq.get(word) ?? 0) + 1);
  }

  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

export function secureRandomInt(min: number, max: number) {
  const range = max - min + 1;
  if (range <= 0) return min;
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return min + (array[0] % range);
}

export function secureRandomFloat() {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] / (0xffffffff + 1);
}
