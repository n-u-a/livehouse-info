import type { Metadata } from "next";
import { AppShell } from "../components/AppShell";
import { FavoritesClient } from "../components/FavoritesClient";

export const metadata: Metadata = {
  title: "お気に入りライブ | ライブハウス情報",
};

export default function FavoritesPage() {
  return (
    <AppShell>
      <FavoritesClient />
    </AppShell>
  );
}
