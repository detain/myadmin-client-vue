// src/mocks/setup.js
import { setupServer } from 'msw/node';
import { handlers } from '@/handlers'; // Define your mock handlers here

export const server = setupServer(...handlers);
