import React from 'react';
import Link from 'next/link';
import { ForumTopic } from '@/lib/forum';

interface ForumCardProps {
    topic: ForumTopic;
}

export default function ForumCard({ topic }: ForumCardProps) {
    // Membersihkan semua tag BBCode (teks di dalam kurung siku) agar preview rapi
    const cleanDescription = topic.description.replace(/\[.*?\]/g, "");

    return (
        <Link
            href={`/forum/${topic.id}`}
            className="bg-white border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] p-6 flex flex-row gap-6 hover:bg-[#fff3e1] transition-colors items-stretch"
        >
            {/* Bagian Kiri: Kategori, Judul, dan Deskripsi */}
            <div className="flex-grow flex flex-col justify-center">
                <div className="flex gap-2 mb-3">
                    <span className="bg-[#233766] text-[#fff3e1] uppercase text-xs font-black px-2 py-1 border-2 border-[#233766]">
                        {topic.category}
                    </span>
                </div>
                <h4 className="text-xl font-black leading-tight mb-2 text-[#233766]">{topic.title}</h4>
                <p
                    className="text-sm font-semibold text-[#233766]"
                    style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                >
                    {/* Menampilkan deskripsi yang sudah dibersihkan dari BBCode */}
                    {cleanDescription}
                </p>
            </div>

            {/* Bagian Kanan: Metadata (Penulis & Tanggal) dipisahkan garis putus-putus */}
            <div className="flex-shrink-0 w-48 border-l-2 border-[#233766] border-dashed pl-6 flex flex-col justify-center items-end text-right">
                <span className="text-sm text-[#96582e] uppercase font-black mb-1">{topic.authorName}</span>
                <span className="text-xs uppercase font-bold text-[#233766] mb-4">
                    {topic.createdAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
                <div className="bg-[#ffb703] text-[#233766] font-black px-4 py-2 border-2 border-[#233766] text-xs uppercase shadow-[4px_4px_0px_0px_#233766] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    Baca Topik
                </div>
            </div>
        </Link>
    );
}