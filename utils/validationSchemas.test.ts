import { describe, it, expect } from 'vitest';
import {
    createLoginSchema,
    createRegistrationSchema,
    createSupportSchema,
    createCodeSchema,
} from './validationSchemas';
import { AttachmentType } from '../types';

/** The schemas only use `t` for messages — identity stub keeps tests focused. */
const t = ((key: string) => key) as never;

describe('createLoginSchema', () => {
    const schema = createLoginSchema(t);

    it('accepts valid credentials', () => {
        const result = schema.safeParse({ email: 'user@example.com', password: 'secret' });
        expect(result.success).toBe(true);
    });

    it('rejects an invalid email with the translated message key', () => {
        const result = schema.safeParse({ email: 'not-an-email', password: 'secret' });
        expect(result.success).toBe(false);
        if (!result.success) {
            const emailIssue = result.error.issues.find((i) => i.path[0] === 'email');
            expect(emailIssue?.message).toBe('auth.formErrors.invalidEmail');
        }
    });

    it('rejects empty fields', () => {
        expect(schema.safeParse({ email: '', password: '' }).success).toBe(false);
    });
});

describe('createRegistrationSchema', () => {
    const schema = createRegistrationSchema(t);

    it('rejects passwords shorter than 8', () => {
        const result = schema.safeParse({
            email: 'a@b.co',
            password: 'short',
            confirmPassword: 'short',
        });
        expect(result.success).toBe(false);
    });

    it('rejects mismatched confirmation', () => {
        const result = schema.safeParse({
            email: 'a@b.co',
            password: 'longenough',
            confirmPassword: 'different!!',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].path).toContain('confirmPassword');
        }
    });

    it('accepts a consistent registration', () => {
        const result = schema.safeParse({
            email: 'a@b.co',
            password: 'longenough',
            confirmPassword: 'longenough',
        });
        expect(result.success).toBe(true);
    });
});

describe('createCodeSchema', () => {
    it('requires exactly 6 characters', () => {
        const schema = createCodeSchema(t);
        expect(schema.safeParse({ code: '12345' }).success).toBe(false);
        expect(schema.safeParse({ code: '123456' }).success).toBe(true);
    });
});

describe('createSupportSchema', () => {
    const schema = createSupportSchema(t);
    const base = {
        name: 'John',
        email: 'john@example.com',
        topic: 'tech',
        subject: 'Broken player',
        message: 'The player stalls on every episode since yesterday.',
    };

    it('accepts a file attachment without a link', () => {
        const result = schema.safeParse({ ...base, attachmentType: AttachmentType.File });
        expect(result.success).toBe(true);
    });

    it('requires a link when attachment type is Link', () => {
        const missing = schema.safeParse({ ...base, attachmentType: AttachmentType.Link });
        expect(missing.success).toBe(false);

        const invalid = schema.safeParse({
            ...base,
            attachmentType: AttachmentType.Link,
            link: 'ftp://something',
        });
        expect(invalid.success).toBe(false);

        const valid = schema.safeParse({
            ...base,
            attachmentType: AttachmentType.Link,
            link: 'https://youtube.com/watch?v=1',
        });
        expect(valid.success).toBe(true);
    });
});
