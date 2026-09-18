import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "../../components/AppShell";
import { FavoriteButton } from "../../components/FavoriteButton";
import { formatDate, formatNumber, formatTime, getLiveEvent, getVenue, isPastEvent, liveEvents } from "../../lib/livehouse-data";

type LiveEventPageProps = {
  params: Promise<{ liveEventId: string }>;
};

export function generateStaticParams() {
  return liveEvents.map((event) => ({ liveEventId: event.id }));
}

export default async function LiveEventPage({ params }: LiveEventPageProps) {
  const { liveEventId } = await params;
  const event = getLiveEvent(liveEventId);
  if (!event) notFound();
  const venue = getVenue(event.venueId);

  return (
    <AppShell>
      <main id="main" className="pageMain">
        <nav className="breadcrumbs" aria-label="パンくずリスト">
          <Link href="/">検索</Link><span>/</span>{venue ? <Link href={`/venues/${venue.id}`}>{venue.name}</Link> : <span>{event.venueName}</span>}<span>/</span><span>{event.title}</span>
        </nav>
        <section className="pageHero">
          <p className="eyebrow">Live Event</p>
          <h1>{event.title}</h1>
          <p>{event.artists.map((artist) => artist.name).join(" / ")}</p>
          {isPastEvent(event.eventDate) ? <span className="statusBadge muted">終了</span> : <span className="statusBadge">開催予定</span>}
        </section>
        <section className="detailGrid">
          <article className="contentPanel">
            <h2>開催情報</h2>
            <dl className="detailList">
              <div><dt>開催日</dt><dd>{formatDate(event.eventDate)}</dd></div>
              <div><dt>開場</dt><dd>{formatTime(event.openTime)}</dd></div>
              <div><dt>開演</dt><dd>{formatTime(event.startTime)}</dd></div>
              <div><dt>ライブハウス</dt><dd>{venue ? <Link href={`/venues/${venue.id}`}>{venue.name}</Link> : event.venueName}</dd></div>
              <div><dt>出演者</dt><dd>{event.artists.map((artist) => artist.name).join(" / ")}</dd></div>
            </dl>
          </article>
          <article className="contentPanel">
            <h2>チケット</h2>
            <dl className="detailList">
              <div><dt>前売</dt><dd>{formatNumber(event.advanceTicketPrice, "円")}</dd></div>
              <div><dt>当日</dt><dd>{formatNumber(event.doorTicketPrice, "円")}</dd></div>
              <div><dt>ドリンク代</dt><dd>{event.drinkFeeRequired === null ? "未確認" : event.drinkFeeRequired ? "必要" : "不要"}</dd></div>
              <div><dt>チケット情報</dt><dd>{event.ticketInformation ?? "未確認"}</dd></div>
              <div><dt>公式情報</dt><dd>{event.officialUrl ? <a href={event.officialUrl} target="_blank" rel="noreferrer">外部サイトを開く</a> : "未確認"}</dd></div>
            </dl>
            <FavoriteButton eventId={event.id} />
          </article>
        </section>
      </main>
    </AppShell>
  );
}
