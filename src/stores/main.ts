import { defineStore } from 'pinia'
import type { Property } from '@/types/property'

export const useMainStore = defineStore('main', {
  state: () => ({
    token: '',
    selectedProperty: null as Property | null,
  }),

  getters: {
    getToken: (state) => state.token,
    getSelectedProperty: (state) => state.selectedProperty,
  },

  actions: {
    setToken(token: string) {
      this.token = token
    },
    setSelectedProperty(property: Property | null) {
      this.selectedProperty = property
    },
  },
})
