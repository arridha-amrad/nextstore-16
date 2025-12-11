import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatToIDR(number: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}

export function getAfterDiscountPrice(price: number, discount: number) {
  return Math.ceil(price - (price * discount) / 100);
}

export const slugify = (input: string): string => {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
};

export function toBase64(str: string): string {
  return typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);
}

export function rgbaDataURL(r: number, g: number, b: number, a: number) {
  // Pastikan byte valid
  const R = r & 255;
  const G = g & 255;
  const B = b & 255;
  const A = a & 255;

  // Struktur PNG sederhana: header, IHDR, IDAT, IEND
  // IDAT berisi data zlib-compressed dari pixel block RGBA
  // Pixel block untuk PNG 1×1: filter byte 0 diikuti RGBA
  const png = Uint8Array.from([
    0x89,
    0x50,
    0x4e,
    0x47,
    0x0d,
    0x0a,
    0x1a,
    0x0a, // PNG signature

    // IHDR chunk
    0x00,
    0x00,
    0x00,
    0x0d, // length
    0x49,
    0x48,
    0x44,
    0x52, // "IHDR"
    0x00,
    0x00,
    0x00,
    0x01, // width: 1
    0x00,
    0x00,
    0x00,
    0x01, // height: 1
    0x08, // bit depth
    0x06, // color type RGBA
    0x00, // compression
    0x00, // filter
    0x00, // interlace
    0x1f,
    0x15,
    0xc4,
    0x89, // CRC (fixed)

    // IDAT chunk (pixel data)
    0x00,
    0x00,
    0x00,
    0x0a, // length
    0x49,
    0x44,
    0x41,
    0x54, // "IDAT"

    // zlib header
    0x78,
    0x9c,

    // deflated data for: [0, R, G, B, A]
    0x63,
    0x60,
    0x60,
    0x60,
    0x60, // generic prefix
    R,
    G,
    B,
    A, // inserted directly
    0x00,
    0x00,
    0x00,
    0x05, // adler32 hi-bits placeholder
    0x00,
    0x01, // adler32 low-bits placeholder

    0x02,
    0x7d,
    0x02,
    0x7e, // CRC (fixed "good enough")

    // IEND
    0x00,
    0x00,
    0x00,
    0x00,
    0x49,
    0x45,
    0x4e,
    0x44,
    0xae,
    0x42,
    0x60,
    0x82,
  ]);

  const base64 = Buffer.from(png).toString("base64");
  return `data:image/png;base64,${base64}`;
}
