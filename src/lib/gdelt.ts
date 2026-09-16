export type Topic = 'Inflation' | 'Trade' | 'Central Banks' | 'Markets';

export interface GdeltArticle {
  url: string;
  title: string;
  seendate: string;
  domain: string;
  sourcecountry?: string;
}

const TOPIC_QUERIES: Record<Topic, string> = {
  Inflation: '(inflation OR "consumer price" OR CPI OR "cost of living")',
  Trade: '(tariff OR "trade deal" OR exports OR imports OR "trade war" OR "supply chain")',
  'Central Banks': '("central bank" OR "Federal Reserve" OR "interest rate" OR ECB OR "Bank of England" OR "Bank of Japan")',
  Markets: '("stock market" OR "wall street" OR equities OR "bond market" OR "treasury yields")',
};

export const TOPICS: Topic[] = ['Inflation', 'Trade', 'Central Banks', 'Markets'];

function parseSeenDate(seendate: string): Date {
  const y = seendate.slice(0, 4);
  const mo = seendate.slice(4, 6);
  const d = seendate.slice(6, 8);
  const h = seendate.slice(9, 11);
  const mi = seendate.slice(11, 13);
  const s = seendate.slice(13, 15);
  return new Date(`${y}-${mo}-${d}T${h}:${mi}:${s}Z`);
}

export function articleDate(a: GdeltArticle): Date {
  return parseSeenDate(a.seendate);
}

async function fetchTopic(topic: Topic): Promise<GdeltArticle[]> {
  const params = new URLSearchParams({
    query: `${TOPIC_QUERIES[topic]} sourcelang:english`,
    mode: 'artlist',
    format: 'json',
    maxrecords: '10',
    sort: 'datedesc',
    timespan: '2d',
  });
  const res = await fetch(`https://api.gdeltproject.org/api/v2/doc/doc?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`GDELT request failed (${res.status}) for topic ${topic}`);
  }
  const text = await res.text();
  const cleaned = text.replace(/[\x00-\x09\x0B-\x1F]/g, '');
  let json: { articles?: GdeltArticle[] };
  try {
    json = JSON.parse(cleaned);
  } catch {
    throw new Error(`GDELT returned an unreadable response for topic ${topic}`);
  }
  return json.articles ?? [];
}

export async function fetchDailyReport(): Promise<Record<Topic, GdeltArticle[]>> {
  const results = await Promise.all(TOPICS.map((t) => fetchTopic(t)));
  const out: Record<Topic, GdeltArticle[]> = {
    Inflation: [],
    Trade: [],
    'Central Banks': [],
    Markets: [],
  };
  TOPICS.forEach((t, i) => {
    out[t] = results[i];
  });
  return out;
}
