import { fetchWrapper } from '@/helpers/fetchWrapper';

const mockLogout = vi.fn();

vi.mock('@/stores/auth.store', () => ({
    useAuthStore: vi.fn(() => ({
        sessionId: 'test-session',
        apiKey: null,
        user: { sessionId: 'test-session' },
        logout: mockLogout,
    })),
}));

function mockFetchResponse(body: any, options: { ok?: boolean; status?: number; contentType?: string } = {}) {
    const { ok = true, status = 200, contentType = 'application/json' } = options;
    return vi.fn().mockResolvedValue({
        ok,
        status,
        headers: {
            get: (name: string) => (name === 'content-type' ? contentType : null),
        },
        json: () => Promise.resolve(body),
    });
}

describe('fetchWrapper', () => {
    const apiUrl = 'https://example.com/apiv2/test';

    beforeEach(() => {
        vi.restoreAllMocks();
        mockLogout.mockReset();
    });

    it('get() sends GET request with auth headers', async ({ annotate }) => {
        await annotate('fetchWrapper: verifies GET request includes sessionid and Content-Type auth headers');
        global.fetch = mockFetchResponse({ success: true });

        await fetchWrapper.get(apiUrl);

        expect(global.fetch).toHaveBeenCalledWith(apiUrl, expect.objectContaining({
            method: 'GET',
            headers: expect.objectContaining({
                sessionid: 'test-session',
                'Content-Type': 'application/json',
            }),
        }));
    });

    it('post() sends POST request with JSON body', async ({ annotate }) => {
        await annotate('fetchWrapper: verifies POST request serializes body as JSON and sets Content-Type header');
        global.fetch = mockFetchResponse({ created: true });
        const body = { name: 'test' };

        await fetchWrapper.post(apiUrl, body);

        expect(global.fetch).toHaveBeenCalledWith(apiUrl, expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(body),
            headers: expect.objectContaining({
                'Content-Type': 'application/json',
            }),
        }));
    });

    it('handles JSON responses', async ({ annotate }) => {
        await annotate('fetchWrapper: verifies successful JSON response body is correctly parsed and returned');
        const responseData = { id: 1, name: 'test' };
        global.fetch = mockFetchResponse(responseData);

        const result = await fetchWrapper.get(apiUrl);

        expect(result).toEqual(responseData);
    });

    it('handles non-ok responses by rejecting', async ({ annotate }) => {
        await annotate('fetchWrapper: verifies non-ok HTTP responses (e.g. 404) reject the promise with error data');
        const errorData = { message: 'Not found' };
        global.fetch = mockFetchResponse(errorData, { ok: false, status: 404 });

        await expect(fetchWrapper.get(apiUrl)).rejects.toEqual(errorData);
    });

    it('auto-logout on 401 response', async ({ annotate }) => {
        await annotate('fetchWrapper: verifies 401 Unauthorized response triggers auth store logout automatically');
        const errorData = { message: 'Unauthorized' };
        global.fetch = mockFetchResponse(errorData, { ok: false, status: 401 });

        await expect(fetchWrapper.get(apiUrl)).rejects.toEqual(errorData);
        expect(mockLogout).toHaveBeenCalled();
    });

    it('auto-logout on 403 response', async ({ annotate }) => {
        await annotate('fetchWrapper: verifies 403 Forbidden response triggers auth store logout automatically');
        const errorData = { message: 'Forbidden' };
        global.fetch = mockFetchResponse(errorData, { ok: false, status: 403 });

        await expect(fetchWrapper.get(apiUrl)).rejects.toEqual(errorData);
        expect(mockLogout).toHaveBeenCalled();
    });

    it('getNoLogout does not trigger logout on 401 error', async ({ annotate }) => {
        await annotate('fetchWrapper: verifies getNoLogout suppresses automatic logout on 401 responses');
        const errorData = { message: 'Unauthorized' };
        global.fetch = mockFetchResponse(errorData, { ok: false, status: 401 });

        await expect(fetchWrapper.getNoLogout(apiUrl)).rejects.toEqual(errorData);
        expect(mockLogout).not.toHaveBeenCalled();
    });

    it('getNoLogout returns data on success', async ({ annotate }) => {
        await annotate('fetchWrapper: verifies getNoLogout returns parsed JSON data on successful responses');
        const responseData = { success: true };
        global.fetch = mockFetchResponse(responseData);

        const result = await fetchWrapper.getNoLogout(apiUrl);
        expect(result).toEqual(responseData);
    });

    it('delete() sends DELETE request', async ({ annotate }) => {
        await annotate('fetchWrapper: verifies delete() issues a DELETE HTTP method request');
        global.fetch = mockFetchResponse({ deleted: true });

        await fetchWrapper.delete(apiUrl);

        expect(global.fetch).toHaveBeenCalledWith(apiUrl, expect.objectContaining({
            method: 'DELETE',
        }));
    });

    it('put() sends PUT request with JSON body', async ({ annotate }) => {
        await annotate('fetchWrapper: verifies PUT request sends JSON-serialized body');
        global.fetch = mockFetchResponse({ updated: true });
        const body = { name: 'updated' };

        await fetchWrapper.put(apiUrl, body);

        expect(global.fetch).toHaveBeenCalledWith(apiUrl, expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify(body),
        }));
    });

    it('patch() sends PATCH request with JSON body', async ({ annotate }) => {
        await annotate('fetchWrapper: verifies PATCH request sends JSON-serialized body');
        global.fetch = mockFetchResponse({ patched: true });
        const body = { field: 'value' };

        await fetchWrapper.patch(apiUrl, body);

        expect(global.fetch).toHaveBeenCalledWith(apiUrl, expect.objectContaining({
            method: 'PATCH',
            body: JSON.stringify(body),
        }));
    });

    it('returns null for non-JSON responses', async ({ annotate }) => {
        await annotate('fetchWrapper: verifies non-JSON content-type responses return null instead of parsing');
        global.fetch = mockFetchResponse(null, { contentType: 'text/html' });

        const result = await fetchWrapper.get(apiUrl);
        expect(result).toBeNull();
    });

    it('sends empty headers for non-API URLs', async ({ annotate }) => {
        await annotate('fetchWrapper: verifies non-API URLs do not receive sessionid auth header');
        global.fetch = mockFetchResponse({ ok: true });
        const nonApiUrl = 'https://example.com/other/endpoint';

        await fetchWrapper.get(nonApiUrl);

        expect(global.fetch).toHaveBeenCalledWith(nonApiUrl, expect.objectContaining({
            headers: expect.objectContaining({
                'Content-Type': 'application/json',
            }),
        }));
        // Should not have sessionid header for non-API URLs
        const callArgs = (global.fetch as any).mock.calls[0][1];
        expect(callArgs.headers.sessionid).toBeUndefined();
    });

    it('does not include body for GET-method requestHasBody calls', async ({ annotate }) => {
        await annotate('fetchWrapper: verifies POST called without arguments omits body from the request');
        global.fetch = mockFetchResponse({ ok: true });
        // post without body
        await fetchWrapper.post(apiUrl);
        const callArgs = (global.fetch as any).mock.calls[0][1];
        expect(callArgs.body).toBeUndefined();
    });
});

describe('fetchWrapper authHeader apiKey branch', () => {
    it('sends X-API-KEY header when apiKey is set and sessionId is not', async ({ annotate }) => {
        await annotate('fetchWrapper: verifies X-API-KEY header is sent instead of sessionid when only apiKey is configured');
        const { useAuthStore } = await import('@/stores/auth.store');
        vi.mocked(useAuthStore).mockReturnValue({
            sessionId: null,
            apiKey: 'my-api-key-123',
            user: {},
            logout: vi.fn(),
        } as any);

        global.fetch = mockFetchResponse({ success: true });

        await fetchWrapper.get('https://example.com/apiv2/test');

        const callArgs = (global.fetch as any).mock.calls[0][1];
        expect(callArgs.headers['X-API-KEY']).toBe('my-api-key-123');
        expect(callArgs.headers.sessionid).toBeUndefined();
    });
});

describe('fetchWrapper non-JSON response in getNoLogout', () => {
    it('returns null for non-JSON successful response via getNoLogout', async ({ annotate }) => {
        await annotate('fetchWrapper: verifies getNoLogout returns null for successful non-JSON responses');
        global.fetch = mockFetchResponse(null, { contentType: 'text/plain' });
        const result = await fetchWrapper.getNoLogout('https://example.com/apiv2/test');
        expect(result).toBeNull();
    });

    it('returns {message, status} for non-JSON error response via getNoLogout', async ({ annotate }) => {
        await annotate('fetchWrapper: verifies getNoLogout rejects with {message, status} object for non-JSON error responses');
        global.fetch = mockFetchResponse(null, { ok: false, status: 500, contentType: 'text/plain' });
        await expect(fetchWrapper.getNoLogout('https://example.com/apiv2/test')).rejects.toEqual({ message: 'HTTP 500', status: 500 });
    });
});
