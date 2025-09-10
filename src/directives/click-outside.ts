import { nextTick } from 'vue'

const clickOutsideDirective = {
  mounted: function (el: any, binding: any) {
    el.clickOutsideEvent = function (event: Event) {
      event.stopPropagation()
      // Ensure binding.value is a function
      if (typeof binding.value !== 'function') {
        console.warn(
          `[v-clickoutside] provided expression '${binding.expression}' is not a function, but has to be. Received:`,
          binding.value,
        )
        return
      }

      if (el.dataset.teleportId) {
        if (
          !(el === event.target || el.contains(event.target)) &&
          !(event.target as HTMLElement).closest(`[data-teleport-from="${el.dataset.teleportId}"]`)
        ) {
          nextTick(() => {
            binding.value(event)
          })
        }
        return
      }

      if (binding && !(el === event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        binding.value(event)
      }
    }

    document.body.addEventListener('click', el.clickOutsideEvent)
  },

  unmounted: function (el: any) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
}

export default clickOutsideDirective
