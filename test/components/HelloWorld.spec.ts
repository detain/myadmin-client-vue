import { mount } from '@vue/test-utils';
import HelloWorld from '@/components/HelloWorld.vue';

describe('HelloWorld', () => {
    it('renders the message prop', () => {
        const wrapper = mount(HelloWorld, { props: { msg: 'Hello Test' } });
        expect(wrapper.text()).toContain('Hello Test');
    });

    it('renders Vite and Vue links', () => {
        const wrapper = mount(HelloWorld, { props: { msg: 'Test' } });
        expect(wrapper.text()).toContain('Vite');
        expect(wrapper.text()).toContain('Vue 3');
    });
});
