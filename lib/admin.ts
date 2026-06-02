import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  QuerySnapshot,
  DocumentData,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";

export type JadwalAdminItem = {
  id: string;
  periode: string;
  judul: string;
  penulis: string;
  tema: string;
  status: "Selesai" | "Berjalan" | "Akan Datang";
  coverLabel?: string;
  kategoriAtauPenerbit?: string;
  tahunAtauIsbn?: string;
  deskripsiDetail?: string;
  sesi?: Array<{
    judul: string;
    tanggal: string;
    isUpcoming?: boolean;
    isCurrent?: boolean;
  }>;
  arsip?: Array<{
    tipe: "PDF" | "Slide" | "Notes";
    judul: string;
    deskripsi: string;
    url?: string;
  }>;
};

export type PustakaAdminItem = {
  id: string;
  judul: string;
  jenis: string;
  ringkasan: string;
  fileUrl?: string;
};

const jadwalCollection = collection(db, "jadwal");
const pustakaCollection = collection(db, "pustaka");
const jadwalQuery = query(jadwalCollection, orderBy("createdAt", "desc"));
const pustakaQuery = query(pustakaCollection, orderBy("createdAt", "desc"));

export const listenJadwalItems = (callback: (items: JadwalAdminItem[]) => void) => {
  return onSnapshot(jadwalQuery, (snapshot: QuerySnapshot<DocumentData>) => {
    const items = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        periode: data.periode || "",
        judul: data.judul || "",
        penulis: data.penulis || "",
        tema: data.tema || "",
        status: data.status || "Akan Datang",
        coverLabel: data.coverLabel || "",
        kategoriAtauPenerbit: data.kategoriAtauPenerbit || "",
        tahunAtauIsbn: data.tahunAtauIsbn || "",
        deskripsiDetail: data.deskripsiDetail || "",
        sesi: data.sesi || [],
        arsip: data.arsip || [],
      } as JadwalAdminItem;
    });
    callback(items);
  });
};

export const listenPustakaItems = (callback: (items: PustakaAdminItem[]) => void) => {
  return onSnapshot(pustakaQuery, (snapshot: QuerySnapshot<DocumentData>) => {
    const items = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        judul: data.judul || "",
        jenis: data.jenis || "Umum",
        ringkasan: data.ringkasan || "",
        fileUrl: data.fileUrl || data.sumberUrl || "",
      } as PustakaAdminItem;
    });
    callback(items);
  });
};

export const createJadwalItem = async (item: Omit<JadwalAdminItem, "id">) => {
  await addDoc(jadwalCollection, {
    ...item,
    createdAt: serverTimestamp(),
  });
};

export const updateJadwalItem = async (id: string, item: Omit<JadwalAdminItem, "id">) => {
  const ref = doc(db, "jadwal", id);
  await updateDoc(ref, {
    ...item,
    updatedAt: serverTimestamp(),
  });
};

export const deleteJadwalItem = async (id: string) => {
  const ref = doc(db, "jadwal", id);
  await deleteDoc(ref);
};

export const createPustakaItem = async (item: Omit<PustakaAdminItem, "id">) => {
  await addDoc(pustakaCollection, {
    ...item,
    createdAt: serverTimestamp(),
  });
};

export const updatePustakaItem = async (id: string, item: Omit<PustakaAdminItem, "id">) => {
  const ref = doc(db, "pustaka", id);
  await updateDoc(ref, {
    ...item,
    updatedAt: serverTimestamp(),
  });
};

export const deletePustakaItem = async (id: string) => {
  const ref = doc(db, "pustaka", id);
  await deleteDoc(ref);
};

export type RegistrasiItem = {
  id: string;
  jadwalId: string;
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: Date;
};

export const registerJadwal = async (jadwalId: string, userId: string, userName: string, userEmail: string) => {
  const registrationsCollection = collection(db, "registrations");
  // Check if already registered
  const q = query(registrationsCollection, where("jadwalId", "==", jadwalId), where("userId", "==", userId));
  const snap = await getDocs(q);
  if (!snap.empty) {
    return; // Already registered
  }
  await addDoc(registrationsCollection, {
    jadwalId,
    userId,
    userName,
    userEmail,
    createdAt: serverTimestamp(),
  });
};

export const unregisterJadwal = async (jadwalId: string, userId: string) => {
  const registrationsCollection = collection(db, "registrations");
  const q = query(registrationsCollection, where("jadwalId", "==", jadwalId), where("userId", "==", userId));
  const snap = await getDocs(q);
  if (!snap.empty) {
    const docId = snap.docs[0].id;
    await deleteDoc(doc(db, "registrations", docId));
  }
};

export const listenUserRegistrations = (userId: string, callback: (registeredJadwalIds: string[]) => void) => {
  const registrationsCollection = collection(db, "registrations");
  const q = query(registrationsCollection, where("userId", "==", userId));
  return onSnapshot(q, (snapshot) => {
    const ids = snapshot.docs.map((docSnap) => docSnap.data().jadwalId as string);
    callback(ids);
  });
};

export const listenAllRegistrations = (callback: (regs: RegistrasiItem[]) => void) => {
  const registrationsCollection = collection(db, "registrations");
  return onSnapshot(registrationsCollection, (snapshot) => {
    const regs = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        jadwalId: data.jadwalId || "",
        userId: data.userId || "",
        userName: data.userName || "",
        userEmail: data.userEmail || "",
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
      } as RegistrasiItem;
    });
    callback(regs);
  });
};
