import '@testing-library/jest-dom/vitest';
import {beforeEach} from "vitest";

// Ensure tests start with an empty localStorage to avoid persisted cart state leaks
beforeEach(() => {
    window.localStorage.clear();
});
