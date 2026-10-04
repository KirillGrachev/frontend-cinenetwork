import { describe, it, expect, vi } from 'vitest';
import { addErrorReporter, reportError } from './errorReporter';

describe('errorReporter', () => {
    it('routes errors to registered reporters', () => {
        const reporter = vi.fn();
        const remove = addErrorReporter(reporter);

        const error = new Error('boom');
        reportError(error, { scope: 'test' });

        expect(reporter).toHaveBeenCalledOnce();
        expect(reporter.mock.calls[0][0]).toBe(error);
        expect(reporter.mock.calls[0][1]).toEqual({ scope: 'test' });

        remove();
        reportError(error);
        expect(reporter).toHaveBeenCalledOnce(); // not called after removal
    });

    it('a throwing reporter does not break other reporters', () => {
        const bad = vi.fn(() => {
            throw new Error('reporter failed');
        });
        const good = vi.fn();
        const removeBad = addErrorReporter(bad);
        const removeGood = addErrorReporter(good);

        expect(() => reportError(new Error('x'))).not.toThrow();
        expect(good).toHaveBeenCalledOnce();

        removeBad();
        removeGood();
    });
});
