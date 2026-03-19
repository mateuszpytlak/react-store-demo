import { renderHook } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { useClickOutside } from './useClickOutside';

describe('useClickOutside', () => {
    const elements: HTMLElement[] = [];

    const makeElement = () => {
        const el = document.createElement('div');
        document.body.appendChild(el);
        elements.push(el);
        return el;
    };

    afterEach(() => {
        elements.forEach((el) => el.remove());
        elements.length = 0;
    });

    it('calls callback when clicking outside the ref element', () => {
        const callback = vi.fn();
        const element = makeElement();

        renderHook(() => useClickOutside({ current: element }, callback));

        fireEvent.mouseDown(document.body);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('does not call callback when clicking the ref element itself', () => {
        const callback = vi.fn();
        const element = makeElement();

        renderHook(() => useClickOutside({ current: element }, callback));

        fireEvent.mouseDown(element);

        expect(callback).not.toHaveBeenCalled();
    });

    it('does not call callback when clicking a child of the ref element', () => {
        const callback = vi.fn();
        const element = makeElement();
        const child = document.createElement('span');
        element.appendChild(child);

        renderHook(() => useClickOutside({ current: element }, callback));

        fireEvent.mouseDown(child);

        expect(callback).not.toHaveBeenCalled();
    });

    it('removes event listener on unmount', () => {
        const callback = vi.fn();
        const element = makeElement();

        const { unmount } = renderHook(() => useClickOutside({ current: element }, callback));

        unmount();
        fireEvent.mouseDown(document.body);

        expect(callback).not.toHaveBeenCalled();
    });

    it('does not call callback when ref.current is null', () => {
        const callback = vi.fn();

        renderHook(() => useClickOutside({ current: null }, callback));

        fireEvent.mouseDown(document.body);

        expect(callback).not.toHaveBeenCalled();
    });
});
