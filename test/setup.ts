// setup.ts
import { vi, beforeAll, afterAll, afterEach } from 'vitest';
import { server } from './src/mocks/server';

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that are used in individual tests
// so they don't affect other tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.stop());

// Global jQuery mock (runs before every test file)
vi.mock('jquery', () => {
  const mockJquery = vi.fn(() => ({
    on: vi.fn(),
    off: vi.fn(),
    ready: vi.fn(),
    click: vi.fn(),
    keyup: vi.fn(),
    hide: vi.fn(),
    show: vi.fn(),
    toggle: vi.fn(),
    find: vi.fn(),
    css: vi.fn(),
    addClass: vi.fn(),
    removeClass: vi.fn(),
    delay: vi.fn().mockReturnThis(),
    queue: vi.fn().mockImplementation((fn) => fn()),
    outerHeight: vi.fn(() => 100),
    innerHeight: vi.fn(() => 80)
  }));

  // emulate $.ajax usage
  (mockJquery as any).ajax = vi.fn();

  return {
    default: mockJquery
  };
});
