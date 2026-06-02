"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import {
  listenJadwalItems,
  JadwalAdminItem,
  registerJadwal,
  unregisterJadwal,
  listenUserRegistrations,
} from '@/lib/admin';

type JadwalProps = {
  maxItems?: number;
  allPageLink?: string;
  showAllLink?: boolean;
};

export default function Jadwal({ maxItems, allPageLink, showAllLink = false }: JadwalProps) {
  const [activePanelId, setActivePanelId] = useState<string | null>(null);
  const [items, setItems] = useState<JadwalAdminItem[]>([]);
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = listenJadwalItems(setItems);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setRegisteredIds([]);
      return;
    }
    const unsubscribe = listenUserRegistrations(user.uid, setRegisteredIds);
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (activePanelId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePanelId(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePanelId]);

  const handleRegister = async (itemId: string, isRegistered: boolean) => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      if (isRegistered) {
        await unregisterJadwal(itemId, user.uid);
      } else {
        await registerJadwal(
          itemId,
          user.uid,
          user.displayName || user.email?.split("@")[0] || "Member",
          user.email || ""
        );
      }
    } catch (error) {
      console.error("Gagal melakukan registrasi:", error);
    }
  };

  // Mencari data spesifik untuk ditampilkan di modal
  const activeData = items.find((item) => item.id === activePanelId);

  const displayedItems = maxItems ? items.slice(0, maxItems) : items;
  const shouldShowAllLink = showAllLink && allPageLink && items.length > (maxItems ?? items.length);

  return (
    <section id="jadwal" className="min-h-screen py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-row justify-between items-end mb-12 gap-4">
        <div>
          <h2 className="text-5xl font-black uppercase mb-4">Jadwal</h2>
          <p className="text-lg font-bold bg-white inline-block px-3 py-1 border-brutal">Agenda kegiatan BukuWare terkini.</p>
        </div>
      </div>

      <div className="bg-white border-brutal shadow-brutal flex flex-col w-full">
        {/* Header Tabel */}
        <div className="grid grid-cols-12 gap-4 bg-bwDark text-bwLight font-black uppercase p-4 border-brutal-b items-center">
          <div className="col-span-2">Periode</div>
          <div className="col-span-5">Literatur & Topik Utama</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3 text-right">Akses Panel</div>
        </div>

        {/* Looping Data Jadwal */}
        {displayedItems.map((item, idx) => {
          const isSelesai = item.status === 'Selesai';
          const isBerjalan = item.status === 'Berjalan';
          const isAkanDatang = item.status === 'Akan Datang';
          const isRegistered = registeredIds.includes(item.id);

          return (
            <div 
              key={item.id} 
              className={`flex flex-col ${idx !== displayedItems.length - 1 ? 'border-brutal-b' : ''} transition-colors ${isSelesai ? 'bg-gray-50' : isBerjalan ? 'bg-bwLight' : ''}`}
            >
              <div 
                className={`grid grid-cols-12 gap-4 p-6 items-start ${!isAkanDatang ? 'cursor-pointer hover:bg-gray-200 group opacity-90' : ''} relative`}
                onClick={() => !isAkanDatang && setActivePanelId(item.id)}
              >
                {/* Indikator Berjalan */}
                {isBerjalan && <div className="absolute left-0 top-0 bottom-0 w-2 bg-bwAccent border-r-4 border-bwText"></div>}
                
                <div className="col-span-2 font-bold text-lg pt-1">{item.periode}</div>
                
                <div className="col-span-5">
                  <h4 className="font-black text-2xl uppercase leading-none mb-2">{item.judul}</h4>
                  <p className="text-xs font-black uppercase bg-white px-2 py-0.5 inline-block mb-3 border-brutal-sm text-gray-500">
                    Oleh: {item.penulis}
                  </p>
                  <p className="text-sm font-semibold text-bwText leading-relaxed">Tema: {item.tema}</p>
                </div>
                
                <div className="col-span-2 mt-0 pt-1">
                  <span className={`border-brutal-sm px-3 py-1 text-xs font-black uppercase ${isSelesai ? 'bg-gray-300' : isBerjalan ? 'bg-bwAccent shadow-brutal-sm' : 'bg-white border-dashed text-gray-500'}`}>
                    {item.status}
                  </span>
                </div>
                
                <div className="col-span-3 mt-0 pt-1 flex gap-2 justify-end">
                  {!isAkanDatang ? (
                    <button className={`${isBerjalan ? 'bg-white text-bwText' : 'bg-bwText text-bwLight'} border-brutal group-hover:shadow-brutal-hover group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-200 px-3 py-2 font-black text-sm shadow-brutal-sm`}>
                      Detail
                    </button>
                  ) : (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRegister(item.id, isRegistered);
                      }}
                      className={`border-brutal px-4 py-2 font-black text-sm uppercase shadow-brutal-sm transition-all duration-200 ${
                        isRegistered 
                          ? 'bg-[#ff6b6b] text-white hover:bg-[#ff5252]' 
                          : 'bg-[#ffb703] text-bwText hover:shadow-brutal-hover hover:translate-x-0.5 hover:translate-y-0.5'
                      }`}
                    >
                      {isRegistered ? 'Batal Daftar ×' : 'Daftar Sekarang ⬇'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {shouldShowAllLink ? (
        <div className="mt-12 text-center">
          <Link href={allPageLink!} className="bg-transparent border-brutal text-bwText font-black px-8 py-3 hover:bg-bwText hover:text-bwLight transition-colors uppercase">
            Lihat Semua Jadwal ⬇
          </Link>
        </div>
      ) : null}

      {/* MODAL NEO-BRUTALISM DINAMIS */}
      {activeData && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setActivePanelId(null)}></div>
          <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8 bg-white border-brutal shadow-brutal-sm z-10 mx-6">
            <header className="flex items-start justify-between gap-4 border-brutal-b pb-4 mb-6">
              <div>
                <h3 className="text-3xl font-black uppercase">
                  Rincian Kegiatan ({activeData.periode})
                </h3>
              </div>
              <button onClick={() => setActivePanelId(null)} className="bg-bwText text-bwLight px-4 py-2 font-black border-brutal hover:bg-bwDark transition-colors">
                ✕ TUTUP
              </button>
            </header>
            
            <div className="mt-6 text-sm leading-relaxed">
              <div className={`grid ${activeData.arsip && activeData.arsip.length > 0 ? 'grid-cols-2' : 'grid-cols-2'} gap-6`}>
                
                {/* Kolom Kiri: Referensi & Jadwal Sesi */}
                <div className="space-y-6">
                  {/* Detail Referensi */}
                  <div className="border-brutal p-4 bg-white shadow-brutal-sm">
                    <h6 className="font-black uppercase mb-4 text-sm bg-bwText text-bwLight px-2 py-1 inline-block">Detail Referensi</h6>
                    <div className="flex gap-4 mb-4">
                      <div className="w-20 h-28 bg-bwDark border-brutal-sm flex-shrink-0 flex items-center justify-center text-bwLight text-xs font-bold text-center whitespace-pre-line">
                        {activeData.coverLabel}
                      </div>
                      <div>
                        <p className="font-black text-lg leading-tight uppercase mb-1">{activeData.judul}</p>
                        <p className="text-xs font-bold text-gray-600 mb-1">{activeData.kategoriAtauPenerbit}</p>
                        <p className="text-xs font-bold text-gray-600">{activeData.tahunAtauIsbn}</p>
                      </div>
                    </div>
                    <p className="text-xs font-semibold leading-relaxed border-t-2 border-dashed border-bwText pt-3">{activeData.deskripsiDetail}</p>
                  </div>
                  
                  {/* Pelaksanaan Diskusi */}
                  {activeData.sesi && (
                    <div className="border-brutal p-4 bg-bwLight">
                      <h6 className="font-black uppercase mb-4 text-sm bg-bwDark text-bwLight px-2 py-1 inline-block">Pelaksanaan Diskusi</h6>
                      <ul className="space-y-3 font-semibold text-sm">
                        {activeData.sesi.map((sesi, idx) => (
                          <li key={idx} className={`flex justify-between border-b-2 border-bwText border-dashed pb-2 ${sesi.isUpcoming ? 'opacity-50' : ''}`}>
                            <span className={sesi.isCurrent ? 'font-black text-bwDark' : ''}>{sesi.judul}</span>
                            <span className={`font-black ${sesi.isCurrent ? 'bg-white px-2 border-brutal-sm' : ''}`}>{sesi.tanggal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Kolom Kanan: Arsip (Hanya muncul jika ada data arsip) */}
                {activeData.arsip && activeData.arsip.length > 0 && (
                  <div className="border-brutal p-4 bg-white shadow-brutal-sm h-fit">
                    <h6 className="font-black uppercase mb-4 text-sm bg-bwAccent text-bwText px-2 py-1 inline-block">Arsip dari Kegiatan</h6>
                    <ul className="space-y-4 text-sm font-semibold">
                      {activeData.arsip.map((arsipItem, idx) => {
                        // Menentukan gaya label arsip berdasarkan tipe
                        let badgeStyle = "bg-gray-200 text-bwText";
                        if (arsipItem.tipe === 'PDF') badgeStyle = "bg-bwDark text-bwLight";
                        else if (arsipItem.tipe === 'Slide') badgeStyle = "bg-bwText text-bwLight";
                        else if (arsipItem.tipe === 'Notes') badgeStyle = "bg-bwAccent text-bwText";

                        return (
                          <li key={idx} className={`flex items-start gap-3 ${idx !== activeData.arsip!.length - 1 ? 'border-b-2 border-gray-100 pb-3' : ''}`}>
                            <span className={`${badgeStyle} px-2 py-1 text-xs uppercase border-brutal-sm mt-1`}>
                              {arsipItem.tipe}
                            </span>
                            <div>
                              {arsipItem.url ? (
                                <a 
                                  href={arsipItem.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="font-black text-base hover:underline text-[#233766] flex items-center gap-1 group"
                                >
                                  {arsipItem.judul}
                                  <span className="inline-block transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-xs">↗</span>
                                </a>
                              ) : (
                                <p className="font-black text-base">{arsipItem.judul}</p>
                              )}
                              <p className="text-xs text-gray-600 mt-1">{arsipItem.deskripsi}</p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}