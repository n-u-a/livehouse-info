"use client";
import { useEffect, useState } from "react";
export const VENUE_FAVORITES_KEY = "livehouse-venue-favorites";
export function storedVenues(): string[] { try { const v = JSON.parse(localStorage.getItem(VENUE_FAVORITES_KEY) || "[]"); return Array.isArray(v) ? v.filter(x => typeof x === "string") : []; } catch { return []; } }
export function VenueFavorite({ id, name }: { id: string; name: string }) {
  const [saved, setSaved] = useState(false); const [error, setError] = useState("");
  useEffect(() => { const sync = () => setSaved(storedVenues().includes(id)); sync(); window.addEventListener("storage", sync); window.addEventListener("venue-favorites-change", sync); return () => { window.removeEventListener("storage", sync); window.removeEventListener("venue-favorites-change", sync); }; }, [id]);
  function toggle() { const ids = storedVenues(); try { localStorage.setItem(VENUE_FAVORITES_KEY, JSON.stringify(ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id])); window.dispatchEvent(new Event("venue-favorites-change")); setError(""); } catch { setError("保存できませんでした。ブラウザの保存設定をご確認ください。"); } }
  return <><button className="venueFavorite" type="button" aria-pressed={saved} aria-label={`${name}をお気に入り${saved ? "から解除" : "に保存"}`} onClick={toggle}>{saved ? "★" : "☆"}</button>{error && <span role="alert">{error}</span>}</>;
}
