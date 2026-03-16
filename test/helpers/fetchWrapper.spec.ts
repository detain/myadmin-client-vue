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

    it('get() sends GET request with auth headers', async () => {
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

    it('post() sends POST request with JSON body', async () => {
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

    it('handles JSON responses', async () => {
        const responseData = { id: 1, name: 'test' };
        global.fetch = mockFetchResponse(responseData);

        const result = await fetchWrapper.get(apiUrl);

        expect(result).toEqual(responseData);
    });

    it('handles non-ok responses by rejecting', async () => {
        const errorData = { message: 'Not found' };
        global.fetch = mockFetchResponse(errorData, { ok: false, status: 404 });

        await expect(fetchWrapper.get(apiUrl)).rejects.toEqual(errorData);
    });

    it('auto-logout on 401 response', async () => {
        const errorData = { message: 'Unauthorized' };
        global.fetch = mockFetchResponse(errorData, { ok: false, status: 401 });

        await expect(fetchWrapper.get(apiUrl)).rejects.toEqual(errorData);
        expect(mockLogout).toHaveBeenCalled();
    });

    it('auto-logout on 403 response', async () => {
        const errorData = { message: 'Forbidden' };
        global.fetch = mockFetchResponse(errorData, { ok: false, status: 403 });

        await expect(fetchWrapper.get(apiUrl)).rejects.toEqual(errorData);
        expect(mockLogout).toHaveBeenCalled();
    });

    it('getNoLogout does not trigger logout on 401 error', async () => {
        const errorData = { message: 'Unauthorized' };
        global.fetch = mockFetchResponse(errorData, { ok: false, status: 401 });

        await expect(fetchWrapper.getNoLogout(apiUrl)).rejects.toEqual(errorData);
        expect(mockLogout).not.toHaveBeenCalled();
    });

    it('getNoLogout returns data on success', async () => {
        const responseData = { success: true };
        global.fetch = mockFetchResponse(responseData);

        const result = await fetchWrapper.getNoLogout(apiUrl);
        expect(result).toEqual(responseData);
    });

    it('delete() sends DELETE request', async () => {
        global.fetch = mockFetchResponse({ deleted: true });

        await fetchWrapper.delete(apiUrl);

        expect(global.fetch).toHaveBeenCalledWith(apiUrl, expect.objectContaining({
            method: 'DELETE',
        }));
    });

    it('put() sends PUT request with JSON body', async () => {
        global.fetch = mockFetchResponse({ updated: true });
        const body = { name: 'updated' };

        await fetchWrapper.put(apiUrl, body);

        expect(global.fetch).toHaveBeenCalledWith(apiUrl, expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify(body),
        }));
    });

    it('patch() sends PATCH request with JSON body', async () => {
        global.fetch = mockFetchResponse({ patched: true });
        const body = { field: 'value' };

        await fetchWrapper.patch(apiUrl, body);

        expect(global.fetch).toHaveBeenCalledWith(apiUrl, expect.objectContaining({
            method: 'PATCH',
            body: JSON.stringify(body),
        }));
    });

    it('returns null for non-JSON responses', async () => {
        global.fetch = mockFetchResponse(null, { contentType: 'text/html' });

        const result = await fetchWrapper.get(apiUrl);
        expect(result).toBeNull();
    });

    it('sends empty headers for non-API URLs', async () => {
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

    it('does not include body for GET-method requestHasBody calls', async () => {
        global.fetch = mockFetchResponse({ ok: true });
        // post without body
        await fetchWrapper.post(apiUrl);
        const callArgs = (global.fetch as any).mock.calls[0][1];
        expect(callArgs.body).toBeUndefined();
    });
});
