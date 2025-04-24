import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from 'crypto';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// Hàm chuyển đổi emoji thành mã Unicode
export const emojiToUnicode = (emoji: string) => {
  return emoji.split('').map(char => {
    const code = char.codePointAt(0)?.toString(16);
    return code ? `\\u${code.padStart(4, '0')}` : char;
  }).join('');
};
// Hàm chuyển đổi mã Unicode thành emoji
export const unicodeToEmoji = (unicodeStr: string) => {
  try {
    return unicodeStr.split('\\u').map(code => {
      if (code) {
        const charCode = parseInt(code, 16);
        return String.fromCodePoint(charCode);
      }
      return '';
    }).join('');
  } catch (error) {
    return unicodeStr;
  }
};

export function encrypt(data: string) {
  return crypto.createHash('sha256').update(data).digest('hex');
}
export function decrypt(data: string) {
  return crypto.createHash('sha256').update(data).digest('hex');
}
