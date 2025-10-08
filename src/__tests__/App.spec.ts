import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import App from '../App.vue';

describe('App', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    const pinia = createPinia();
    setActivePinia(pinia);
  });

  it('renders the main application', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
        stubs: {
          // Stub complex child components to avoid deep rendering
          Dialog: true,
          DialogTrigger: true,
          DialogContent: true,
          DialogHeader: true,
          DialogTitle: true,
          DialogDescription: true,
          Button: true,
          AccountBalanceViewer: true,
          CreateAccountForm: true,
          TransferForm: true,
          Toaster: true,
        },
      },
    });

    expect(wrapper.text()).toContain('TripleA Financial');
    expect(wrapper.text()).toContain('Account Management');
  });
});
