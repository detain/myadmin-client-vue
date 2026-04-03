import { setActivePinia, createPinia } from 'pinia';
import { useAlertStore } from '@/stores/alert.store';

beforeEach(() => {
    setActivePinia(createPinia());
});

describe('alert.store', () => {
    describe('initial state', () => {
        it('has null alert', ({ annotate }) => {
            annotate('Alert Store: verifies initial state has alert set to null');
            const store = useAlertStore();
            expect(store.alert).toBeNull();
        });
    });

    describe('success()', () => {
        it('sets alert with alert-success type', ({ annotate }) => {
            annotate('Alert Store: verifies success() creates alert object with message and alert-success type');
            const store = useAlertStore();
            store.success('Operation completed');
            expect(store.alert).toEqual({
                message: 'Operation completed',
                type: 'alert-success',
            });
        });
    });

    describe('error()', () => {
        it('sets alert with alert-danger type', ({ annotate }) => {
            annotate('Alert Store: verifies error() creates alert object with message and alert-danger type');
            const store = useAlertStore();
            store.error('Something went wrong');
            expect(store.alert).toEqual({
                message: 'Something went wrong',
                type: 'alert-danger',
            });
        });
    });

    describe('clear()', () => {
        it('sets alert back to null', ({ annotate }) => {
            annotate('Alert Store: verifies clear() resets a success alert back to null');
            const store = useAlertStore();
            store.success('A message');
            expect(store.alert).not.toBeNull();

            store.clear();
            expect(store.alert).toBeNull();
        });

        it('clears an error alert', ({ annotate }) => {
            annotate('Alert Store: verifies clear() resets an error alert back to null');
            const store = useAlertStore();
            store.error('An error');
            store.clear();
            expect(store.alert).toBeNull();
        });
    });
});
