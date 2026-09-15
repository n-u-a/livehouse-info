import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
const venues = JSON.parse(await readFile(new URL('../app/lib/venues.json', import.meta.url), 'utf8'));
const events = JSON.parse(await readFile(new URL('../app/lib/events.json', import.meta.url), 'utf8'));
test('all 47 prefectures have distinct real venues with traceable sources', () => {
 assert.equal(new Set(venues.map(v=>v.prefecture)).size, 47);
 assert.equal(new Set(venues.map(v=>v.id)).size, venues.length);
 for(const v of venues) {
  assert.doesNotMatch(v.name, /サンプル|架空/);
  assert.ok(v.sources.length && v.checkedAt);
  assert.match(v.id,/^[a-z0-9-]+$/);
  for (const s of v.sources) { assert.ok(['https:','http:'].includes(new URL(s.url).protocol)); assert.ok(s.fields); }
  for (const k of ['capacity','drinkFee','frontRowEstimate']) assert.ok(v[k] === null || (Number.isFinite(v[k]) && v[k] >= 0));
  if (v.capacity !== null) assert.ok(v.capacityNote);
 }
});
test('published events reference real venues and have valid Japanese local dates and times',()=>{
 assert.equal(new Set(events.map(e=>e.id)).size,events.length);
 for(const e of events){
  const v=venues.find(v=>v.id===e.venueId);assert.ok(v);assert.equal(v.name,e.venueName);
  assert.ok(e.officialUrl && e.artists.length);
  assert.match(e.eventDate,/^\d{4}-\d{2}-\d{2}$/);
  assert.ok(Number.isFinite(new Date(e.eventDate+'T00:00:00+09:00').getTime()));
  for (const t of [e.openTime,e.startTime]) if(t!==null)assert.match(t,/^(?:[01]\d|2[0-3]):[0-5]\d$/);
 }
});
test('server renders search, venue, event and favorites; missing venues return 404', async()=>{
 const {default:worker}=await import('../dist/server/index.js');
 for(const [path,status,expected] of [['/',200,'ライブハウスを探す'],['/venues/zepp-sapporo',200,'Zepp Sapporo'],['/live-events/aoen-2026-canova',200,'2026年9月21日'],['/favorites',200,'保存した会場'],['/venues/no-such-venue',404,'ページが見つかりません']]){
  const r=await worker.fetch(new Request('https://example.com'+path),{ASSETS:{fetch:async()=>new Response('Not found',{status:404})}},{waitUntil(){},passThroughOnException(){}});
  assert.equal(r.status,status,path);const html=await r.text();assert.ok(html.includes(expected),path);assert.doesNotMatch(html,/サンプルライブ|Your site is taking shape/);
 }
});
