"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Jadwal from '@/components/Jadwal';
import Navbar from '@/components/Navbar';
import { listenPustakaItems, PustakaAdminItem } from '@/lib/admin';
import { listenTopics, ForumTopic } from '@/lib/forum';
import { listenShowcase, ShowcaseItem } from '@/lib/showcase';
import ForumCard from '@/components/ForumCard';
import ShowcaseCard from '@/components/ShowcaseCard';
import PustakaCard from '@/components/PustakaCard';

export default function Home() {
  const [pustakaItems, setPustakaItems] = useState<PustakaAdminItem[]>([]);
  const [pustakaLoading, setPustakaLoading] = useState(true);
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([]);

  const displayedPustaka = pustakaItems.slice(0, 3);
  const hasMorePustaka = pustakaItems.length > 3;

  useEffect(() => {
    const unsubscribe = listenPustakaItems((items) => {
      setPustakaItems(items);
      setPustakaLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = listenTopics((items) => setTopics(items.slice(0, 3)));
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = listenShowcase((items) => setShowcaseItems(items.slice(0, 3)));
    return unsubscribe;
  }, []);

  return (
    <>
      <Navbar />

      {/* BERANDA */}
      <section id="beranda" className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col justify-center">
        <div className="grid grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-7xl font-black uppercase leading-none mb-6">
              Teori. <br />
              <span className="bg-bwAccent px-2 border-brutal shadow-brutal inline-block my-2">Diskusi.</span> <br />
              Eksekusi.
            </h1>
            <p className="text-xl font-medium mb-8 border-l-4 border-bwDark pl-4">
              Lebih dari sekadar klub baca. BukuWare adalah ruang kolaboratif yang menjembatani kesenjangan antara literatur teknologi dan implementasi nyata di lapangan.
            </p>
            <div className="flex flex-wrap gap-4 font-bold">
              <a href="#jadwal" className="bg-bwDark text-bwLight px-8 py-3 border-brutal shadow-brutal hover:shadow-brutal-hover hover:translate-x-1 hover:translate-y-1 transition-all uppercase">
                Lihat Jadwal
              </a>
              <a href="#forum" className="bg-[#233766] text-[#fff3e1] px-8 py-3 border-brutal shadow-brutal hover:shadow-brutal-hover hover:translate-x-1 hover:translate-y-1 transition-all uppercase">
                Forum Diskusi
              </a>
              <a href="#ngoprek" className="bg-[#96582e] text-[#fff3e1] px-8 py-3 border-brutal shadow-brutal hover:shadow-brutal-hover hover:translate-x-1 hover:translate-y-1 transition-all uppercase">
                Showcase
              </a>
              <a href="#pustaka" className="bg-[#ffb703] text-[#233766] px-8 py-3 border-brutal shadow-brutal hover:shadow-brutal-hover hover:translate-x-1 hover:translate-y-1 transition-all uppercase">
                Pustaka
              </a>
            </div>
          </div>

          <div className="bg-white border-brutal shadow-brutal p-8 relative">
            <div className="absolute -top-6 -right-6 bg-bwAccent border-brutal px-4 py-2 font-black uppercase text-xl transform rotate-3 shadow-brutal-sm">
              Aksi
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-bwLight border-brutal p-4">
                <div className="bg-bwDark text-bwLight text-2xl font-black w-12 h-12 flex items-center justify-center border-brutal flex-shrink-0">1</div>
                <div>
                  <h3 className="font-black uppercase text-lg">Kurasi Literatur</h3>
                  <p className="text-sm font-semibold text-bwText">Menyaring literatur dan dokumentasi terbaik.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-bwLight border-brutal p-4">
                <div className="bg-bwDark text-bwLight text-2xl font-black w-12 h-12 flex items-center justify-center border-brutal flex-shrink-0">2</div>
                <div>
                  <h3 className="font-black uppercase text-lg">Diskusi Kritis</h3>
                  <p className="text-sm font-semibold text-bwText">Membedah konsep dan memvalidasi pemahaman.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-bwLight border-brutal p-4">
                <div className="bg-bwDark text-bwLight text-2xl font-black w-12 h-12 flex items-center justify-center border-brutal flex-shrink-0">3</div>
                <div>
                  <h3 className="font-black uppercase text-lg">Praktik Terapan</h3>
                  <p className="text-sm font-semibold text-bwText">Mengeksekusi teori menjadi purwarupa.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-brutal-b" />

      {/* JADWAL (Statis Sementara, Interaktif di Langkah 5) */}
      <Jadwal maxItems={3} allPageLink="/jadwal" showAllLink />

      <hr className="border-brutal-b" />

      {/* FORUM */}
      <section id="forum" className="min-h-screen py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-5xl font-black uppercase mb-4">Forum Diskusi</h2>
            <p className="text-lg font-bold bg-white inline-block px-3 py-1 border-brutal">Ruang tanya jawab, diskusi, dan berbagi info teknologi.</p>
          </div>
          <Link href="/forum" className="bg-bwAccent text-bwText font-black px-6 py-3 border-brutal shadow-brutal hover:shadow-brutal-hover hover:translate-y-1 transition-all uppercase flex items-center gap-2">
            <span className="text-xl leading-none">+</span> Buka Forum
          </Link>
        </div>

        {topics.length === 0 ? (
          <div className="p-12 bg-white border-brutal shadow-brutal text-center uppercase font-black">Belum ada topik diskusi. Jadi yang pertama mulai!</div>
        ) : (
          <div className="flex flex-col gap-6">
            {topics.map((topic) => (
              <ForumCard key={topic.id} topic={topic} />
            ))}
          </div>
        )}
      </section>

      <hr className="border-brutal-b" />

      {/* NGOPREK / SHOWCASE */}
      <section id="ngoprek" className="min-h-screen py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-5xl font-black uppercase mb-12 bg-bwText text-bwLight inline-block px-4 py-2 border-brutal shadow-brutal transform -rotate-1">
          Ruang Eksekusi
        </h2>

        <div className="bg-white border-brutal shadow-brutal p-8">
          <div className="flex flex-row justify-between items-end border-brutal-b pb-4 mb-8 gap-4">
            <h3 className="text-3xl font-black uppercase">Galeri Karya</h3>
            <Link href="/showcase" className="bg-bwAccent text-bwText font-black px-6 py-3 border-brutal shadow-brutal hover:shadow-brutal-hover hover:translate-y-1 transition-all uppercase">
              Lihat Semua
            </Link>
          </div>

          {showcaseItems.length === 0 ? (
            <div className="p-12 bg-bwLight border-brutal text-center uppercase font-black">
              Belum ada karya di Showcase. Tambahkan karya melalui dashboard admin.
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {showcaseItems.map((item) => (
                <ShowcaseCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
        <div className="bg-bwAccent border-brutal shadow-brutal p-8 mt-16 relative">
          <div className="absolute -top-5 -left-5 bg-white border-brutal px-3 py-1 font-black text-xl shadow-brutal-sm transform -rotate-6">
            ⌨️ Live Code
          </div>
          <div className="flex flex-row justify-between items-end border-brutal-b border-bwText pb-4 mb-6 gap-4 pt-4">
            <div>
              <h3 className="text-3xl font-black uppercase mb-2">Sandbox</h3>
              <p className="font-bold text-sm text-bwText">Uji coba algoritma secara langsung di peramban tanpa instalasi compiler lokal.</p>
            </div>
            <div className="flex-shrink-0">
              <span className="bg-black text-white px-3 py-2 text-xs font-black uppercase border-brutal-sm shadow-brutal-sm">Powered by OnlineGDB</span>
            </div>
          </div>
          <div className="border-brutal bg-white w-full h-[500px] relative shadow-inner overflow-hidden flex items-center justify-center">
            <iframe
              src="https://www.onlinegdb.com/"
              width="100%"
              height="100%"
              className="border-none absolute top-0 left-0"
              title="OnlineGDB Compiler"
              allow="fullscreen">
            </iframe>
          </div>
        </div>
      </section>

      <hr className="border-brutal-b" />

      {/* PUSTAKA */}
      <section id="pustaka" className="min-h-screen py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-5xl font-black uppercase mb-4">Pustaka</h2>
            <p className="text-lg font-bold bg-white inline-block px-3 py-1 border-brutal">Arsip literatur BukuWare.</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {pustakaLoading ? (
            <div className="col-span-3 p-8 bg-white border-brutal shadow-brutal text-center uppercase font-black">
              Memuat pustaka...
            </div>
          ) : pustakaItems.length === 0 ? (
            <div className="col-span-3 p-8 bg-white border-brutal shadow-brutal text-center uppercase font-black">
              Pustaka belum tersedia. Admin dapat menambahkan materi melalui dashboard.
            </div>
          ) : (
            displayedPustaka.map((item) => (
              <PustakaCard key={item.id} item={item} />
            ))
          )}
        </div>
        {hasMorePustaka && !pustakaLoading && (
          <div className="mt-10 text-center">
            <Link href="/pustaka" className="bg-bwAccent text-bwText font-black px-8 py-3 border-brutal shadow-brutal hover:shadow-brutal-hover hover:translate-y-1 transition-all uppercase">
              Lihat Semua Pustaka
            </Link>
          </div>
        )}
      </section>

      <footer className="bg-bwText text-bwLight border-brutal-t p-8 text-center font-bold">
        <p className="uppercase text-xl mb-2">BukuWare Community</p>
      </footer>
    </>
  );
}