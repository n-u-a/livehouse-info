import Link from "next/link";
import { REGION_LABELS, getUpcomingEventCount, formatNumber, type Venue } from "../lib/livehouse-data";
import { VenueFavorite } from "./VenueFavorite";
export function VenueCard({ venue }: { venue: Venue }) {
 const count = getUpcomingEventCount(venue.id);
 return <article className="venueCard"><div className="cardTop"><span className="regionTag">{REGION_LABELS[venue.region]}</span><VenueFavorite id={venue.id} name={venue.name}/></div><div className="cardTitle"><p className="location">{venue.prefecture}{venue.city ? ` / ${venue.city}` : ""}</p><h3><Link href={`/venues/${venue.id}`}>{venue.name}</Link></h3></div><dl className="metricList"><div><dt>キャパシティ</dt><dd className={venue.capacity === null ? "unknown" : ""}>{formatNumber(venue.capacity, "人")}</dd></div><div><dt>ドリンク代</dt><dd className={venue.drinkFee === null ? "unknown" : ""}>{formatNumber(venue.drinkFee, "円")}</dd></div></dl><div className="cardBottom"><span>{count ? `掲載公演 ${count}件` : "公演情報は公式へ"}</span><Link className="cardLink" href={`/venues/${venue.id}`}>会場詳細 <span aria-hidden="true">↗</span></Link></div></article>;
}
