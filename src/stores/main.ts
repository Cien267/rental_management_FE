import { defineStore } from 'pinia'
import type { Property } from '@/types/property'

export const useMainStore = defineStore('main', {
  state: () => ({
    token: '',
    selectedProperty: null as Property | null,
    // Sidebar/UI state
    isSidebarCollapsed: false,
    isSidebarOpenMobile: false,
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
    toggleSidebarCollapse() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed
    },
    setSidebarCollapse(val: boolean) {
      this.isSidebarCollapsed = val
    },
    openMobileSidebar() {
      this.isSidebarOpenMobile = true
    },
    closeMobileSidebar() {
      this.isSidebarOpenMobile = false
    },
    toggleMobileSidebar() {
      this.isSidebarOpenMobile = !this.isSidebarOpenMobile
    },
  },
})
