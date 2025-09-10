import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    token: '',
  }),

  getters: {
    getToken: (state) => state.token,
  },

  actions: {
    setToken(token: string) {
      this.token = token
    },
  },
})
