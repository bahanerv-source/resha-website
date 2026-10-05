import type { SearchIndex } from './catalog';

/** Arabic-friendly normalisation: strips diacritics/tatweel and unifies letter forms. */
export function norm(s: string) {
  return s
    .toLowerCase()
    .replace(/[ً-ٰٟـ]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Light stemming so singular/plural meet: شهادة/شهادات → شهاد, ميدالية/ميداليات → ميدالي. */
const stem = (w: string) => (w.length > 4 ? w.replace(/(ات|ين|ون|ان|ه)$/, '') : w.replace(/ه$/, ''));

/** Every word of the query must appear (prefix match on a word, or inside a word for 3+ letters). */
function matches(hay: string, terms: string[]) {
  const words = hay.split(' ');
  return terms.every((t) => {
    const bare = stem(t.replace(/^ال/, ''));
    return words.some((w) => {
      const wb = stem(w.replace(/^ال/, ''));
      return w.startsWith(t) || wb.startsWith(bare) || (bare.length >= 3 && wb.includes(bare));
    });
  });
}

export function runSearch(index: SearchIndex, q: string) {
  const terms = norm(q).split(' ').filter(Boolean);
  if (!terms.length) return { categories: [], products: [] };
  const score = (name: string) => (norm(name).startsWith(terms[0]) ? 0 : 1);
  return {
    categories: index.categories.filter((c) => matches(norm(c.words), terms)),
    products: index.products
      .filter((p) => matches(norm(p.words), terms))
      .sort((a, b) => score(a.name) - score(b.name)),
  };
}

let cache: Promise<SearchIndex> | null = null;
export function loadIndex() {
  if (!cache) cache = fetch('/search-index.json').then((r) => r.json());
  return cache;
}

/** Popular searches shown before typing. */
export const SUGGESTIONS = ['درع', 'ميدالية', 'هدية معلم', 'تخرج', 'شهادة تقدير', 'علاقة مفاتيح', 'أكريليك'];
