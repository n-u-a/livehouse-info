import type { Metadata } from "next";
import { AppShell } from "./components/AppShell";
import { SearchClient } from "./components/SearchClient";

export const metadata: Metadata = {
  title: "ライブハウス情報 | ライブハウス検索",
  description: "47都道府県のライブハウスを地域・会場名・キャパシティから検索。公式情報とアクセスを確認し、お気に入りに保存。",
};

export default function Home() {
  return (
    <AppShell>
      <SearchClient />
    </AppShell>
  );
}
