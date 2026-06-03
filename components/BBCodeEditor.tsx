"use client";

import React, { useRef } from "react";
import BBCodeParser from "@/components/BBCodeParser"; // <-- Import Parser untuk Live Preview

interface BBCodeEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export default function BBCodeEditor({ value, onChange, placeholder, disabled }: BBCodeEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertTag = (tag: string, template?: string, cursorOffsetAdjust?: number) => {
        if (!textareaRef.current || disabled) return;

        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const text = textareaRef.current.value;

        const selectedText = text.substring(start, end);
        const before = text.substring(0, start);
        const after = text.substring(end, text.length);

        let newText = "";
        let cursorOffset = 0;

        if (template) {
            newText = `${before}${template}${after}`;
            cursorOffset = before.length + (cursorOffsetAdjust || template.length);
        }
        else if (tag === "url") {
            const urlText = selectedText || "Teks Tautan";
            newText = `${before}[url=https://]${urlText}[/url]${after}`;
            cursorOffset = before.length + 12;
        } else if (tag === "img") {
            newText = `${before}[img]${selectedText || "URL_GAMBAR"}[/img]${after}`;
            cursorOffset = before.length + 5;
        } else if (tag === "youtube") {
            newText = `${before}[youtube]${selectedText || "ID_VIDEO"}[/youtube]${after}`;
            cursorOffset = before.length + 9;
        } else if (tag === "size") {
            newText = `${before}[size=20]${selectedText || "Teks Besar"}[/size]${after}`;
            cursorOffset = before.length + 6;
        } else if (tag === "color") {
            newText = `${before}[color=red]${selectedText || "Teks Merah"}[/color]${after}`;
            cursorOffset = before.length + 7;
        }
        else {
            newText = `${before}[${tag}]${selectedText}[/${tag}]${after}`;
            cursorOffset = selectedText ? newText.length - after.length : before.length + tag.length + 2;
        }

        onChange(newText);

        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(cursorOffset, cursorOffset);
            }
        }, 0);
    };

    const btnClass = "font-black px-2 py-1 border-2 border-[#233766] bg-white hover:bg-[#ffb703] transition-colors disabled:opacity-50 text-sm";

    return (
        <div className="border-4 border-[#233766] bg-white flex flex-col shadow-[4px_4px_0px_0px_#233766]">
            {/* Toolbar BBCode */}
            <div className="flex flex-wrap gap-2 p-2 border-b-4 border-[#233766] bg-[#fff3e1]">
                <div className="flex gap-1 border-r-4 border-[#233766] pr-2">
                    <button type="button" onClick={() => insertTag("b")} disabled={disabled} className={btnClass} title="Tebal">B</button>
                    <button type="button" onClick={() => insertTag("i")} disabled={disabled} className={`${btnClass} italic`} title="Miring">I</button>
                    <button type="button" onClick={() => insertTag("u")} disabled={disabled} className={`${btnClass} underline`} title="Garis Bawah">U</button>
                    <button type="button" onClick={() => insertTag("s")} disabled={disabled} className={`${btnClass} line-through`} title="Coret">S</button>
                </div>

                <div className="flex gap-1 border-r-4 border-[#233766] pr-2">
                    <button type="button" onClick={() => insertTag("size")} disabled={disabled} className={btnClass} title="Ukuran Font">Tz</button>
                    <button type="button" onClick={() => insertTag("color")} disabled={disabled} className={btnClass} title="Warna Font">Warna</button>
                    <button type="button" onClick={() => insertTag("left")} disabled={disabled} className={btnClass} title="Rata Kiri">L</button>
                    <button type="button" onClick={() => insertTag("center")} disabled={disabled} className={btnClass} title="Rata Tengah">C</button>
                    <button type="button" onClick={() => insertTag("right")} disabled={disabled} className={btnClass} title="Rata Kanan">R</button>
                </div>

                <div className="flex gap-1 border-r-4 border-[#233766] pr-2">
                    <button type="button" onClick={() => insertTag("quote")} disabled={disabled} className={btnClass} title="Kutipan">Quote</button>
                    <button type="button" onClick={() => insertTag("spoiler")} disabled={disabled} className={btnClass} title="Sembunyikan">Spoiler</button>
                    <button type="button" onClick={() => insertTag("code")} disabled={disabled} className={btnClass} title="Blok Kode">&lt;/&gt;</button>
                </div>

                <div className="flex gap-1 border-r-4 border-[#233766] pr-2">
                    <button type="button" onClick={() => insertTag("url")} disabled={disabled} className={btnClass} title="Tautan / Link">URL</button>
                    <button type="button" onClick={() => insertTag("img")} disabled={disabled} className={btnClass} title="Gambar">IMG</button>
                    <button type="button" onClick={() => insertTag("youtube")} disabled={disabled} className={btnClass} title="Video YouTube">YT</button>
                </div>

                <div className="flex gap-1">
                    <button type="button" onClick={() => insertTag("", "[ul]\n  [li]Item 1[/li]\n  [li]Item 2[/li]\n[/ul]\n", 9)} disabled={disabled} className={btnClass} title="Daftar Bullet">List</button>
                    <button type="button" onClick={() => insertTag("", "[table]\n  [tr]\n    [th]Header 1[/th]\n    [th]Header 2[/th]\n  [/tr]\n  [tr]\n    [td]Data 1[/td]\n    [td]Data 2[/td]\n  [/tr]\n[/table]\n", 12)} disabled={disabled} className={btnClass} title="Tabel">Table</button>
                </div>
            </div>

            {/* Area Teks Utama */}
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                placeholder={placeholder}
                className="w-full h-56 p-4 outline-none resize-y bg-transparent leading-relaxed"
                required
            />

            {/* --- BAGIAN LIVE PREVIEW --- */}
            {value.trim() !== "" && (
                <div className="border-t-4 border-[#233766] bg-gray-50 flex flex-col max-h-72">
                    <div className="bg-[#233766] text-[#fff3e1] text-xs font-black uppercase px-3 py-1 flex-shrink-0">
                        Live Preview
                    </div>
                    <div className="p-4 overflow-y-auto flex-grow">
                        <BBCodeParser content={value} />
                    </div>
                </div>
            )}
        </div>
    );
}