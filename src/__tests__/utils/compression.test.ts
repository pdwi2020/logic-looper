import {
  compress,
  compressObject,
  decompress,
  decompressObject,
} from '@/utils/compression';

describe('utils/compression', () => {
  it('compress/decompress round-trip', () => {
    const input = 'Logic Looper test payload with symbols: !@#$%^&*()';
    const compressed = compress(input);
    const restored = decompress(compressed);

    expect(typeof compressed).toBe('string');
    expect(restored).toBe(input);
  });

  it('compressObject/decompressObject round-trip', () => {
    const payload = {
      name: 'logic-looper',
      values: [1, 2, 3, 4],
      flags: { solved: true, synced: false },
    };

    const compressed = compressObject(payload);
    const restored = decompressObject<typeof payload>(compressed);

    expect(restored).toEqual(payload);
  });

  it('handles empty string', () => {
    const compressed = compress('');
    const restored = decompress(compressed);

    expect(restored).toBe('');
  });

  it('handles large strings', () => {
    const large = 'abcdef1234567890'.repeat(10_000);
    const compressed = compress(large);
    const restored = decompress(compressed);

    expect(restored).toBe(large);
    expect(compressed.length).toBeLessThan(large.length);
  });

  it('decompressObject throws for invalid compressed payload', () => {
    expect(() => decompressObject('not-valid-compressed-data')).toThrow(
      'Failed to decompress data.',
    );
  });
});
