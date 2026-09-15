"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
export function SearchBackLink() { const [url,setUrl]=useState("/"); useEffect(()=>{try {const s=sessionStorage.getItem("livehouse-last-search");if(s && (s==="/" || s.startsWith("/?")))setUrl(s);}catch{}},[]);return <Link href={url}>会場検索へ戻る</Link>; }
