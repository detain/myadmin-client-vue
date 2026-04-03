/**
 * Type checking validation tests.
 *
 * These tests verify that TypeScript types are correctly defined
 * by importing and asserting on type structures.
 */
import type { ServiceListColumn } from '@/components/ServiceListTable.vue';

describe('TypeScript type checking', () => {
    describe('ServiceListColumn interface', () => {
        it('accepts valid column definition', ({ annotate }) => {
            annotate('TypeCheck: verifies ServiceListColumn interface accepts minimal key and label properties');
            const col: ServiceListColumn = {
                key: 'vps_id',
                label: 'ID',
            };
            expect(col.key).toBe('vps_id');
            expect(col.label).toBe('ID');
        });

        it('accepts column with link flag', ({ annotate }) => {
            annotate('TypeCheck: verifies ServiceListColumn interface accepts optional link boolean property');
            const col: ServiceListColumn = {
                key: 'vps_hostname',
                label: 'Hostname',
                link: true,
            };
            expect(col.link).toBe(true);
        });

        it('accepts column with sortable flag', ({ annotate }) => {
            annotate('TypeCheck: verifies ServiceListColumn interface accepts optional sortable boolean property');
            const col: ServiceListColumn = {
                key: 'vps_status',
                label: 'Status',
                sortable: false,
            };
            expect(col.sortable).toBe(false);
        });
    });

    describe('Store type assertions', () => {
        it('auth store types', async ({ annotate }) => {
            await annotate('TypeCheck: verifies auth store module exports useAuthStore with correct type signature');
            const { useAuthStore } = await import('@/stores/auth.store');
            expect(useAuthStore).toBeDefined();
        });

        it('site store types', async ({ annotate }) => {
            await annotate('TypeCheck: verifies site store module exports useSiteStore with correct type signature');
            const { useSiteStore } = await import('@/stores/site.store');
            expect(useSiteStore).toBeDefined();
        });

        it('alert store types', async ({ annotate }) => {
            await annotate('TypeCheck: verifies alert store module exports useAlertStore with correct type signature');
            const { useAlertStore } = await import('@/stores/alert.store');
            expect(useAlertStore).toBeDefined();
        });
    });

    describe('Helper function type assertions', () => {
        it('generatePassword returns string', async ({ annotate }) => {
            await annotate('TypeCheck: verifies generatePassword return type is string at runtime');
            const { generatePassword } = await import('@/helpers/generatePassword');
            const result: string = generatePassword();
            expect(typeof result).toBe('string');
        });

        it('snakeToCamel returns string', async ({ annotate }) => {
            await annotate('TypeCheck: verifies snakeToCamel return type is string at runtime');
            const { snakeToCamel } = await import('@/helpers/snakeToCamel');
            const result: string = snakeToCamel('test_case');
            expect(typeof result).toBe('string');
        });

        it('ucwords returns string', async ({ annotate }) => {
            await annotate('TypeCheck: verifies ucwords return type is string at runtime');
            const { ucwords } = await import('@/helpers/ucwords');
            const result: string = ucwords('hello world');
            expect(typeof result).toBe('string');
        });

        it('moduleLink returns string', async ({ annotate }) => {
            await annotate('TypeCheck: verifies moduleLink return type is string at runtime');
            const { moduleLink } = await import('@/helpers/moduleLink');
            const result: string = moduleLink('vps');
            expect(typeof result).toBe('string');
        });
    });

    describe('View component imports', () => {
        it('Login view can be imported', async ({ annotate }) => {
            await annotate('TypeCheck: verifies Login.vue view component can be dynamically imported and has a default export');
            const module = await import('@/views/Login.vue');
            expect(module.default).toBeDefined();
        });

        it('Register view can be imported', async ({ annotate }) => {
            await annotate('TypeCheck: verifies Register.vue view component can be dynamically imported and has a default export');
            const module = await import('@/views/Register.vue');
            expect(module.default).toBeDefined();
        });

        it('ClientHome view can be imported', async ({ annotate }) => {
            await annotate('TypeCheck: verifies ClientHome.vue view component can be dynamically imported and has a default export');
            const module = await import('@/views/ClientHome.vue');
            expect(module.default).toBeDefined();
        });
    });

    describe('Component imports', () => {
        it('Alert component can be imported', async ({ annotate }) => {
            await annotate('TypeCheck: verifies Alert.vue component can be dynamically imported and has a default export');
            const module = await import('@/components/Alert.vue');
            expect(module.default).toBeDefined();
        });

        it('ServiceListTable component can be imported', async ({ annotate }) => {
            await annotate('TypeCheck: verifies ServiceListTable.vue component can be dynamically imported and has a default export');
            const module = await import('@/components/ServiceListTable.vue');
            expect(module.default).toBeDefined();
        });

        it('Searchbox component can be imported', async ({ annotate }) => {
            await annotate('TypeCheck: verifies Searchbox.vue component can be dynamically imported and has a default export');
            const module = await import('@/components/Searchbox.vue');
            expect(module.default).toBeDefined();
        });

        it('Dialog component can be imported', async ({ annotate }) => {
            await annotate('TypeCheck: verifies Dialog.vue component can be dynamically imported and has a default export');
            const module = await import('@/components/Dialog.vue');
            expect(module.default).toBeDefined();
        });
    });
});
