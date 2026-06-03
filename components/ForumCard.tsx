import React from 'react';
import Link from 'next/link';
import { ForumTopic } from '@/lib/forum';

interface ForumCardProps {
    topic: ForumTopic;
}

export default function ForumCard({ topic }: ForumCardProps) {
    return (
        <Link
            href={`/forum/${topic.id}`}
            className="bg-white border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] p-6 flex flex-row gap-6 hover:bg-[#fff3e1] transition-colors items-stretch"
        >
            {/* Bagian Kiri: Kategori, Judul, Deskripsi, dan Info Balasan Terakhir */}
            <div className="flex-grow flex flex-col justify-center min-w-0">
                <div className="flex gap-2 mb-3">
                    <span className="bg-[#233766] text-[#fff3e1] uppercase text-xs font-black px-2 py-1 border-2 border-[#233766]">
                        {topic.category}
                    </span>
                </div>

                <h4 className="text-xl font-black leading-tight mb-2 text-[#233766] truncate">
                    {topic.title}
                </h4>

                {/* Indikator Pembalas & Waktu Terakhir */}
                <div className="text-xs font-bold text-[#233766] mt-1">
                    {topic.lastReplyAuthorName ? (
                        <div className="flex items-center flex-wrap gap-1">
                            <span>Balasan terakhir: <span className="text-[#96582e] uppercase">{topic.lastReplyAuthorName}</span></span>
                            {topic.lastReplyAt && (
                                <span className="text-gray-500 font-semibold border-l-2 border-gray-300 pl-1.5 ml-0.5">
                                    {topic.lastReplyAt.toLocaleString('id-ID', {
                                        day: '2-digit', month: 'short', year: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    })} WIB
                                </span>
                            )}
                        </div>
                    ) : (
                        <span className="text-gray-500 uppercase font-black bg-gray-200 px-2 py-0.5 inline-block border-2 border-dashed border-gray-400">
                            Belum ada balasan
                        </span>
                    )}
                </div>
            </div>

            {/* Bagian Kanan: Total Balasan, Pembuat, Waktu Buat, dan Tombol */}
            <div className="flex-shrink-0 w-56 border-l-2 border-[#233766] border-dashed pl-6 flex flex-col justify-center items-end text-right">

                {/* Lencana Total Balasan */}
                <div className="bg-[#fff3e1] border-2 border-[#96582e] text-[#96582e] px-2 py-0.5 text-xs font-black uppercase mb-3 shadow-[2px_2px_0px_0px_#96582e]">
                    {topic.replyCount || 0} Komentar
                </div>

                <span className="text-sm text-[#96582e] uppercase font-black mb-1">{topic.authorName}</span>
                <span className="text-xs uppercase font-bold text-[#233766] mb-4">
                    {topic.createdAt.toLocaleString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                    })} WIB
                </span>

                <div className="bg-[#ffb703] text-[#233766] font-black px-4 py-2 border-2 border-[#233766] text-xs uppercase shadow-[4px_4px_0px_0px_#233766] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    Baca Topik
                </div>
            </div>
        </Link>
    );
}