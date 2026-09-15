import Link from "next/link";
import { FavoriteButton } from "./FavoriteButton";
import { formatDate, formatTime, isPastEvent, type LiveEvent } from "../lib/livehouse-data";

export function LiveEventCard({ event }: { event: LiveEvent }) {
  return (
    <article className="eventCard">
      <div>
        <div className="eventMeta">
          <span>{formatDate(event.eventDate)}</span>
          {isPastEvent(event.eventDate) ? <span className="statusBadge muted">終了</span> : <span className="statusBadge">開催予定</span>}
        </div>
        <h3><Link href={`/live-events/${event.id}`}>{event.title}</Link></h3>
        <p>{event.artists.map((artist) => artist.name).join(" / ")}</p>
        <p>{event.venueName} ・ 開場 {formatTime(event.openTime)} / 開演 {formatTime(event.startTime)}</p>
      </div>
      <FavoriteButton eventId={event.id} compact />
    </article>
  );
}
