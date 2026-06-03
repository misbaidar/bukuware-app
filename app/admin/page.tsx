"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import { useAuth } from "@/components/AuthContext";
import {
  JadwalAdminItem,
  PustakaAdminItem,
  RegistrasiItem,
  listenJadwalItems,
  listenPustakaItems,
  createJadwalItem,
  updateJadwalItem,
  deleteJadwalItem,
  createPustakaItem,
  updatePustakaItem,
  deletePustakaItem,
  listenAllRegistrations,
} from "@/lib/admin";

type AdminTab = "dashboard" | "jadwal" | "pustaka";

const defaultJadwalForm = {
  periode: "",
  judul: "",
  penulis: "",
  tema: "",
  status: "Akan Datang" as "Selesai" | "Berjalan" | "Akan Datang",
  coverLabel: "",
  coverUrl: "",
  kategoriAtauPenerbit: "",
  tahunAtauIsbn: "",
  deskripsiDetail: "",
  sesi: [] as Array<{
    judul: string;
    tanggal: string;
    isUpcoming?: boolean;
    isCurrent?: boolean;
  }>,
  arsip: [] as Array<{
    tipe: "PDF" | "Slide" | "Notes";
    judul: string;
    deskripsi: string;
    url?: string;
  }>,
};

const defaultPustakaForm = {
  judul: "",
  jenis: "Ringkasan",
  ringkasan: "",
  fileUrl: "",
};

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [jadwalItems, setJadwalItems] = useState<JadwalAdminItem[]>([]);
  const [pustakaItems, setPustakaItems] = useState<PustakaAdminItem[]>([]);
  const [registrations, setRegistrations] = useState<RegistrasiItem[]>([]);

  const [jadwalForm, setJadwalForm] = useState(defaultJadwalForm);
  const [pustakaForm, setPustakaForm] = useState(defaultPustakaForm);
  const [editingJadwalId, setEditingJadwalId] = useState<string | null>(null);
  const [editingPustakaId, setEditingPustakaId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Temporary state for form entries of sessions/archives
  const [tempSesi, setTempSesi] = useState({ judul: "", tanggal: "", isUpcoming: false, isCurrent: false });
  const [tempArsip, setTempArsip] = useState({ tipe: "PDF" as "PDF" | "Slide" | "Notes", judul: "", deskripsi: "", url: "" });

  useEffect(() => {
    if (!loading) {
      setIsReady(true);
      if (!user) {
        router.push("/login");
      } else if (user.role !== "admin") {
        router.push("/");
      }
    }
  }, [loading, user, router]);

  useEffect(() => {
    const unsubJadwal = listenJadwalItems(setJadwalItems);
    const unsubPustaka = listenPustakaItems(setPustakaItems);
    const unsubRegs = listenAllRegistrations(setRegistrations);
    return () => {
      unsubJadwal();
      unsubPustaka();
      unsubRegs();
    };
  }, []);

  const resetJadwalForm = () => {
    setEditingJadwalId(null);
    setJadwalForm(defaultJadwalForm);
  };

  const resetPustakaForm = () => {
    setEditingPustakaId(null);
    setPustakaForm(defaultPustakaForm);
  };

  const handleJadwalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      if (editingJadwalId) {
        await updateJadwalItem(editingJadwalId, jadwalForm);
        setMessage("Jadwal berhasil diperbarui.");
      } else {
        await createJadwalItem(jadwalForm);
        setMessage("Jadwal baru berhasil ditambahkan.");
      }
      resetJadwalForm();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan jadwal.");
    }
  };

  const handlePustakaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      if (editingPustakaId) {
        await updatePustakaItem(editingPustakaId, pustakaForm);
        setMessage("Pustaka berhasil diperbarui.");
      } else {
        await createPustakaItem(pustakaForm);
        setMessage("Pustaka baru berhasil ditambahkan.");
      }
      resetPustakaForm();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan pustaka.");
    }
  };

  const handleEditJadwal = (item: JadwalAdminItem) => {
    setActiveTab("jadwal");
    setEditingJadwalId(item.id);
    setJadwalForm({
      periode: item.periode,
      judul: item.judul,
      penulis: item.penulis,
      tema: item.tema,
      status: item.status,
      coverLabel: item.coverLabel || "",
      coverUrl: item.coverUrl || "",
      kategoriAtauPenerbit: item.kategoriAtauPenerbit || "",
      tahunAtauIsbn: item.tahunAtauIsbn || "",
      deskripsiDetail: item.deskripsiDetail || "",
      sesi: item.sesi || [],
      arsip: item.arsip || [],
    });
    setMessage(null);
    setError(null);
  };

  const addSesi = () => {
    if (!tempSesi.judul.trim() || !tempSesi.tanggal.trim()) return;
    setJadwalForm((prev) => ({
      ...prev,
      sesi: [...prev.sesi, tempSesi],
    }));
    setTempSesi({ judul: "", tanggal: "", isUpcoming: false, isCurrent: false });
  };

  const removeSesi = (index: number) => {
    setJadwalForm((prev) => ({
      ...prev,
      sesi: prev.sesi.filter((_, idx) => idx !== index),
    }));
  };

  const addArsip = () => {
    if (!tempArsip.judul.trim() || !tempArsip.deskripsi.trim()) return;
    setJadwalForm((prev) => ({
      ...prev,
      arsip: [...prev.arsip, tempArsip],
    }));
    setTempArsip({ tipe: "PDF", judul: "", deskripsi: "", url: "" });
  };

  const removeArsip = (index: number) => {
    setJadwalForm((prev) => ({
      ...prev,
      arsip: prev.arsip.filter((_, idx) => idx !== index),
    }));
  };

  const handleEditPustaka = (item: PustakaAdminItem) => {
    setActiveTab("pustaka");
    setEditingPustakaId(item.id);
    setPustakaForm({
      judul: item.judul,
      jenis: item.jenis,
      ringkasan: item.ringkasan,
      fileUrl: item.fileUrl || "",
    });
    setMessage(null);
    setError(null);
  };

  if (!isReady) {
    return <div className="min-h-screen pt-32 px-6 text-center text-[#233766]">Memeriksa hak akses admin...</div>;
  }

  const jadwalBerjalan = jadwalItems.filter((j) => j.status === "Berjalan").length;
  const jadwalSelesai = jadwalItems.filter((j) => j.status === "Selesai").length;
  const jadwalAkanDatang = jadwalItems.filter((j) => j.status === "Akan Datang").length;

  return (
    <>
      <Navbar />
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content dengan margin untuk sidebar */}
      <main className="min-h-screen pt-32 pb-24 ml-64 px-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-black uppercase mb-2">Panel Admin</h1>
          <p className="text-lg font-bold text-[#96582e]">
            Selamat datang, <span className="text-[#233766]">{user?.displayName || user?.email?.split("@")[0] || "Admin"}</span>
          </p>
        </div>

        {/* Alert Messages */}
        {(message || error) && (
          <div
            className={`mb-8 p-4 border-4 rounded-none font-bold ${message
              ? "bg-[#fff3e1] border-[#233766] text-[#96582e]"
              : "bg-[#ffe3e3] border-red-600 text-red-800"
              }`}
          >
            {message || error}
          </div>
        )}

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-white border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] p-6">
                <div className="text-5xl font-black text-[#233766] mb-2">{jadwalItems.length}</div>
                <p className="text-sm font-bold uppercase text-[#96582e]">Total Jadwal</p>
              </div>
              <div className="bg-[#fff3e1] border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] p-6">
                <div className="text-5xl font-black text-[#ffb703] mb-2">{jadwalBerjalan}</div>
                <p className="text-sm font-bold uppercase text-[#233766]">Sedang Berjalan</p>
              </div>
              <div className="bg-green-100 border-4 border-green-600 shadow-[8px_8px_0px_0px_#90ee90] p-6">
                <div className="text-5xl font-black text-green-700 mb-2">{jadwalSelesai}</div>
                <p className="text-sm font-bold uppercase text-green-700">Selesai</p>
              </div>
              <div className="bg-blue-100 border-4 border-blue-600 shadow-[8px_8px_0px_0px_#87ceeb] p-6">
                <div className="text-5xl font-black text-blue-700 mb-2">{jadwalAkanDatang}</div>
                <p className="text-sm font-bold uppercase text-blue-700">Akan Datang</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] p-6">
                <div className="text-4xl font-black text-[#233766] mb-2">{pustakaItems.length}</div>
                <p className="text-sm font-bold uppercase text-[#96582e]">Total Pustaka</p>
                <button
                  onClick={() => setActiveTab("pustaka")}
                  className="mt-4 bg-[#233766] text-[#fff3e1] px-4 py-2 border-4 border-[#233766] font-black uppercase text-sm hover:shadow-[4px_4px_0px_0px_#233766]"
                >
                  Kelola Pustaka →
                </button>
              </div>

              <div className="bg-white border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] p-6">
                <h3 className="text-2xl font-black uppercase mb-4 text-[#233766]">Ringkasan Pustaka</h3>
                <div className="space-y-2">
                  {["Ringkasan", "Artikel", "Video", "Podcast", "Repository"].map((jenis) => {
                    const count = pustakaItems.filter((p) => p.jenis === jenis).length;
                    return (
                      <div key={jenis} className="flex justify-between border-b-2 border-dashed border-[#96582e] pb-2">
                        <span className="font-bold text-[#233766]">{jenis}</span>
                        <span className="font-black text-[#ffb703]">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* JADWAL TAB */}
        {activeTab === "jadwal" && (
          <section className="space-y-8">
            <div>
              <h2 className="text-4xl font-black uppercase mb-6 text-[#233766]">Kelola Jadwal</h2>

              {/* Form Tambah/Edit Jadwal */}
              <form
                onSubmit={handleJadwalSubmit}
                className="bg-[#fff3e1] border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] p-8 mb-10"
              >
                <h3 className="text-2xl font-black uppercase mb-6 text-[#233766]">
                  {editingJadwalId ? "Edit Jadwal" : "Tambah Jadwal Baru"}
                </h3>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <label className="block">
                    <span className="text-sm font-black uppercase text-[#233766]">Periode</span>
                    <input
                      value={jadwalForm.periode}
                      onChange={(e) => setJadwalForm((prev) => ({ ...prev, periode: e.target.value }))}
                      className="w-full border-4 border-[#233766] p-3 bg-white"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-black uppercase text-[#233766]">Judul</span>
                    <input
                      value={jadwalForm.judul}
                      onChange={(e) => setJadwalForm((prev) => ({ ...prev, judul: e.target.value }))}
                      className="w-full border-4 border-[#233766] p-3 bg-white"
                      required
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <label className="block">
                    <span className="text-sm font-black uppercase text-[#233766]">Penulis</span>
                    <input
                      value={jadwalForm.penulis}
                      onChange={(e) => setJadwalForm((prev) => ({ ...prev, penulis: e.target.value }))}
                      className="w-full border-4 border-[#233766] p-3 bg-white"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-black uppercase text-[#233766]">Status</span>
                    <select
                      value={jadwalForm.status}
                      onChange={(e) =>
                        setJadwalForm((prev) => ({
                          ...prev,
                          status: e.target.value as "Selesai" | "Berjalan" | "Akan Datang",
                        }))
                      }
                      className="w-full border-4 border-[#233766] p-3 bg-white"
                      required
                    >
                      <option value="Akan Datang">Akan Datang</option>
                      <option value="Berjalan">Berjalan</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-6">
                  <label className="block">
                    <span className="text-sm font-black uppercase text-[#233766]">URL Sampul Buku</span>
                    <input
                      type="url"
                      value={jadwalForm.coverUrl || ""}
                      onChange={(e) => setJadwalForm((prev) => ({ ...prev, coverUrl: e.target.value }))}
                      placeholder="https://contoh.com/gambar-cover.jpg"
                      className="w-full border-4 border-[#233766] p-3 bg-white"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-black uppercase text-[#233766]">Kategori / Penerbit</span>
                    <input
                      value={jadwalForm.kategoriAtauPenerbit}
                      onChange={(e) => setJadwalForm((prev) => ({ ...prev, kategoriAtauPenerbit: e.target.value }))}
                      placeholder="e.g. O'Reilly Media"
                      className="w-full border-4 border-[#233766] p-3 bg-white"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-black uppercase text-[#233766]">Tahun / ISBN</span>
                    <input
                      value={jadwalForm.tahunAtauIsbn}
                      onChange={(e) => setJadwalForm((prev) => ({ ...prev, tahunAtauIsbn: e.target.value }))}
                      placeholder="e.g. 2023 / 978-1"
                      className="w-full border-4 border-[#233766] p-3 bg-white"
                    />
                  </label>
                </div>

                <div className="mb-6">
                  <span className="text-sm font-black uppercase text-[#233766]">Tema</span>
                  <textarea
                    value={jadwalForm.tema}
                    onChange={(e) => setJadwalForm((prev) => ({ ...prev, tema: e.target.value }))}
                    className="w-full border-4 border-[#233766] p-3 bg-white h-24"
                    required
                  />
                </div>

                <div className="mb-6">
                  <span className="text-sm font-black uppercase text-[#233766]">Deskripsi Detail</span>
                  <textarea
                    value={jadwalForm.deskripsiDetail}
                    onChange={(e) => setJadwalForm((prev) => ({ ...prev, deskripsiDetail: e.target.value }))}
                    className="w-full border-4 border-[#233766] p-3 bg-white h-24"
                  />
                </div>

                {/* KELOLA SESI */}
                <div className="border-4 border-[#233766] bg-white p-6 mb-6 shadow-[4px_4px_0px_0px_#233766]">
                  <h4 className="text-xl font-black uppercase mb-4 text-[#233766]">Sesi Diskusi ({jadwalForm.sesi.length})</h4>

                  {/* List Sesi yang sudah ditambah */}
                  {jadwalForm.sesi.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {jadwalForm.sesi.map((s, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-[#fff3e1] border-2 border-[#233766] p-3">
                          <div>
                            <p className="font-bold text-sm text-[#233766]">{s.judul} ({s.tanggal})</p>
                            <div className="flex gap-2 mt-1">
                              {s.isCurrent && <span className="bg-[#ffb703] border border-[#233766] px-2 py-0.5 text-xs font-black uppercase">Current</span>}
                              {s.isUpcoming && <span className="bg-gray-300 border border-[#233766] px-2 py-0.5 text-xs font-black uppercase">Upcoming</span>}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSesi(idx)}
                            className="bg-[#ff6b6b] text-white border-2 border-[#233766] font-black text-xs px-3 py-1"
                          >
                            Hapus
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Form input Sesi Baru */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <label className="block">
                      <span className="text-xs font-black uppercase text-gray-600">Judul Sesi</span>
                      <input
                        value={tempSesi.judul}
                        onChange={(e) => setTempSesi((prev) => ({ ...prev, judul: e.target.value }))}
                        placeholder="e.g. Sesi 1: Bab 1-3"
                        className="w-full border-2 border-[#233766] p-2 bg-[#fff3e1] text-sm"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-black uppercase text-gray-600">Tanggal & Waktu Mulai</span>
                      <input
                        type="datetime-local"
                        value={tempSesi.tanggal}
                        onChange={(e) => setTempSesi((prev) => ({ ...prev, tanggal: e.target.value }))}
                        className="w-full border-2 border-[#233766] p-2 bg-[#fff3e1] text-sm font-bold"
                      />
                    </label>
                  </div>
                  <div className="flex items-center gap-6 mb-4">
                    <label className="flex items-center gap-2 font-bold text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempSesi.isCurrent}
                        onChange={(e) => setTempSesi((prev) => ({ ...prev, isCurrent: e.target.checked }))}
                        className="w-4 h-4 border-2 border-[#233766]"
                      />
                      Sedang Berlangsung (Current)
                    </label>
                    <label className="flex items-center gap-2 font-bold text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempSesi.isUpcoming}
                        onChange={(e) => setTempSesi((prev) => ({ ...prev, isUpcoming: e.target.checked }))}
                        className="w-4 h-4 border-2 border-[#233766]"
                      />
                      Akan Datang (Upcoming / Belum Mulai)
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={addSesi}
                    className="bg-[#233766] text-white border-2 border-[#233766] px-4 py-2 text-xs font-black uppercase hover:bg-opacity-90 animate-none"
                  >
                    + Tambah Sesi
                  </button>
                </div>

                {/* KELOLA ARSIP */}
                <div className="border-4 border-[#233766] bg-white p-6 mb-6 shadow-[4px_4px_0px_0px_#233766]">
                  <h4 className="text-xl font-black uppercase mb-4 text-[#233766]">Arsip & Bahan Unduhan ({jadwalForm.arsip.length})</h4>

                  {/* List Arsip yang sudah ditambah */}
                  {jadwalForm.arsip.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {jadwalForm.arsip.map((a, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-[#fff3e1] border-2 border-[#233766] p-3">
                          <div>
                            <p className="font-bold text-sm text-[#233766]">
                              <span className="bg-[#ffb703] border border-[#233766] px-1.5 py-0.5 text-xs font-black uppercase mr-2">{a.tipe}</span>
                              {a.judul}
                            </p>
                            {a.url && <p className="text-xs text-blue-800 underline truncate max-w-lg mt-0.5">{a.url}</p>}
                            <p className="text-xs text-gray-600 mt-1">{a.deskripsi}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeArsip(idx)}
                            className="bg-[#ff6b6b] text-white border-2 border-[#233766] font-black text-xs px-3 py-1"
                          >
                            Hapus
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Form input Arsip Baru */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <label className="block">
                      <span className="text-xs font-black uppercase text-gray-600">Tipe Dokumen</span>
                      <select
                        value={tempArsip.tipe}
                        onChange={(e) => setTempArsip((prev) => ({ ...prev, tipe: e.target.value as any }))}
                        className="w-full border-2 border-[#233766] p-2 bg-[#fff3e1] text-sm"
                      >
                        <option value="PDF">PDF</option>
                        <option value="Slide">Slide</option>
                        <option value="Notes">Notes</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-xs font-black uppercase text-gray-600">Nama Dokumen</span>
                      <input
                        value={tempArsip.judul}
                        onChange={(e) => setTempArsip((prev) => ({ ...prev, judul: e.target.value }))}
                        placeholder="e.g. Ringkasan Bab 1"
                        className="w-full border-2 border-[#233766] p-2 bg-[#fff3e1] text-sm"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-black uppercase text-gray-600">URL / Tautan</span>
                      <input
                        type="url"
                        value={tempArsip.url}
                        onChange={(e) => setTempArsip((prev) => ({ ...prev, url: e.target.value }))}
                        placeholder="e.g. https://drive.google.com/..."
                        className="w-full border-2 border-[#233766] p-2 bg-[#fff3e1] text-sm"
                      />
                    </label>
                  </div>
                  <div className="mb-4">
                    <label className="block">
                      <span className="text-xs font-black uppercase text-gray-600">Keterangan / Deskripsi Ringkas</span>
                      <input
                        value={tempArsip.deskripsi}
                        onChange={(e) => setTempArsip((prev) => ({ ...prev, deskripsi: e.target.value }))}
                        placeholder="e.g. File PDF berisi catatan dan visualisasi konsep"
                        className="w-full border-2 border-[#233766] p-2 bg-[#fff3e1] text-sm"
                      />
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={addArsip}
                    className="bg-[#233766] text-white border-2 border-[#233766] px-4 py-2 text-xs font-black uppercase hover:bg-opacity-90"
                  >
                    + Tambah Arsip
                  </button>
                </div>

                <div className="flex gap-4 flex-wrap">
                  <button
                    type="submit"
                    className="bg-[#233766] text-[#fff3e1] px-6 py-3 border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] uppercase font-black hover:shadow-[4px_4px_0px_0px_#233766] transition-all"
                  >
                    {editingJadwalId ? "Perbarui Jadwal" : "Tambah Jadwal"}
                  </button>
                  <button
                    type="button"
                    onClick={resetJadwalForm}
                    className="bg-[#fff3e1] text-[#233766] px-6 py-3 border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] uppercase font-black hover:shadow-[4px_4px_0px_0px_#233766] transition-all"
                  >
                    Reset Form
                  </button>
                </div>
              </form>
            </div>

            {/* Daftar Jadwal */}
            <div>
              <h3 className="text-2xl font-black uppercase mb-6 text-[#233766]">Daftar Jadwal ({jadwalItems.length})</h3>
              <div className="grid grid-cols-1 gap-6">
                {jadwalItems.length === 0 ? (
                  <div className="p-8 bg-[#fff3e1] border-4 border-[#233766] text-center font-black uppercase text-[#96582e]">
                    Belum ada jadwal. Tambahkan jadwal baru di atas.
                  </div>
                ) : (
                  jadwalItems.map((item) => (
                    <div key={item.id} className="bg-white border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] p-6">
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div className="flex-1">
                          <h4 className="text-2xl font-black uppercase text-[#233766]">{item.periode}</h4>
                          <p className="text-lg font-bold text-[#233766] mt-1">{item.judul}</p>
                          <p className="text-sm font-semibold text-[#96582e] mt-2">Oleh: {item.penulis}</p>
                          <span
                            className={`inline-block mt-3 px-3 py-1 text-xs font-black uppercase border-4 ${item.status === "Berjalan"
                              ? "bg-[#ffb703] text-[#233766] border-[#ffb703]"
                              : item.status === "Selesai"
                                ? "bg-gray-300 text-[#233766] border-gray-300"
                                : "bg-blue-200 text-[#233766] border-blue-300"
                              }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditJadwal(item)}
                            className="bg-[#ffb703] text-[#233766] px-4 py-2 border-4 border-[#ffb703] font-black uppercase text-sm"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteJadwalItem(item.id)}
                            className="bg-[#ff6b6b] text-[#fff3e1] px-4 py-2 border-4 border-[#ff6b6b] font-black uppercase text-sm"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-[#233766] border-t-4 border-dashed border-[#96582e] pt-3 mt-3">
                        <span className="font-bold">Tema:</span> {item.tema}
                      </p>

                      {/* List Pendaftar (Hanya tampil untuk status Berjalan/Akan Datang) */}
                      {item.status !== "Selesai" && (
                        <div className="mt-4 pt-3 border-t-4 border-dashed border-[#233766]">
                          <p className="font-black text-sm uppercase text-[#233766] mb-2">
                            👥 Pendaftar ({registrations.filter((r) => r.jadwalId === item.id).length})
                          </p>
                          {registrations.filter((r) => r.jadwalId === item.id).length > 0 ? (
                            <div className="bg-[#fff3e1] border-2 border-[#233766] p-3 max-h-40 overflow-y-auto space-y-1">
                              {registrations.filter((r) => r.jadwalId === item.id).map((reg) => (
                                <div key={reg.id} className="text-xs font-bold text-[#233766] flex justify-between">
                                  <span>{reg.userName}</span>
                                  <span className="text-[#96582e] font-semibold">{reg.userEmail}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs font-bold text-gray-500 uppercase">Belum ada pendaftar.</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        {/* PUSTAKA TAB */}
        {activeTab === "pustaka" && (
          <section className="space-y-8">
            <div>
              <h2 className="text-4xl font-black uppercase mb-6 text-[#233766]">Kelola Pustaka</h2>

              {/* Form Tambah/Edit Pustaka */}
              <form
                onSubmit={handlePustakaSubmit}
                className="bg-[#fff3e1] border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] p-8 mb-10"
              >
                <h3 className="text-2xl font-black uppercase mb-6 text-[#233766]">
                  {editingPustakaId ? "Edit Pustaka" : "Tambah Pustaka Baru"}
                </h3>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <label className="block">
                    <span className="text-sm font-black uppercase text-[#233766]">Judul</span>
                    <input
                      value={pustakaForm.judul}
                      onChange={(e) => setPustakaForm((prev) => ({ ...prev, judul: e.target.value }))}
                      className="w-full border-4 border-[#233766] p-3 bg-white"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-black uppercase text-[#233766]">Jenis</span>
                    <select
                      value={pustakaForm.jenis}
                      onChange={(e) => setPustakaForm((prev) => ({ ...prev, jenis: e.target.value }))}
                      className="w-full border-4 border-[#233766] p-3 bg-white"
                      required
                    >
                      <option value="Ringkasan">Ringkasan</option>
                      <option value="Artikel">Artikel</option>
                      <option value="Video">Video</option>
                      <option value="Podcast">Podcast</option>
                      <option value="Repository">Repository</option>
                    </select>
                  </label>
                </div>

                <div className="mb-6">
                  <span className="text-sm font-black uppercase text-[#233766]">Ringkasan</span>
                  <textarea
                    value={pustakaForm.ringkasan}
                    onChange={(e) => setPustakaForm((prev) => ({ ...prev, ringkasan: e.target.value }))}
                    className="w-full border-4 border-[#233766] p-3 bg-white h-24"
                    required
                  />
                </div>

                <div className="mb-6">
                  <span className="text-sm font-black uppercase text-[#233766]">URL File Drive (Opsional)</span>
                  <input
                    type="url"
                    value={pustakaForm.fileUrl}
                    onChange={(e) => setPustakaForm((prev) => ({ ...prev, fileUrl: e.target.value }))}
                    className="w-full border-4 border-[#233766] p-3 bg-white"
                  />
                </div>

                <div className="flex gap-4 flex-wrap">
                  <button
                    type="submit"
                    className="bg-[#233766] text-[#fff3e1] px-6 py-3 border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] uppercase font-black hover:shadow-[4px_4px_0px_0px_#233766] transition-all"
                  >
                    {editingPustakaId ? "Perbarui Pustaka" : "Tambah Pustaka"}
                  </button>
                  <button
                    type="button"
                    onClick={resetPustakaForm}
                    className="bg-[#fff3e1] text-[#233766] px-6 py-3 border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] uppercase font-black hover:shadow-[4px_4px_0px_0px_#233766] transition-all"
                  >
                    Reset Form
                  </button>
                </div>
              </form>
            </div>

            {/* Daftar Pustaka */}
            <div>
              <h3 className="text-2xl font-black uppercase mb-6 text-[#233766]">Daftar Pustaka ({pustakaItems.length})</h3>
              <div className="grid grid-cols-3 gap-6">
                {pustakaItems.length === 0 ? (
                  <div className="col-span-3 p-8 bg-[#fff3e1] border-4 border-[#233766] text-center font-black uppercase text-[#96582e]">
                    Belum ada pustaka. Tambahkan pustaka baru di atas.
                  </div>
                ) : (
                  pustakaItems.map((item) => (
                    <div key={item.id} className="bg-white border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] p-6 flex flex-col gap-4">
                      <div className="bg-[#233766] text-[#fff3e1] uppercase font-black px-3 py-1 border-4 border-[#233766] inline-block text-xs w-max">
                        {item.jenis}
                      </div>
                      <h4 className="text-lg font-black uppercase text-[#233766]">{item.judul}</h4>
                      <p className="text-sm font-semibold text-[#233766] leading-relaxed flex-1">{item.ringkasan}</p>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleEditPustaka(item)}
                          className="flex-1 bg-[#ffb703] text-[#233766] px-3 py-2 border-4 border-[#ffb703] font-black uppercase text-sm"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deletePustakaItem(item.id)}
                          className="flex-1 bg-[#ff6b6b] text-[#fff3e1] px-3 py-2 border-4 border-[#ff6b6b] font-black uppercase text-sm"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
