import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('renders the main application', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('TripleA Financial')
    expect(wrapper.text()).toContain('Account Management')
  })
})
