import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from 'crypto';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function encrypt(data: string) {
  return crypto.createHash('sha256').update(data).digest('hex');
}
export function decrypt(data: string) {
  return crypto.createHash('sha256').update(data).digest('hex');
}
