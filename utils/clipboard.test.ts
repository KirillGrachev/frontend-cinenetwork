import { describe, it, expect, vi, beforeEach } from 'vitest';
import { copyToClipboard } from './clipboard';

describe('copyToClipboard', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('uses the async Clipboard API when available', async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(navigator, 'clipboard', {
            value: { writeText },
            configurable: true,
        });

        await expect(copyToClipboard('hello')).resolves.toBe(true);
        expect(writeText).toHaveBeenCalledWith('hello');
    });

    it('falls back to execCommand when the Clipboard API rejects', async () => {
        Object.defineProperty(navigator, 'clipboard', {
            value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
            configurable: true,
        });
        const execCommand = vi.fn().mockReturnValue(true);
        document.execCommand = execCommand;

        await expect(copyToClipboard('hello')).resolves.toBe(true);
        expect(execCommand).toHaveBeenCalledWith('copy');
    });

    it('falls back to execCommand when the Clipboard API is absent', async () => {
        Object.defineProperty(navigator, 'clipboard', {
            value: undefined,
            configurable: true,
        });
        document.execCommand = vi.fn().mockReturnValue(true);

        await expect(copyToClipboard('x')).resolves.toBe(true);
    });

    it('returns false when every path fails', async () => {
        Object.defineProperty(navigator, 'clipboard', {
            value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
            configurable: true,
        });
        document.execCommand = vi.fn().mockImplementation(() => {
            throw new Error('unsupported');
        });

        await expect(copyToClipboard('x')).resolves.toBe(false);
    });

    it('cleans up the temporary textarea', async () => {
        Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
        document.execCommand = vi.fn().mockReturnValue(true);

        await copyToClipboard('x');
        expect(document.querySelector('textarea')).toBeNull();
    });
});
