import '@testing-library/jest-dom';
import { vi } from 'vitest';

// jsdom does not implement scrolling; stub it so views can call it freely and tests can assert on it.
Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true, configurable: true });
