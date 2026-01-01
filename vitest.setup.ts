// vitest.setup.ts
import { beforeAll, afterAll, afterEach } from 'vitest';
import { server } from './src/mocks/server';

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that are used in individual tests
// so they don't affect other tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.stop());
