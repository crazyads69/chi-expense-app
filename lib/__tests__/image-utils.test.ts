jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn(),
  SaveFormat: { JPEG: 'jpeg', PNG: 'png' },
}));

import { validateImage, MAX_FILE_SIZE_MB } from '../image-utils';

describe('validateImage', () => {
  it('accepts valid image extensions', () => {
    const result = validateImage('file.jpg');
    expect(result.valid).toBe(true);
  });

  it('accepts png files', () => {
    const result = validateImage('receipt.PNG');
    expect(result.valid).toBe(true);
  });

  it('rejects invalid extensions', () => {
    const result = validateImage('file.pdf');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('valid image file');
  });

  it('rejects files exceeding max size', () => {
    const oversized = (MAX_FILE_SIZE_MB + 1) * 1024 * 1024;
    const result = validateImage('file.jpg', oversized);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('smaller than');
  });

  it('accepts files within size limit', () => {
    const validSize = 1024 * 1024;
    const result = validateImage('file.jpg', validSize);
    expect(result.valid).toBe(true);
  });

  it('accepts when fileSize is undefined', () => {
    const result = validateImage('file.webp');
    expect(result.valid).toBe(true);
  });
});
