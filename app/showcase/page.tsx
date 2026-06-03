"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthContext";
import { ShowcaseItem, listenShowcase, createShowcaseItem } from "@/lib/showcase";
import ShowcaseCard from "@/components/ShowcaseCard";

export default function ShowcasePage() {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [techStack, setTechStack] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = listenShowcase((items) => {
      setItems(items);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setError(null);
    setSubmitting(true);
    try {
      await createShowcaseItem({
        title,
        techStack,
        description,
        thumbnailUrl,
        demoUrl,
        repoUrl,
        authorName: authorName.trim(),
        authorId: user.uid,
      });
      setTitle("");
      setTechStack("");
      setDescription("");
      setThumbnailUrl("");
      setDemoUrl("");
      setRepoUrl("");
      setAuthorName("");
      setShowForm(false);
      setHint("Karya berhasil ditambahkan — terima kasih sudah berbagi!");
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan karya.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end gap-4 mb-12">
          <div>
            <h1 className="text-5xl font-black uppercase mb-4">Showcase BukuWare</h1>
            <p className="text-lg font-bold bg-[#fff3e1] inline-block px-3 py-1 border-4 border-[#233766] text-[#233766]">
              Kumpulan karya praktik dan demo teknologi anggota BukuWare.
            </p>
          </div>
          {user?.role === "admin" ? (
            <button
              type="button"
              onClick={() => setShowForm((state) => !state)}
              className="bg-[#ffb703] text-[#233766] px-6 py-3 border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] uppercase font-black"
            >
              {showForm ? "Tutup Form" : "Tambah Karya"}
            </button>
          ) : (<div></div>
          )}
        </div>

        {hint && (
          <div className="mb-8 p-4 bg-[#fff3e1] border-4 border-[#233766] text-[#96582e] font-bold">
            {hint}
          </div>
        )}

        {showForm && user?.role === "admin" && (
          <section className="mb-12 bg-[#fff3e1] border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] p-8">
            <h2 className="text-3xl font-black uppercase mb-6">Form Unggah Karya Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#233766] mb-2">Judul Karya</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border-4 border-[#233766] p-3"
                  required
                  placeholder="Nama proyek / demo"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#233766] mb-2">Tech Stack</label>
                <input
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  className="w-full bg-white border-4 border-[#233766] p-3"
                  required
                  placeholder="React, Next.js, Firebase, Tailwind..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#233766] mb-2">URL Demo</label>
                <input
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  className="w-full bg-white border-4 border-[#233766] p-3"
                  required
                  placeholder="https://contoh-demo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#233766] mb-2">URL Repo</label>
                <input
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full bg-white border-4 border-[#233766] p-3"
                  required
                  placeholder="https://github.com/username/project"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#233766] mb-2">Deskripsi Projek (Opsional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border-4 border-[#233766] p-3 h-32"
                  placeholder="Jelaskan singkat proyek Anda"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#233766] mb-2">URL Thumbnail (Opsional)</label>
                <input
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="w-full bg-white border-4 border-[#233766] p-3"
                  placeholder="https://contoh-gambar.com/thumbnail.png"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#233766] mb-2">Nama Pembuat</label>
                <input
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-white border-4 border-[#233766] p-3"
                  required
                  placeholder="Masukkan nama kreator karya ini"
                />
              </div>
              {error && <div className="text-red-600 font-bold">{error}</div>}
              <div className="flex gap-4 flex-wrap">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#233766] text-[#fff3e1] px-6 py-3 border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] uppercase font-black"
                >
                  {submitting ? "Mengunggah..." : "Unggah Karya"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-[#fff3e1] text-[#233766] px-6 py-3 border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] uppercase font-black"
                >
                  Batal
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="flex flex-col gap-8">
          {loading ? (
            <div className="p-8 bg-white border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] text-center uppercase font-black">
              Memuat galeri...
            </div>
          ) : items.length === 0 ? (
            <div className="p-8 bg-white border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] text-center uppercase font-black">
              Belum ada karya. Ajak temanmu untuk berbagi proyek.
            </div>
          ) : (
            items.map((item) => (
              <ShowcaseCard key={item.id} item={item} />
            ))
          )}
        </section>
      </main>
    </>
  );
}
