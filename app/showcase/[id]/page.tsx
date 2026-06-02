"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthContext";
import { getShowcaseItem, ShowcaseItem } from "@/lib/showcase";

export default function ShowcaseDetailPage({ params }: { params: { id: string } }) {
  const itemId = params.id;
  const [item, setItem] = useState<ShowcaseItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadItem = async () => {
      setLoading(true);
      const result = await getShowcaseItem(itemId);
      if (!result) {
        setError("Karya tidak ditemukan.");
      }
      setItem(result);
      setLoading(false);
    };
    loadItem();
  }, [itemId]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <Link href="/showcase" className="text-sm uppercase font-bold tracking-wide text-[#233766] border-4 border-[#233766] px-4 py-2 bg-[#fff3e1] shadow-[8px_8px_0px_0px_#233766]">
              &larr; Kembali ke Showcase
            </Link>
            <h1 className="text-5xl font-black uppercase mt-6">Detail Karya</h1>
          </div>
          {user && (
            <div className="text-sm uppercase text-[#96582e] font-bold">{user.displayName || user.email?.split("@")[0]}</div>
          )}
        </div>

        {loading ? (
          <div className="p-12 bg-white border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] text-center uppercase font-black">Memuat karya...</div>
        ) : error ? (
          <div className="p-12 bg-white border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] text-center uppercase font-black">{error}</div>
        ) : item ? (
          <section className="bg-[#fff3e1] border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] p-8 space-y-8">
            <div>
              <h2 className="text-4xl font-black uppercase mb-4">{item.title}</h2>
              <div className="flex flex-wrap gap-4 text-sm uppercase font-black text-[#233766]">
                <span className="bg-[#233766] text-[#fff3e1] px-3 py-1 border-4 border-[#233766]">{item.techStack}</span>
                <span className="bg-[#ffb703] text-[#233766] px-3 py-1 border-4 border-[#233766]">{item.authorName}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="bg-white border-4 border-[#233766] p-6">
                <h3 className="text-xl font-black uppercase mb-4">Link Demo</h3>
                <a href={item.demoUrl} target="_blank" rel="noreferrer" className="block text-[#233766] underline break-all">
                  {item.demoUrl}
                </a>
              </div>
              <div className="bg-white border-4 border-[#233766] p-6">
                <h3 className="text-xl font-black uppercase mb-4">Repository</h3>
                <a href={item.repoUrl} target="_blank" rel="noreferrer" className="block text-[#233766] underline break-all">
                  {item.repoUrl}
                </a>
              </div>
            </div>

            <div className="bg-white border-4 border-[#233766] p-6">
              <h3 className="text-xl font-black uppercase mb-4">Tentang Karya</h3>
              <p className="text-sm text-[#233766] leading-relaxed">
                Karya ini dibagikan oleh <strong>{item.authorName}</strong> pada {item.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}.
              </p>
            </div>
          </section>
        ) : null}
      </main>
    </>
  );
}
