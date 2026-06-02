"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { listenPustakaItems, PustakaAdminItem } from "@/lib/admin";

export default function PustakaPage() {
  const [pustakaItems, setPustakaItems] = useState<PustakaAdminItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenPustakaItems((items) => {
      setPustakaItems(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-black uppercase mb-4">Pustaka</h1>
          <p className="text-lg font-bold bg-white inline-block px-3 py-1 border-brutal">
            Semua sumber dan materi BukuWare tersedia di sini.
          </p>
        </div>

        {loading ? (
          <div className="p-12 bg-white border-brutal shadow-brutal text-center uppercase font-black">
            Memuat pustaka...
          </div>
        ) : pustakaItems.length === 0 ? (
          <div className="p-12 bg-white border-brutal shadow-brutal text-center uppercase font-black">
            Pustaka belum tersedia. Admin dapat menambahkan materi melalui dashboard.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-8">
            {pustakaItems.map((item) => (
              <div key={item.id} className="bg-white border-brutal shadow-brutal p-6 flex flex-col gap-4">
                <div className="bg-[#233766] text-[#fff3e1] uppercase font-black px-3 py-1 border-brutal-sm inline-block text-xs w-max">
                  {item.jenis}
                </div>
                <h3 className="text-2xl font-black uppercase">{item.judul}</h3>
                <p className="text-sm font-semibold text-[#233766] leading-relaxed">{item.ringkasan}</p>
                {item.fileUrl ? (
                  <a href={item.fileUrl} target="_blank" rel="noreferrer" className="mt-auto bg-bwText text-bwLight font-black px-4 py-3 border-brutal shadow-brutal-sm uppercase text-center block">
                    Buka File
                  </a>
                ) : (
                  <button className="mt-auto bg-bwText text-bwLight font-black px-4 py-3 border-brutal shadow-brutal-sm uppercase">
                    Tersedia
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
