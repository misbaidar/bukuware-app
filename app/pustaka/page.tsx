"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { listenPustakaItems, PustakaAdminItem } from "@/lib/admin";
import PustakaCard from "@/components/PustakaCard";

export default function PustakaPage() {
  const [pustakaItems, setPustakaItems] = useState<PustakaAdminItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  useEffect(() => {
    const unsubscribe = listenPustakaItems((items) => {
      setPustakaItems(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const categories = ["Semua", ...Array.from(new Set(pustakaItems.map(item => item.jenis)))];

  const filteredItems = selectedCategory === "Semua"
    ? pustakaItems
    : pustakaItems.filter(item => item.jenis === selectedCategory);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-black uppercase mb-4">Pustaka</h1>
          <p className="text-lg font-bold bg-white inline-block px-3 py-1 border-4 border-[#233766] shadow-[4px_4px_0px_0px_#233766] text-[#233766]">
            Arsip literatur BukuWare.
          </p>
        </div>

        {!loading && pustakaItems.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 border-2 border-[#233766] font-black uppercase text-sm shadow-[2px_2px_0px_0px_#233766] hover:translate-y-1 hover:shadow-none transition-all ${selectedCategory === cat
                    ? "bg-[#233766] text-[#fff3e1]"
                    : "bg-white text-[#233766]"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="p-12 bg-white border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] text-center uppercase font-black text-[#233766]">
            Memuat pustaka...
          </div>
        ) : pustakaItems.length === 0 ? (
          <div className="p-12 bg-white border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] text-center uppercase font-black text-[#233766]">
            Pustaka belum tersedia. Admin dapat menambahkan materi melalui dashboard.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <PustakaCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
