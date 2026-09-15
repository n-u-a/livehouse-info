import Link from "next/link";
import { AppNav } from "./AppNav";
export function AppShell({ children }: { children: React.ReactNode }) {
  return <div className="appShell"><a className="skipLink" href="#main">本文へ移動</a><header className="appHeader"><Link href="/" className="brand" aria-label="ライブハウス情報 トップへ"><span className="brandMark" aria-hidden="true">LH<span>■</span></span><span>ライブハウス情報<small>JAPAN LIVE HOUSE GUIDE</small></span></Link><AppNav/></header>{children}<footer className="appFooter"><strong>LIVE HOUSE GUIDE</strong><p>掲載情報は2026年9月13日に公開情報を確認したものです。公演・料金・会場仕様の最新情報は各公式サイトでご確認ください。</p><span>未確認の項目は「未確認」と表示しています。</span></footer></div>;
}
