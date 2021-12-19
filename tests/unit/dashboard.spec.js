import { shallowMount } from '@vue/test-utils'
import Dashboard from '@/screens/Dashboard.vue'

describe('Dashboard.vue', () => {
  it('renders h1 when passed', () => {
    const wrapper = shallowMount(Dashboard)
    expect(wrapper.find("h1").text().equal("Flights"))
  })
})
