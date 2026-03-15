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
});
