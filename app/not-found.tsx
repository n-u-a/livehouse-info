import Link from "next/link";
import { AppShell } from "./components/AppShell";

export default function NotFound() {
  return (
    <AppShell>
      <main id="main" className="pageMain">
        <section className="pageHero compactPageHero">
          <p className="eyebrow">Not Found</p>
          <h1>ページが見つかりません</h1>
          <p>指定されたページは存在しないか、URLが変更されています。</p>
          <Link className="primaryAction" href="/">ライブハウス検索へ戻る</Link>
        </section>
      </main>
    </AppShell>
  );
}
