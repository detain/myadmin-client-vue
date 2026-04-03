import { mount } from '@vue/test-utils';
import HelloWorld from '@/components/HelloWorld.vue';

describe('HelloWorld', () => {
    it('renders the message prop', ({ annotate }) => {
        annotate('HelloWorld: validates the msg prop is rendered as visible text in the component output');
        const wrapper = mount(HelloWorld, { props: { msg: 'Hello Test' } });
        expect(wrapper.text()).toContain('Hello Test');
    });

    it('renders Vite and Vue links', ({ annotate }) => {
        annotate('HelloWorld: confirms the static Vite and Vue 3 framework reference text is present in the rendered output');
        const wrapper = mount(HelloWorld, { props: { msg: 'Test' } });
        expect(wrapper.text()).toContain('Vite');
        expect(wrapper.text()).toContain('Vue 3');
    });
});
