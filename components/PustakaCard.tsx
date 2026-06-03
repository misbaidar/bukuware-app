import React from 'react';
import { PustakaAdminItem } from '@/lib/admin';

interface PustakaCardProps {
  item: PustakaAdminItem;
}

export default function PustakaCard({ item }: PustakaCardProps) {
  // Determine tag styling based on `jenis`
  let tagBg = "bg-[#233766]";
  let tagText = "text-[#fff3e1]";
  let tagBorder = "border-[#233766]";

  const jenisLower = item.jenis.toLowerCase();

  if (jenisLower.includes("ringkasan")) {
    tagBg = "bg-[#ffb703]";
    tagText = "text-[#233766]";
  } else if (jenisLower.includes("artikel")) {
    tagBg = "bg-[#96582e]";
    tagText = "text-white";
  } else if (jenisLower.includes("video")) {
    tagBg = "bg-[#233766]";
    tagText = "text-white";
  } else if (jenisLower.includes("podcast")) {
    tagBg = "bg-[#ffb703]";
    tagText = "text-[#233766]";
  } else if (jenisLower.includes("repository")) {
    tagBg = "bg-[#96582e]";
    tagText = "text-white";
  }

  return (
    <div className="bg-[#fff3e1] border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] p-6 flex flex-col gap-4 min-h-[300px]">
      <div className={`${tagBg} ${tagText} uppercase font-black px-3 py-1 border-2 ${tagBorder} inline-block text-xs w-max tracking-wider`}>
        {item.jenis}
      </div>

      <h3 className="text-2xl font-black uppercase text-[#233766] leading-tight mb-2">
        {item.judul}
      </h3>

      <p className="text-sm font-semibold text-[#233766] leading-relaxed flex-1">
        {item.ringkasan}
      </p>

      <div className="mt-4">
        {item.fileUrl ? (
          <a
            href={item.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="block w-full bg-[#233766] text-white font-black px-4 py-4 border-2 border-[#233766] shadow-[4px_4px_0px_0px_#233766] uppercase text-center hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all tracking-wider"
          >
            BUKA
          </a>
        ) : (
          <button
            disabled
            className="block w-full bg-[#233766] text-white font-black px-4 py-4 border-2 border-[#233766] shadow-[4px_4px_0px_0px_#233766] uppercase text-center opacity-50 cursor-not-allowed tracking-wider"
          >
            TIDAK TERSEDIA
          </button>
        )}
      </div>
    </div>
  );
}
