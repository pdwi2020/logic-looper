import * as LZString from 'lz-string';

export function compress(data: string): string {
  return LZString.compressToUTF16(data);
}

export function decompress(data: string): string {
  return LZString.decompressFromUTF16(data) ?? '';
}

export function compressObject<T>(obj: T): string {
  return compress(JSON.stringify(obj));
}

export function decompressObject<T>(data: string): T {
  const decompressed = decompress(data);

  if (!decompressed) {
    throw new Error('Failed to decompress data.');
  }

  return JSON.parse(decompressed) as T;
}
