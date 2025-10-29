import {describe, expect, it} from "vitest";
import {formatPrice} from "./format.ts";

describe('formatPrice', () => {
    it('formats number as PLN currency with two decimal points', () => {
        const formatted = formatPrice(1234.5);
        expect(formatted).toMatch(/(PLN|zł)/);
        expect(formatted.replace(/\D/g, '')).toBe('123450');
    })

    it('handles zero values', () => {
        expect(formatPrice(0)).toContain('0');
    })
})
