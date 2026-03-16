import { mount } from '@vue/test-utils';
import InfoBox from '@/components/services/view_service/InfoBox.vue';

describe('InfoBox.vue', () => {
    const defaultProps = {
        heading: 'Server Info',
        key1: 'Hostname',
        val1: 'test.example.com',
        iconClass: 'fas fa-server',
        iconName: '',
        bgClass: 'bg-info',
        footerKey: 'IP',
        footerVal: '192.168.1.1',
    };

    it('renders heading', () => {
        const wrapper = mount(InfoBox, { props: defaultProps });
        expect(wrapper.find('h3').text()).toBe('Server Info');
    });

    it('renders key-value pair', () => {
        const wrapper = mount(InfoBox, { props: defaultProps });
        expect(wrapper.text()).toContain('Hostname');
        expect(wrapper.text()).toContain('test.example.com');
    });

    it('renders footer key-value', () => {
        const wrapper = mount(InfoBox, { props: defaultProps });
        expect(wrapper.text()).toContain('IP');
        expect(wrapper.text()).toContain('192.168.1.1');
    });

    it('applies background class', () => {
        const wrapper = mount(InfoBox, { props: defaultProps });
        expect(wrapper.find('.small-box').classes()).toContain('bg-info');
    });

    it('renders with different bg class', () => {
        const wrapper = mount(InfoBox, { props: { ...defaultProps, bgClass: 'bg-success' } });
        expect(wrapper.find('.small-box').classes()).toContain('bg-success');
    });
});
