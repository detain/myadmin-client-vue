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

    it('renders heading', ({ annotate }) => {
        annotate('InfoBox: verifies the heading prop is rendered inside an h3 element');
        const wrapper = mount(InfoBox, { props: defaultProps });
        expect(wrapper.find('h3').text()).toBe('Server Info');
    });

    it('renders key-value pair', ({ annotate }) => {
        annotate('InfoBox: confirms the primary key-value pair (key1/val1 props) is displayed in the info box body');
        const wrapper = mount(InfoBox, { props: defaultProps });
        expect(wrapper.text()).toContain('Hostname');
        expect(wrapper.text()).toContain('test.example.com');
    });

    it('renders footer key-value', ({ annotate }) => {
        annotate('InfoBox: validates the footer section displays the footerKey/footerVal prop values');
        const wrapper = mount(InfoBox, { props: defaultProps });
        expect(wrapper.text()).toContain('IP');
        expect(wrapper.text()).toContain('192.168.1.1');
    });

    it('applies background class', ({ annotate }) => {
        annotate('InfoBox: verifies the bgClass prop is applied to the small-box container for correct AdminLTE color theming');
        const wrapper = mount(InfoBox, { props: defaultProps });
        expect(wrapper.find('.small-box').classes()).toContain('bg-info');
    });

    it('applies icon class', ({ annotate }) => {
        annotate('InfoBox: confirms the iconClass prop Font Awesome classes are applied to the icon element');
        const wrapper = mount(InfoBox, { props: defaultProps });
        const icon = wrapper.find('i');
        expect(icon.classes()).toContain('fas');
        expect(icon.classes()).toContain('fa-server');
    });

    it('renders with different bg class', ({ annotate }) => {
        annotate('InfoBox: validates that overriding bgClass to bg-success correctly changes the container background color class');
        const wrapper = mount(InfoBox, { props: { ...defaultProps, bgClass: 'bg-success' } });
        expect(wrapper.find('.small-box').classes()).toContain('bg-success');
    });
});
