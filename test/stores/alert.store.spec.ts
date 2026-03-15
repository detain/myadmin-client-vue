import { setActivePinia, createPinia } from 'pinia';
import { useAlertStore } from '@/stores/alert.store';

beforeEach(() => {
    setActivePinia(createPinia());
});

describe('alert.store', () => {
    describe('initial state', () => {
        it('has null alert', () => {
            const store = useAlertStore();
            expect(store.alert).toBeNull();
        });
    });

    describe('success()', () => {
        it('sets alert with alert-success type', () => {
            const store = useAlertStore();
            store.success('Operation completed');
            expect(store.alert).toEqual({
                message: 'Operation completed',
                type: 'alert-success',
            });
        });
    });

    describe('error()', () => {
        it('sets alert with alert-danger type', () => {
            const store = useAlertStore();
            store.error('Something went wrong');
            expect(store.alert).toEqual({
                message: 'Something went wrong',
                type: 'alert-danger',
            });
        });
    });

    describe('clear()', () => {
        it('sets alert back to null', () => {
            const store = useAlertStore();
            store.success('A message');
            expect(store.alert).not.toBeNull();

            store.clear();
            expect(store.alert).toBeNull();
        });

        it('clears an error alert', () => {
            const store = useAlertStore();
            store.error('An error');
            store.clear();
            expect(store.alert).toBeNull();
        });
    });
});
