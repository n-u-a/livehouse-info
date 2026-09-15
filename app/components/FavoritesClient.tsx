"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { VenueCard } from "./VenueCard";
import { storedVenues } from "./VenueFavorite";
import { venues } from "../lib/livehouse-data";
import { FavoriteButton, getStoredFavoriteIds } from "./FavoriteButton";
import { formatDate, formatTime, isPastEvent, liveEvents } from "../lib/livehouse-data";

export function FavoritesClient() {
  const [savedVenueIds, setSavedVenueIds] = useState<string[]>([]);
  useEffect(() => {const sync = () => setSavedVenueIds(storedVenues());sync();window.addEventListener("storage",sync);window.addEventListener("venue-favorites-change",sync);return()=>{window.removeEventListener("storage",sync);window.removeEventListener("venue-favorites-change",sync);};},[]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  useEffect(() => {
    const sync = () => setFavoriteIds(getStoredFavoriteIds());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("livehouse-favorites-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("livehouse-favorites-change", sync);
    };
  }, []);

  const favoriteEvents = useMemo(() => liveEvents.filter((event) => favoriteIds.includes(event.id)), [favoriteIds]);
  const upcoming = favoriteEvents.filter((event) => !isPastEvent(event.eventDate)).sort((a, b) => a.eventDate.localeCompare(b.eventDate));
  const past = favoriteEvents.filter((event) => isPastEvent(event.eventDate)).sort((a, b) => b.eventDate.localeCompare(a.eventDate));
  const visibleEvents = tab === "upcoming" ? upcoming : past;

  return (
    <main id="main" className="pageMain">
      <section className="pageHero compactPageHero">
        <p className="eyebrow">Favorites</p>
        <h1>お気に入り</h1>
        <p>保存した会場とライブをまとめて確認できます。このブラウザに保存されます。</p>
      </section>
      <section className="savedVenues"><h2>保存した会場 {savedVenueIds.filter(id=>venues.some(v=>v.id===id)).length}件</h2>{savedVenueIds.some(id=>venues.some(v=>v.id===id)) ? <div className="venueGrid">{venues.filter(v=>savedVenueIds.includes(v.id)).map(v=><VenueCard key={v.id} venue={v}/>)}</div> : <div className="emptyState"><p>会場の☆を押して、次に行きたい場所を保存しましょう。</p><Link className="primaryAction" href="/">会場を探す</Link></div>}</section>
      <section className="contentPanel"><h2>保存したライブ</h2>
        <div className="tabs" role="group" aria-label="お気に入り表示切り替え">
          <button type="button" aria-pressed={tab === "upcoming"} onClick={() => setTab("upcoming")}>開催予定 {upcoming.length}件</button>
          <button type="button" aria-pressed={tab === "past"} onClick={() => setTab("past")}>終了済み {past.length}件</button>
        </div>
        {visibleEvents.length > 0 ? (
          <div className="eventList">
            {visibleEvents.map((event) => (
              <article className="eventCard" key={event.id}>
                <div>
                  <div className="eventMeta"><span>{formatDate(event.eventDate)}</span><span>{event.venueName}</span></div>
                  <h3><Link href={`/live-events/${event.id}`}>{event.title}</Link></h3>
                  <p>{event.artists.map((artist) => artist.name).join(" / ")}</p>
                  <p>開場 {formatTime(event.openTime)} / 開演 {formatTime(event.startTime)}</p>
                </div>
                <FavoriteButton eventId={event.id} compact />
              </article>
            ))}
          </div>
        ) : (
          <div className="emptyState">この区分に保存したライブはありません。</div>
        )}
      </section>
    </main>
  );
}
