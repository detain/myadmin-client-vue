// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/user', () => {
    return HttpResponse.json({ firstName: 'John', lastName: 'Doe' });
  }),
  // ... other handlers
];
