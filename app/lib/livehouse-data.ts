import venueData from "./venues.json";
import eventData from "./events.json";
export type Region =
  | "HOKKAIDO"
  | "TOHOKU"
  | "KANTO"
  | "CHUBU"
  | "KANSAI"
  | "CHUGOKU_SHIKOKU"
  | "KYUSHU_OKINAWA";

export type Artist = {
  id: string;
  name: string;
};

export type Venue = {
  id: string;
  name: string;
  checkedAt: string;
  sources: { label: string; url: string; fields: string }[];
  capacityNote: string | null;
  nameKana: string | null;
  region: Region;
  prefecture: string;
  city: string;
  address: string;
  postalCode: string | null;
  capacity: number | null;
  drinkFee: number | null;
  frontRowEstimate: number | null;
  floorDescription: string | null;
  pillarInformation: string | null;
  floorMapImageUrl: string | null;
  accessInformation: string | null;
  officialWebsiteUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  upcomingLiveEventCount: number;
};

export type LiveEvent = {
  id: string;
  venueId: string;
  venueName: string;
  title: string;
  artists: Artist[];
  eventDate: string;
  openTime: string | null;
  startTime: string | null;
  ticketInformation: string | null;
  advanceTicketPrice: number | null;
  doorTicketPrice: number | null;
  drinkFeeRequired: boolean | null;
  officialUrl: string | null;
};

export const REGION_LABELS: Record<Region, string> = {
  HOKKAIDO: "北海道",
  TOHOKU: "東北",
  KANTO: "関東",
  CHUBU: "中部",
  KANSAI: "関西",
  CHUGOKU_SHIKOKU: "中国・四国",
  KYUSHU_OKINAWA: "九州・沖縄",
};

export const PREFECTURES_BY_REGION: Record<Region, string[]> = {
  HOKKAIDO: ["北海道"],
  TOHOKU: ["青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"],
  KANTO: ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"],
  CHUBU: ["新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県"],
  KANSAI: ["三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"],
  CHUGOKU_SHIKOKU: ["鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県"],
  KYUSHU_OKINAWA: ["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"],
};

export const venues = venueData as Venue[];
export const liveEvents = eventData as LiveEvent[];

export function getVenue(id: string) {
  return venues.find((venue) => venue.id === id) ?? null;
}

export function getLiveEvent(id: string) {
  return liveEvents.find((event) => event.id === id) ?? null;
}

export function getEventsByVenue(venueId: string) {
  return liveEvents
    .filter((event) => event.venueId === venueId)
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate));
}

export function formatNumber(value: number | null, suffix: string) {
  return value === null ? "未確認" : `${value.toLocaleString("ja-JP")}${suffix}`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "long", day: "numeric", weekday: "short" }).format(new Date(`${value}T00:00:00+09:00`));
}

export function formatTime(value: string | null) {
  return value ?? "未定";
}

export function isPastEvent(eventDate: string) {
  return new Date(`${eventDate}T23:59:59+09:00`).getTime() < Date.now();
}

export function getUpcomingEventCount(venueId: string) { return liveEvents.filter(e => e.venueId === venueId && !isPastEvent(e.eventDate)).length; }
