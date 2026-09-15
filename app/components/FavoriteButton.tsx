"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "livehouse-info:favorites";

function readFavorites() {
  if (typeof window === "undefined") return [] as string[];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [] as string[];
  }
}

function writeFavorites(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(new Set(ids))));
  window.dispatchEvent(new Event("livehouse-favorites-change"));
}

export function getStoredFavoriteIds() {
  return readFavorites();
}

export function FavoriteButton({ eventId, compact = false }: { eventId: string; compact?: boolean }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const sync = () => setFavoriteIds(readFavorites());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("livehouse-favorites-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("livehouse-favorites-change", sync);
    };
  }, []);

  const isFavorite = favoriteIds.includes(eventId);

  function toggleFavorite() {
    const next = isFavorite ? favoriteIds.filter((id) => id !== eventId) : [...favoriteIds, eventId];
    try { writeFavorites(next); } catch { setMessage("保存できませんでした。ブラウザの保存設定をご確認ください。"); return; }
    setFavoriteIds(next);
    setMessage(isFavorite ? "お気に入りから削除しました。" : "お気に入りに追加しました。");
  }

  return (
    <span className="favoriteControl">
      <button
        type="button"
        className={compact ? "favoriteButton compact" : "favoriteButton"}
        aria-pressed={isFavorite}
        onClick={toggleFavorite}
      >
        <span aria-hidden="true">{isFavorite ? "★" : "☆"}</span>
        {isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
      </button>
      {message ? <span className="srStatus" role="status">{message}</span> : null}
    </span>
  );
}
