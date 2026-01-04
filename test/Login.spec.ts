import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import Login from '../src/views/Login.vue';
import Swal from 'sweetalert2';
import { useAuthStore } from '../src/stores/auth.store';

vi.mock('sweetalert2');

describe('Login.vue', () => {
  const mountOptions = {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          stubActions: false
        })
      ]
    }
  };
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });


  it('renders login form', () => {
    const wrapper = mount(Login, mountOptions);

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
  });

  it('updates login and password fields', async () => {
    const wrapper = mount(Login, mountOptions);

    const loginInput = wrapper.find('input[name="login"]');
    const passwordInput = wrapper.find('input[type="password"]');

    await loginInput.setValue('testuser');
    await passwordInput.setValue('secret');

    expect((loginInput.element as HTMLInputElement).value).toBe('testuser');
    expect((passwordInput.element as HTMLInputElement).value).toBe('secret');
  });

  it('calls authStore.login on submit', async () => {
    const authStore = useAuthStore();
    const wrapper = mount(Login, mountOptions);

    await wrapper.find('form').trigger('submit.prevent');

    expect(authStore.login).toHaveBeenCalled();
  });

  it('blocks submit when fields are empty', async () => {
    const wrapper = mount(Login, mountOptions);

    await wrapper.find('form').trigger('submit.prevent');

    expect(Swal.fire).not.toHaveBeenCalled();
  });

  it('triggers SweetAlert on valid submit', async () => {
    const wrapper = mount(Login, mountOptions);

    await wrapper.find('input[name="login"]').setValue('user');
    await wrapper.find('input[type="password"]').setValue('pass');

    await wrapper.find('form').trigger('submit.prevent');

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Please wait'
      })
    );
  });
});
