import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import Cancel from '@/components/services/Cancel.vue';

vi.mock('sweetalert2', () => ({
    default: { fire: vi.fn() },
}));

vi.mock('@/helpers/fetchWrapper', () => ({
    fetchWrapper: {
        get: vi.fn().mockResolvedValue({}),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
        getNoLogout: vi.fn(),
    },
}));

describe('Cancel.vue', () => {
    const mountCancel = () =>
        mount(Cancel, {
            props: {
                id: 101,
                module: 'vps',
                package: 'VPS Slice',
                titleField: 'test.example.com',
                titleField2: '192.168.1.1',
            },
            global: {
                plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: false })],
                stubs: { RouterLink: { template: '<a><slot /></a>' } },
            },
        });

    it('renders cancel form', () => {
        const wrapper = mountCancel();
        expect(wrapper.find('form#cancelForm').exists()).toBe(true);
    });

    it('displays service ID', () => {
        const wrapper = mountCancel();
        expect(wrapper.text()).toContain('101');
    });

    it('displays package name', () => {
        const wrapper = mountCancel();
        expect(wrapper.text()).toContain('VPS Slice');
    });

    it('displays hostname', () => {
        const wrapper = mountCancel();
        expect(wrapper.text()).toContain('test.example.com');
    });

    it('has confirm select with yes/no options', () => {
        const wrapper = mountCancel();
        const select = wrapper.find('select#confirm');
        expect(select.exists()).toBe(true);
        const options = select.findAll('option');
        expect(options.length).toBe(2);
        expect(options[0].attributes('value')).toBe('no');
        expect(options[1].attributes('value')).toBe('yes');
    });

    it('has comment textarea', () => {
        const wrapper = mountCancel();
        expect(wrapper.find('textarea#comment').exists()).toBe(true);
    });

    it('has submit button', () => {
        const wrapper = mountCancel();
        expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
    });
});
