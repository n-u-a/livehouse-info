"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function AppNav() { const path = usePathname(); return <nav className="appNav" aria-label="主要ナビゲーション"><Link href="/" aria-current={path==="/"?"page":undefined}>会場を探す</Link><Link href="/favorites" aria-current={path==="/favorites"?"page":undefined}>☆ お気に入り</Link></nav>; }
