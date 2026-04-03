import { setActivePinia, createPinia } from 'pinia';
import { useUsersStore } from '@/stores/users.store';
import { useAuthStore } from '@/stores/auth.store';
import { fetchWrapper } from '@/helpers/fetchWrapper';

vi.mock('@/helpers/fetchWrapper', () => ({
    fetchWrapper: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
        getNoLogout: vi.fn(),
    },
}));

vi.mock('@/router/index', () => ({
    router: { push: vi.fn() },
}));

beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    localStorage.clear();
});

describe('users.store', () => {
    describe('initial state', () => {
        it('has default values', () => {
            const store = useUsersStore();
            expect(store.loading).toBe(false);
            expect(store.error).toBe(false);
            expect(store.users).toEqual([]);
            expect(store.user).toEqual({});
        });
    });

    describe('register()', () => {
        it('calls fetchWrapper.post with user data', async () => {
            vi.mocked(fetchWrapper.post).mockResolvedValue({});
            const store = useUsersStore();
            const userData = { firstName: 'John', lastName: 'Doe', username: 'johndoe' };
            await store.register(userData);
            expect(fetchWrapper.post).toHaveBeenCalledWith(
                expect.stringContaining('/register'),
                userData
            );
        });
    });

    describe('getAll()', () => {
        it('sets users on success', async () => {
            const mockUsers = [{ id: 1, firstName: 'John' }, { id: 2, firstName: 'Jane' }];
            vi.mocked(fetchWrapper.get).mockResolvedValue(mockUsers);
            const store = useUsersStore();
            await store.getAll();
            expect(store.loading).toBe(false);
            expect(store.users).toEqual(mockUsers);
        });

        it('sets error on failure', async () => {
            vi.mocked(fetchWrapper.get).mockRejectedValue('Network error');
            const store = useUsersStore();
            await store.getAll();
            expect(store.error).toBe('Network error');
        });
    });

    describe('getById()', () => {
        it('sets user on success', async () => {
            const mockUser = { id: 1, firstName: 'John' };
            vi.mocked(fetchWrapper.get).mockResolvedValue(mockUser);
            const store = useUsersStore();
            await store.getById(1);
            expect(store.loading).toBe(false);
            expect(store.user).toEqual(mockUser);
        });

        it('sets error on failure', async () => {
            vi.mocked(fetchWrapper.get).mockRejectedValue('Not found');
            const store = useUsersStore();
            await store.getById(999);
            expect(store.error).toBe('Not found');
        });

        it('accepts string id', async () => {
            vi.mocked(fetchWrapper.get).mockResolvedValue({ id: 1 });
            const store = useUsersStore();
            await store.getById('1');
            expect(fetchWrapper.get).toHaveBeenCalledWith(expect.stringContaining('/1'));
        });
    });

    describe('update()', () => {
        it('calls fetchWrapper.put', async () => {
            vi.mocked(fetchWrapper.put).mockResolvedValue({});
            const store = useUsersStore();
            await store.update(1, { firstName: 'Updated' });
            expect(fetchWrapper.put).toHaveBeenCalledWith(
                expect.stringContaining('/1'),
                { firstName: 'Updated' }
            );
        });

        it('updates localStorage when updating own record', async () => {
            vi.mocked(fetchWrapper.put).mockResolvedValue({});
            const authStore = useAuthStore();
            authStore.user = { account_id: 5 } as any;
            const store = useUsersStore();
            await store.update(5, { firstName: 'Updated' });
            const stored = JSON.parse(localStorage.getItem('user') || '{}');
            expect(stored.firstName).toBe('Updated');
            expect(authStore.user.firstName).toBe('Updated');
        });

        it('does not update localStorage when updating different user', async () => {
            vi.mocked(fetchWrapper.put).mockResolvedValue({});
            const authStore = useAuthStore();
            authStore.user = { account_id: 5 } as any;
            const store = useUsersStore();
            await store.update(10, { firstName: 'Other' });
            expect(localStorage.getItem('user')).toBeNull();
        });
    });

    describe('delete()', () => {
        it('calls fetchWrapper.delete', async () => {
            vi.mocked(fetchWrapper.delete).mockResolvedValue({});
            const authStore = useAuthStore();
            authStore.user = { account_id: 99 } as any;
            const store = useUsersStore();
            await store.delete(1);
            expect(fetchWrapper.delete).toHaveBeenCalledWith(expect.stringContaining('/1'));
        });

        it('logs out when deleting own record', async () => {
            vi.mocked(fetchWrapper.delete).mockResolvedValue({});
            vi.mocked(fetchWrapper.getNoLogout).mockResolvedValue({});
            const authStore = useAuthStore();
            authStore.user = { account_id: 5 } as any;
            const store = useUsersStore();
            await store.delete(5);
            // After logout, user should be empty
            expect(authStore.user).toEqual({});
        });

        it('does not log out when deleting different user', async () => {
            vi.mocked(fetchWrapper.delete).mockResolvedValue({});
            const authStore = useAuthStore();
            authStore.user = { account_id: 5, name: 'Test' } as any;
            const store = useUsersStore();
            await store.delete(10);
            expect(authStore.user.name).toBe('Test');
        });
    });
});
