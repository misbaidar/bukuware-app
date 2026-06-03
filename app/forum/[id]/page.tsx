"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthContext";
import {
  listenTopic, listenReplies, createReply,
  updateTopic, deleteTopic,
  updateReply, deleteReply,
  ForumTopic, ForumReply
} from "@/lib/forum";
import BBCodeEditor from "@/components/BBCodeEditor";
import BBCodeParser from "@/components/BBCodeParser";

export default function ForumTopicPage({ params }: { params: { id: string } }) {
  const topicId = params.id;
  const router = useRouter();
  const { user } = useAuth();

  // State Utama
  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(true);

  // State Balasan Baru
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State Edit Topik
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [editTopicTitle, setEditTopicTitle] = useState("");
  const [editTopicCategory, setEditTopicCategory] = useState("");
  const [editTopicDesc, setEditTopicDesc] = useState("");

  // State Edit Balasan
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editReplyContent, setEditReplyContent] = useState("");

  useEffect(() => {
    const unsubscribeTopic = listenTopic(topicId, (item) => {
      setTopic(item);
      setLoading(false);
    });
    const unsubscribeReplies = listenReplies(topicId, (items) => setReplies(items));
    return () => {
      unsubscribeTopic();
      unsubscribeReplies();
    };
  }, [topicId]);

  // --- HANDLER TOPIK UTAMA ---
  const handleEditTopicStart = () => {
    if (!topic) return;
    setEditTopicTitle(topic.title);
    setEditTopicCategory(topic.category);
    setEditTopicDesc(topic.description);
    setIsEditingTopic(true);
  };

  const handleUpdateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTopicDesc.trim()) return;
    try {
      await updateTopic(topicId, {
        title: editTopicTitle,
        category: editTopicCategory,
        description: editTopicDesc,
      });
      setIsEditingTopic(false);
    } catch (err) {
      alert("Gagal memperbarui topik.");
    }
  };

  const handleDeleteTopic = async () => {
    if (window.confirm("Yakin ingin menghapus topik ini? Tindakan ini tidak bisa dibatalkan.")) {
      try {
        await deleteTopic(topicId);
        router.push("/forum"); // Tendang user kembali ke daftar forum setelah dihapus
      } catch (err) {
        alert("Gagal menghapus topik.");
      }
    }
  };

  // --- HANDLER BALASAN ---
  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return setError("Silakan login untuk menambahkan balasan.");
    if (!comment.trim()) return setError("Balasan tidak boleh kosong.");

    setError(null);
    setSubmitting(true);
    try {
      await createReply(topicId, {
        content: comment.trim(),
        authorName: user.displayName || user.email?.split("@")[0] || "Member BukuWare",
        authorId: user.uid,
      });
      setComment("");
    } catch (err: any) {
      setError(err.message || "Gagal menambahkan balasan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReplyStart = (reply: ForumReply) => {
    setEditingReplyId(reply.id);
    setEditReplyContent(reply.content);
  };

  const handleUpdateReply = async (e: React.FormEvent, replyId: string) => {
    e.preventDefault();
    if (!editReplyContent.trim()) return;
    try {
      await updateReply(topicId, replyId, editReplyContent);
      setEditingReplyId(null);
    } catch (err) {
      alert("Gagal memperbarui balasan.");
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (window.confirm("Yakin ingin menghapus balasan ini?")) {
      try {
        await deleteReply(topicId, replyId);
      } catch (err) {
        alert("Gagal menghapus balasan.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <Link href="/forum" className="text-sm uppercase font-bold tracking-wide text-[#233766] border-4 border-[#233766] px-4 py-2 bg-[#fff3e1] shadow-[8px_8px_0px_0px_#233766] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              &larr; Kembali ke Board Diskusi
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="p-12 bg-white border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] text-center uppercase font-black">Memuat topik...</div>
        ) : topic ? (
          <div className="space-y-8">

            {/* --- SEKSI TOPIK UTAMA --- */}
            <section className="bg-[#fff3e1] border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] p-8">
              {!isEditingTopic ? (
                <>
                  <div className="mb-4 flex flex-wrap justify-between items-start gap-4">
                    <div className="flex flex-wrap gap-3">
                      <span className="bg-[#233766] text-[#fff3e1] px-3 py-1 uppercase text-xs font-black border-4 border-[#233766]">{topic.category}</span>
                      <span className="bg-[#ffb703] text-[#233766] px-3 py-1 uppercase text-xs font-black border-4 border-[#233766]">{topic.authorName}</span>
                    </div>

                    {/* Tombol Aksi Topik (Hanya tampil jika user adalah pemilik) */}
                    {user?.uid === topic.authorId && (
                      <div className="flex gap-2">
                        <button onClick={handleEditTopicStart} className="bg-white text-[#233766] border-2 border-[#233766] px-3 py-1 text-xs font-black uppercase shadow-[4px_4px_0px_0px_#233766] hover:translate-y-1 hover:shadow-none transition-all">
                          Edit
                        </button>
                        <button onClick={handleDeleteTopic} className="bg-red-500 text-white border-2 border-[#233766] px-3 py-1 text-xs font-black uppercase shadow-[4px_4px_0px_0px_#233766] hover:translate-y-1 hover:shadow-none transition-all">
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>

                  <h2 className="text-4xl font-black uppercase overflow-hidden mb-6">{topic.title}</h2>

                  <div className="text-lg text-[#233766]">
                    <BBCodeParser content={topic.description} />
                  </div>

                  <div className="mt-8 text-sm uppercase text-[#96582e] font-bold border-t-2 border-[#233766] pt-4">
                    <span className="text-xs uppercase font-bold text-[#96582e]">
                      {topic.createdAt.toLocaleString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })} WIB
                    </span>
                  </div>
                </>
              ) : (
                // Form Edit Topik Utama
                <form onSubmit={handleUpdateTopic} className="space-y-4">
                  <h3 className="text-2xl font-black uppercase mb-4 border-b-4 border-[#233766] pb-2">Edit Topik</h3>
                  <input
                    value={editTopicTitle}
                    onChange={(e) => setEditTopicTitle(e.target.value)}
                    className="w-full border-4 border-[#233766] p-3 bg-white font-black text-xl"
                    required
                  />
                  <input
                    value={editTopicCategory}
                    onChange={(e) => setEditTopicCategory(e.target.value)}
                    className="w-full border-4 border-[#233766] p-3 bg-white uppercase font-bold"
                    required
                  />
                  <BBCodeEditor
                    value={editTopicDesc}
                    onChange={setEditTopicDesc}
                  />
                  <div className="flex gap-4 pt-2">
                    <button type="submit" className="bg-[#233766] text-[#fff3e1] px-6 py-3 border-4 border-[#233766] shadow-[4px_4px_0px_0px_#233766] uppercase font-black">
                      Simpan Perubahan
                    </button>
                    <button type="button" onClick={() => setIsEditingTopic(false)} className="bg-white text-[#233766] px-6 py-3 border-4 border-[#233766] shadow-[4px_4px_0px_0px_#233766] uppercase font-black">
                      Batal
                    </button>
                  </div>
                </form>
              )}
            </section>

            {/* --- SEKSI BALASAN --- */}
            <section className="bg-white border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] p-8">
              <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                <h3 className="text-3xl font-black uppercase">Balasan</h3>
                <span className="text-sm uppercase text-[#96582e] font-bold bg-[#fff3e1] border-2 border-[#96582e] px-2 py-1">{replies.length} komentar</span>
              </div>
              {replies.length === 0 ? (
                <div className="p-8 bg-[#fff3e1] border-4 border-[#233766] text-center uppercase font-bold">Belum ada balasan, jadilah yang pertama memberi tanggapan.</div>
              ) : (
                <div className="space-y-4">
                  {replies.map((reply) => (
                    <div key={reply.id} className="bg-[#fff3e1] border-4 border-[#233766] p-6 relative group">

                      {editingReplyId !== reply.id ? (
                        <>
                          <div className="flex items-center justify-between gap-4 mb-3 border-b-2 border-[#233766] border-dashed pb-2">
                            <span className="font-black uppercase text-[#233766]">{reply.authorName}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-xs uppercase font-bold text-[#96582e]">
                                {reply.createdAt.toLocaleString('id-ID', {
                                  day: '2-digit', month: 'short', year: 'numeric',
                                  hour: '2-digit', minute: '2-digit'
                                })} WIB
                              </span>

                              {/* Tombol Aksi Balasan (Hanya tampil jika user adalah pemilik balasan) */}
                              {user?.uid === reply.authorId && (
                                <div className="flex gap-2">
                                  <button onClick={() => handleEditReplyStart(reply)} className="text-xs font-black uppercase bg-[#ffb703] border-2 border-[#233766] px-2 py-0.5 hover:bg-white transition-colors">Edit</button>
                                  <button onClick={() => handleDeleteReply(reply.id)} className="text-xs font-black uppercase bg-red-500 text-white border-2 border-[#233766] px-2 py-0.5 hover:bg-white hover:text-red-500 transition-colors">Hapus</button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-sm text-[#233766]">
                            <BBCodeParser content={reply.content} />
                          </div>
                        </>
                      ) : (
                        // Form Edit Balasan
                        <form onSubmit={(e) => handleUpdateReply(e, reply.id)} className="space-y-4">
                          <BBCodeEditor
                            value={editReplyContent}
                            onChange={setEditReplyContent}
                          />
                          <div className="flex gap-3">
                            <button type="submit" className="bg-[#233766] text-[#fff3e1] px-4 py-2 border-2 border-[#233766] uppercase font-black text-sm">Simpan</button>
                            <button type="button" onClick={() => setEditingReplyId(null)} className="bg-white text-[#233766] px-4 py-2 border-2 border-[#233766] uppercase font-black text-sm">Batal</button>
                          </div>
                        </form>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* --- FORM TAMBAH BALASAN BARU --- */}
            <section className="bg-[#fff3e1] border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] p-8">
              <h3 className="text-3xl font-black uppercase mb-4">Tambahkan Balasan</h3>
              <form onSubmit={handlePostReply} className="space-y-4">
                <BBCodeEditor
                  value={comment}
                  onChange={setComment}
                  placeholder={user ? "Tulis balasan Anda di sini... Coba blok teks lalu klik tombol B atau I di atas." : "Login terlebih dahulu untuk ikut berdiskusi..."}
                  disabled={!user || submitting}
                />
                {error && <div className="text-red-600 font-bold bg-white border-2 border-red-600 p-2 inline-block">{error}</div>}
                <div className="flex gap-4 flex-wrap pt-2">
                  <button
                    type="submit"
                    disabled={!user || submitting}
                    className="bg-[#233766] text-[#fff3e1] px-6 py-3 border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase font-black"
                  >
                    {submitting ? "Mengirim..." : "Kirim Balasan"}
                  </button>
                  {!user && (
                    <Link href="/login" className="bg-[#ffb703] text-[#233766] px-6 py-3 border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase font-black">
                      Login dulu
                    </Link>
                  )}
                </div>
              </form>
            </section>

          </div>
        ) : (
          <div className="p-12 bg-white border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] text-center uppercase font-black">
            Topik tidak ditemukan atau telah dihapus.
          </div>
        )}
      </main>
    </>
  );
}