import { describe, it, expect } from 'vitest';
import { emailSchema, passwordSchema, getAuthErrorMessage } from './authHelpers';

describe('emailSchema', () => {
    it('accepts a valid email', () => {
        expect(() => emailSchema.parse('user@example.com')).not.toThrow();
    });

    it('accepts emails with subdomains', () => {
        expect(() => emailSchema.parse('user@mail.example.co.uk')).not.toThrow();
    });

    it('rejects a plain string without @', () => {
        expect(() => emailSchema.parse('not-an-email')).toThrow();
    });

    it('rejects an empty string', () => {
        expect(() => emailSchema.parse('')).toThrow();
    });

    it('rejects a string with @ but no domain', () => {
        expect(() => emailSchema.parse('user@')).toThrow();
    });
});

describe('passwordSchema', () => {
    it('accepts a password with exactly 6 characters', () => {
        expect(() => passwordSchema.parse('abc123')).not.toThrow();
    });

    it('accepts a longer password', () => {
        expect(() => passwordSchema.parse('super-secret-password')).not.toThrow();
    });

    it('rejects a password shorter than 6 characters', () => {
        const result = passwordSchema.safeParse('abc');
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe('Password must be at least 6 characters');
    });

    it('rejects an empty password', () => {
        expect(() => passwordSchema.parse('')).toThrow();
    });
});

describe('getAuthErrorMessage', () => {
    const knownErrors: [string, string][] = [
        ['auth/invalid-credential',      'Invalid email or password.'],
        ['auth/email-already-in-use',    'This email is already registered.'],
        ['auth/weak-password',           'Password is too weak.'],
        ['auth/user-not-found',          'Invalid email or password.'],
        ['auth/wrong-password',          'Invalid email or password.'],
        ['auth/too-many-requests',       'Too many attempts. Try again later.'],
        ['auth/network-request-failed',  'Network error. Check your connection.'],
    ];

    it.each(knownErrors)('maps "%s" to the correct message', (code, expected) => {
        expect(getAuthErrorMessage({ code })).toBe(expected);
    });

    it('returns a fallback message for an unknown Firebase error code', () => {
        expect(getAuthErrorMessage({ code: 'auth/unknown-error' })).toBe('Something went wrong. Try again.');
    });

    it('returns a fallback message for an object without a code property', () => {
        expect(getAuthErrorMessage({ message: 'some error' })).toBe('Something went wrong. Try again.');
    });

    it.each([
        ['a plain string', 'plain string error'],
        ['null',            null],
        ['undefined',       undefined],
        ['a number',        42],
    ])('returns a fallback message for %s', (_label, value) => {
        expect(getAuthErrorMessage(value)).toBe('Something went wrong. Try again.');
    });
});
