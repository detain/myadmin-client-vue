import { ref, watch, onMounted } from 'vue'

const isDarkMode = ref(false)

export function useDarkMode() {
  const applyClass = (enabled: boolean) => {
    if (enabled) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }

  onMounted(() => {
    const saved = localStorage.getItem('darkMode')
    isDarkMode.value = saved === 'true'
    applyClass(isDarkMode.value)
  })

  watch(isDarkMode, (val) => {
    localStorage.setItem('darkMode', String(val))
    applyClass(val)
  })

  return {
    isDarkMode
  }
}
