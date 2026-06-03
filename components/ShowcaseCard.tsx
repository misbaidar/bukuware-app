"use client";

import React, { useState } from 'react';
import { ShowcaseItem, updateShowcaseItem, deleteShowcaseItem } from '@/lib/showcase';
import { useAuth } from '@/components/AuthContext';

interface ShowcaseCardProps {
    item: ShowcaseItem;
}

export default function ShowcaseCard({ item }: ShowcaseCardProps) {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [title, setTitle] = useState(item.title);
    const [techStack, setTechStack] = useState(item.techStack);
    const [description, setDescription] = useState(item.description);
    const [thumbnailUrl, setThumbnailUrl] = useState(item.thumbnailUrl);
    const [demoUrl, setDemoUrl] = useState(item.demoUrl);
    const [repoUrl, setRepoUrl] = useState(item.repoUrl);
    const [authorName, setAuthorName] = useState(item.authorName);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await updateShowcaseItem(item.id, {
                title,
                techStack,
                description,
                thumbnailUrl,
                demoUrl,
                repoUrl,
                authorName: authorName.trim(),
            });
            setIsEditing(false);
        } catch (err: any) {
            setError(err.message || "Gagal memperbarui karya.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Yakin ingin menghapus karya ini?")) {
            try {
                await deleteShowcaseItem(item.id);
            } catch (err: any) {
                alert("Gagal menghapus karya.");
            }
        }
    };

    if (isEditing) {
        return (
            <div className="bg-[#fff3e1] border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] p-6">
                <h3 className="text-2xl font-black uppercase mb-4">Edit Karya</h3>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-[#233766] mb-2">Judul Karya</label>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-white border-4 border-[#233766] p-3" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#233766] mb-2">Tech Stack</label>
                        <input value={techStack} onChange={(e) => setTechStack(e.target.value)} className="w-full bg-white border-4 border-[#233766] p-3" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#233766] mb-2">URL Demo</label>
                        <input value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} className="w-full bg-white border-4 border-[#233766] p-3" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#233766] mb-2">URL Repo</label>
                        <input value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} className="w-full bg-white border-4 border-[#233766] p-3" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#233766] mb-2">Deskripsi Projek</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-white border-4 border-[#233766] p-3 h-32" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#233766] mb-2">URL Thumbnail</label>
                        <input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} className="w-full bg-white border-4 border-[#233766] p-3" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#233766] mb-2">Nama Pembuat</label>
                        <input value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="w-full bg-white border-4 border-[#233766] p-3" required />
                    </div>
                    {error && <div className="text-red-600 font-bold">{error}</div>}
                    <div className="flex gap-4">
                        <button type="submit" disabled={submitting} className="bg-[#233766] text-[#fff3e1] px-4 py-2 border-2 border-[#233766] font-black uppercase">
                            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                        <button type="button" onClick={() => setIsEditing(false)} className="bg-white text-[#233766] px-4 py-2 border-2 border-[#233766] font-black uppercase">
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="bg-[#fff3e1] border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] flex flex-col md:flex-row items-stretch">
            {/* Bagian Kiri: Thumbnail */}
            <div className="w-full md:w-64 flex-shrink-0 bg-[#96582e] border-b-4 md:border-b-0 md:border-r-4 border-[#233766] flex items-center justify-center overflow-hidden relative min-h-[16rem]">
                {item.thumbnailUrl ? (
                    <img src={item.thumbnailUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                    <span className="text-[#fff3e1] font-black text-xl text-center px-4">[Preview Aplikasi]</span>
                )}
            </div>

            {/* Bagian Tengah: Detail Karya */}
            <div className="flex-1 p-6 flex flex-col justify-center">
                <div className="flex justify-between items-start gap-4 mb-3">
                    <span className="bg-[#ffb703] text-[#233766] px-2 py-1 font-black uppercase text-xs border-2 border-[#233766]">
                        SHOWCASE
                    </span>
                    {user?.role === "admin" && (
                        <div className="flex gap-2">
                            <button onClick={() => setIsEditing(true)} className="bg-white text-[#233766] border-2 border-[#233766] px-3 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_0px_#233766] hover:translate-y-1 hover:shadow-none transition-all">
                                Edit
                            </button>
                            <button onClick={handleDelete} className="bg-red-500 text-white border-2 border-[#233766] px-3 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_0px_#233766] hover:translate-y-1 hover:shadow-none transition-all">
                                Hapus
                            </button>
                        </div>
                    )}
                </div>
                <h2 className="text-3xl font-black text-[#233766] uppercase mb-2 leading-tight">{item.title}</h2>

                <div className="flex flex-wrap gap-2 mb-4">
                    {item.techStack.split(',').map((tech, idx) => {
                        const trimmed = tech.trim();
                        if (!trimmed) return null;
                        return (
                            <span key={idx} className="bg-white text-[#233766] px-2 py-1 font-bold text-xs border-2 border-[#233766]">
                                {trimmed}
                            </span>
                        );
                    })}
                </div>

                {item.description && (
                    <p className="text-sm font-semibold text-[#233766] leading-relaxed mb-4" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.description}
                    </p>
                )}

                <p className="text-xs font-black text-[#96582e] uppercase mt-auto">
                    Dibuat oleh: {item.authorName} • {item.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
            </div>

            {/* Bagian Kanan: Tombol Aksi */}
            <div className="w-full md:w-56 flex-shrink-0 border-t-4 md:border-t-0 md:border-l-4 border-[#233766] p-6 flex flex-col justify-center gap-4 bg-white">
                <a
                    href={item.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#233766] text-[#fff3e1] py-3 text-center font-black uppercase border-2 border-[#233766] shadow-[4px_4px_0px_0px_#233766] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
                >
                    🚀 Live Demo
                </a>
                <a
                    href={item.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-[#233766] py-3 text-center font-black uppercase border-2 border-[#233766] shadow-[4px_4px_0px_0px_#233766] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
                >
                    💻 Repositori
                </a>
            </div>
        </div>
    );
}
