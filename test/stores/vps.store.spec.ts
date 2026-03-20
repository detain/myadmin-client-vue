import { setActivePinia, createPinia } from 'pinia';
import { useVpsStore } from '@/stores/vps.store';
import { fetchWrapper } from '@/helpers/fetchWrapper';

vi.mock('@/helpers/fetchWrapper', () => ({
    fetchWrapper: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
}));

vi.mock('@/router/index', () => ({
    router: { push: vi.fn() },
}));

beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
});

describe('vps.store', () => {
    describe('initial state', () => {
        it('has empty vpsList and loading=false', () => {
            const store = useVpsStore();
            expect(store.vpsList).toEqual([]);
            expect(store.loading).toBe(false);
        });

        it('has error set to false', () => {
            const store = useVpsStore();
            expect(store.error).toBe(false);
        });

        it('has default serviceInfo with vps_id 0', () => {
            const store = useVpsStore();
            expect(store.serviceInfo.vps_id).toBe(0);
            expect(store.serviceInfo.vps_hostname).toBe('');
        });
    });

    describe('getters', () => {
        it('titleField returns hostname', () => {
            const store = useVpsStore();
            store.serviceInfo.vps_hostname = 'my-server.example.com';
            expect(store.titleField).toBe('my-server.example.com');
        });

        it('titleField2 returns vps_ip', () => {
            const store = useVpsStore();
            store.serviceInfo.vps_ip = '192.168.1.1';
            expect(store.titleField2).toBe('192.168.1.1');
        });

        it('titleField3 returns vps_vzid', () => {
            const store = useVpsStore();
            store.serviceInfo.vps_vzid = 'vz-1234';
            expect(store.titleField3).toBe('vz-1234');
        });
    });

    describe('getAll()', () => {
        it('fetches VPS list and sets vpsList', async () => {
            const mockVpsList = [
                { vps_id: 1, vps_hostname: 'server1' },
                { vps_id: 2, vps_hostname: 'server2' },
            ];
            vi.mocked(fetchWrapper.get).mockResolvedValue(mockVpsList);

            const store = useVpsStore();
            await store.getAll();

            expect(store.vpsList).toEqual(mockVpsList);
            expect(store.loading).toBe(false);
        });

        it('sets loading during fetch', async () => {
            let resolvePromise: (value: any) => void;
            const pendingPromise = new Promise((resolve) => {
                resolvePromise = resolve;
            });
            vi.mocked(fetchWrapper.get).mockReturnValue(pendingPromise as Promise<any>);

            const store = useVpsStore();
            const fetchPromise = store.getAll();

            expect(store.loading).toBe(true);

            resolvePromise!([]);
            await fetchPromise;

            expect(store.loading).toBe(false);
        });

        it('sets error on failure', async () => {
            vi.mocked(fetchWrapper.get).mockRejectedValue('Network error');

            const store = useVpsStore();
            await store.getAll();

            expect(store.error).toBe('Network error');
            expect(store.loading).toBe(false);
        });
    });

    describe('getById()', () => {
        it('fetches single VPS details', async () => {
            const mockResponse = {
                serviceInfo: { vps_id: 42, vps_hostname: 'test-vps', vps_ip: '10.0.0.1', vps_vzid: 'vz42' },
                client_links: [],
                billingDetails: { service_cost_info: '$5.00' },
                custCurrency: 'USD',
                custCurrencySymbol: '$',
                serviceMaster: { vps_id: 1 },
                package: 'vps-basic',
                os_template: 'ubuntu-22',
                serviceExtra: {},
                extraInfoTables: {},
                cpu_graph_data: null,
                module: 'vps',
                token: 'tok123',
                da_link: 0,
                sr_link: 0,
                cp_data: {},
                da_data: {},
                plesk12_data: {},
                serviceAddons: { has_cpanel: false },
            };
            vi.mocked(fetchWrapper.get).mockResolvedValue(mockResponse);

            const store = useVpsStore();
            await store.getById(42);

            expect(store.serviceInfo.vps_id).toBe(42);
            expect(store.serviceInfo.vps_hostname).toBe('test-vps');
            expect(store.pkg).toBe('vps-basic');
            expect(store.osTemplate).toBe('ubuntu-22');
            expect(store.token).toBe('tok123');
        });
    });

    describe('queue()', () => {
        it('sends queue action and sets responseText', async () => {
            vi.mocked(fetchWrapper.get).mockResolvedValue({ text: 'VPS restarting', queueId: 99 });

            const store = useVpsStore();
            const result = await store.queue(1, 'restart');

            expect(result).toBe(true);
            expect(store.responseText).toBe('VPS restarting');
            expect(store.queueId).toBe(99);
            expect(store.loading).toBe(false);
        });

        it('returns false on error', async () => {
            vi.mocked(fetchWrapper.get).mockRejectedValue('Queue error');

            const store = useVpsStore();
            const result = await store.queue(1, 'restart');

            expect(result).toBe(false);
            expect(store.error).toBe('Queue error');
        });
    });

    describe('register()', () => {
        it('posts registration data', async () => {
            vi.mocked(fetchWrapper.post).mockResolvedValue({});

            const store = useVpsStore();
            await store.register({ email: 'new@example.com', password: 'pass123' });

            expect(fetchWrapper.post).toHaveBeenCalledWith(
                expect.stringContaining('/register'),
                { email: 'new@example.com', password: 'pass123' }
            );
        });
    });

    describe('getById() error handling', () => {
        it('handles API failure gracefully', async () => {
            const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
            vi.mocked(fetchWrapper.get).mockRejectedValue(new Error('API down'));

            const store = useVpsStore();
            await store.getById(999);

            // Verify console.log was called (may have debug prefix args)
            expect(consoleSpy).toHaveBeenCalled();
            const calls = consoleSpy.mock.calls;
            const hasApiFailedCall = calls.some((args) => args.some((a) => a === 'api failed'));
            expect(hasApiFailedCall).toBe(true);
            consoleSpy.mockRestore();
        });
    });

    describe('delete()', () => {
        it('removes VPS from list after deletion', async () => {
            vi.mocked(fetchWrapper.delete).mockResolvedValue({});

            const store = useVpsStore();
            store.vpsList = [
                { vps_id: 1, vps_hostname: 'a' } as any,
                { vps_id: 2, vps_hostname: 'b' } as any,
            ];

            await store.delete(1);

            expect(store.vpsList).toHaveLength(1);
            expect(store.vpsList[0].vps_id).toBe(2);
        });
    });
});
