import React from "react";

interface BBCodeParserProps {
    content: string;
}

export default function BBCodeParser({ content }: BBCodeParserProps) {
    if (!content) return null;

    // 1. Mencegah XSS (Ubah tag HTML mentah menjadi teks biasa)
    let parsedText = content
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // 2. Daftar RegEx BBCode (Urutan sangat penting!)

    // Format Teks Dasar
    parsedText = parsedText
        .replace(/\[b\]([\s\S]*?)\[\/b\]/gi, "<strong>$1</strong>")
        .replace(/\[i\]([\s\S]*?)\[\/i\]/gi, "<em>$1</em>")
        .replace(/\[u\]([\s\S]*?)\[\/u\]/gi, "<span class='underline'>$1</span>")
        .replace(/\[s\]([\s\S]*?)\[\/s\]/gi, "<del>$1</del>")
        .replace(/\[size=([0-9]+)\]([\s\S]*?)\[\/size\]/gi, "<span style='font-size: $1px'>$2</span>")
        .replace(/\[style size=([0-9]+)\]([\s\S]*?)\[\/style\]/gi, "<span style='font-size: $1px'>$2</span>")
        .replace(/\[color=([^\]]+)\]([\s\S]*?)\[\/color\]/gi, "<span style='color: $1'>$2</span>")
        .replace(/\[style color=([^\]]+)\]([\s\S]*?)\[\/style\]/gi, "<span style='color: $1'>$2</span>");

    // Perataan Teks (Alignment)
    parsedText = parsedText
        .replace(/\[center\]([\s\S]*?)\[\/center\]/gi, "<div class='text-center'>$1</div>")
        .replace(/\[left\]([\s\S]*?)\[\/left\]/gi, "<div class='text-left'>$1</div>")
        .replace(/\[right\]([\s\S]*?)\[\/right\]/gi, "<div class='text-right'>$1</div>");

    // Quote (Kutipan)
    parsedText = parsedText
        .replace(
            /\[quote=([^\]]+)\]([\s\S]*?)\[\/quote\]/gi,
            "<blockquote class='border-4 border-[#233766] p-4 bg-white shadow-[4px_4px_0px_0px_#233766] my-4'><div class='font-black bg-[#ffb703] text-[#233766] px-2 py-1 mb-2 inline-block border-2 border-[#233766]'>$1 menulis:</div><br/>$2</blockquote>"
        )
        .replace(
            /\[quote\]([\s\S]*?)\[\/quote\]/gi,
            "<blockquote class='border-4 border-[#233766] p-4 bg-white shadow-[4px_4px_0px_0px_#233766] my-4 font-semibold italic border-l-8'>$1</blockquote>"
        );

    // Spoiler (Disembunyikan)
    parsedText = parsedText
        .replace(
            /\[spoiler=([^\]]+)\]([\s\S]*?)\[\/spoiler\]/gi,
            "<details class='border-4 border-[#233766] bg-white p-4 my-4 shadow-[4px_4px_0px_0px_#233766] cursor-pointer group'><summary class='font-black outline-none select-none'>$1 <span class='text-xs bg-[#233766] text-[#fff3e1] px-2 py-1 ml-2'>Klik untuk melihat</span></summary><div class='mt-4 pt-4 border-t-4 border-[#233766]'>$2</div></details>"
        )
        .replace(
            /\[spoiler\]([\s\S]*?)\[\/spoiler\]/gi,
            "<details class='border-4 border-[#233766] bg-white p-4 my-4 shadow-[4px_4px_0px_0px_#233766] cursor-pointer group'><summary class='font-black outline-none select-none'>SPOILER <span class='text-xs bg-[#233766] text-[#fff3e1] px-2 py-1 ml-2'>Klik untuk membuka</span></summary><div class='mt-4 pt-4 border-t-4 border-[#233766]'>$1</div></details>"
        );

    // Tautan & Gambar
    parsedText = parsedText
        .replace(
            /\[url=([^\]]+)\]([\s\S]*?)\[\/url\]/gi,
            "<a href='$1' target='_blank' rel='noopener noreferrer' class='text-[#96582e] font-black underline decoration-2 hover:bg-[#ffb703] transition-colors'>$2</a>"
        )
        .replace(
            /\[url\]([\s\S]*?)\[\/url\]/gi,
            "<a href='$1' target='_blank' rel='noopener noreferrer' class='text-[#96582e] font-black underline decoration-2 hover:bg-[#ffb703] transition-colors'>$1</a>"
        )
        .replace(
            /\[img=([0-9]+)x([0-9]+)\]([\s\S]*?)\[\/img\]/gi,
            "<img src='$3' width='$1' height='$2' class='border-4 border-[#233766] shadow-[4px_4px_0px_0px_#233766] my-4 max-w-full' alt='Image' />"
        )
        .replace(
            /\[img width=([0-9]+) height=([0-9]+)[^\]]*\]([\s\S]*?)\[\/img\]/gi,
            "<img src='$3' width='$1' height='$2' class='border-4 border-[#233766] shadow-[4px_4px_0px_0px_#233766] my-4 max-w-full' alt='Image' />"
        )
        .replace(
            /\[img\]([\s\S]*?)\[\/img\]/gi,
            "<img src='$1' class='border-4 border-[#233766] shadow-[4px_4px_0px_0px_#233766] my-4 max-w-full' alt='Image' />"
        );

    // YouTube (Embed)
    parsedText = parsedText.replace(
        /\[youtube\]([\s\S]*?)\[\/youtube\]/gi,
        "<div class='relative w-full pb-[56.25%] h-0 my-4 border-4 border-[#233766] shadow-[8px_8px_0px_0px_#233766] bg-black'><iframe src='https://www.youtube.com/embed/$1' class='absolute top-0 left-0 w-full h-full border-none' allowfullscreen></iframe></div>"
    );

    // Tabel Neo-Brutalism
    parsedText = parsedText
        .replace(/\[table\]([\s\S]*?)\[\/table\]/gi, "<div class='overflow-x-auto my-4'><table class='w-full border-collapse border-4 border-[#233766] text-left bg-white'>$1</table></div>")
        .replace(/\[tr\]([\s\S]*?)\[\/tr\]/gi, "<tr class='border-b-4 border-[#233766]'>$1</tr>")
        .replace(/\[th\]([\s\S]*?)\[\/th\]/gi, "<th class='border-r-4 border-[#233766] p-3 bg-[#ffb703] font-black uppercase'>$1</th>")
        .replace(/\[td\]([\s\S]*?)\[\/td\]/gi, "<td class='border-r-4 border-[#233766] p-3 font-semibold'>$1</td>");

    // Code & Preformatted
    parsedText = parsedText
        .replace(
            /\[code=([^\]]+)\]([\s\S]*?)\[\/code\]/gi,
            "<div class='my-4 border-4 border-[#233766] shadow-[4px_4px_0px_0px_#233766] bg-gray-100'><div class='bg-[#233766] text-[#fff3e1] px-3 py-1 text-xs font-black uppercase'>$1</div><pre class='p-4 overflow-x-auto font-mono text-sm'><code>$2</code></pre></div>"
        )
        .replace(
            /\[code\]([\s\S]*?)\[\/code\]/gi,
            "<pre class='bg-gray-100 border-4 border-[#233766] p-4 my-4 overflow-x-auto font-mono text-sm shadow-[4px_4px_0px_0px_#233766]'><code>$1</code></pre>"
        )
        .replace(
            /\[pre\]([\s\S]*?)\[\/pre\]/gi,
            "<pre class='whitespace-pre-wrap font-mono my-4 p-4 bg-white border-2 border-[#233766]'>$1</pre>"
        );

    // List (Daftar) - Dijalankan sebelum konversi baris baru
    parsedText = parsedText
        .replace(/\[ul\]([\s\S]*?)\[\/ul\]/gi, "<ul class='list-disc pl-8 my-4 space-y-1 font-semibold marker:text-[#96582e]'>$1</ul>")
        .replace(/\[ol\]([\s\S]*?)\[\/ol\]/gi, "<ol class='list-decimal pl-8 my-4 space-y-1 font-semibold marker:text-[#233766] font-black'>$1</ol>")
        .replace(/\[list\]([\s\S]*?)\[\/list\]/gi, "<ul class='list-disc pl-8 my-4 space-y-1 font-semibold'>$1</ul>")
        .replace(/\[li\]([\s\S]*?)\[\/li\]/gi, "<li>$1</li>")
        .replace(/\[\*\](.*?)(?=\[|$|\n)/gi, "<li>$1</li>"); // Shorthand list item

    // 3. Mengubah Enter/Line Break menjadi <br />
    // (Kecuali jika line break tersebut berada tepat di sebelah tag block HTML)
    parsedText = parsedText
        .replace(/\n/g, "<br />")
        .replace(/(<br \/>\s*)+(?=<\/?(div|table|tbody|tr|th|td|ul|ol|li|blockquote|pre|details|summary))/gi, "")
        .replace(/(<\/?(div|table|tbody|tr|th|td|ul|ol|li|blockquote|pre|details|summary)[^>]*>)\s*(<br \/>)+/gi, "$1");

    return (
        <div
            className="text-base leading-relaxed break-words forum-content"
            dangerouslySetInnerHTML={{ __html: parsedText }}
        />
    );
}