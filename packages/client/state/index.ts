import { breakpointsTailwind, isClient, useActiveElement, useBreakpoints, useFullscreen, useLocalStorage, useMagicKeys, useToggle, useWindowSize } from '@vueuse/core'
import { computed, ref } from 'vue'
import { slideAspect } from '../env'

export const showRecordingDialog = ref(false)
export const showInfoDialog = ref(false)
export const showGotoDialog = ref(false)

export const shortcutsEnabled = ref(true)
export const breakpoints = useBreakpoints({
  xs: 460,
  ...breakpointsTailwind,
})
export const windowSize = useWindowSize()
export const magicKeys = useMagicKeys()
export const isScreenVertical = computed(() => windowSize.height.value - windowSize.width.value / slideAspect > 120)
export const fullscreen = useFullscreen(isClient ? document.body : null)

export const activeElement = useActiveElement()
export const isInputting = computed(() => ['INPUT', 'TEXTAREA'].includes(activeElement.value?.tagName || '') || activeElement.value?.classList.contains('CodeMirror-code'))
export const isOnFocus = computed(() => ['BUTTON', 'A'].includes(activeElement.value?.tagName || ''))

export const currentCamera = useLocalStorage<string>('slidev-camera', 'default')
export const currentMic = useLocalStorage<string>('slidev-mic', 'default')
export const slideScale = useLocalStorage<number>('slidev-scale', 0)

export const showOverview = useLocalStorage('slidev-show-overview', false)
export const showPresenterCursor = useLocalStorage('slidev-presenter-cursor', true)
export const showEditor = useLocalStorage('slidev-show-editor', false)
export const isEditorVertical = useLocalStorage('slidev-editor-vertical', false)
export const editorWidth = useLocalStorage('slidev-editor-width', isClient ? window.innerWidth * 0.4 : 318)
export const editorHeight = useLocalStorage('slidev-editor-height', isClient ? window.innerHeight * 0.4 : 300)

export const presenterNotesFontSize = useLocalStorage('slidev-presenter-font-size', 1)
export const presenterLayout = useLocalStorage('slidev-presenter-layout', 1)

export function togglePresenterLayout() {
  presenterLayout.value = presenterLayout.value + 1
  if (presenterLayout.value > 2)
    presenterLayout.value = 1
}

export function increasePresenterFontSize() {
  presenterNotesFontSize.value = Math.min(2, presenterNotesFontSize.value + 0.1)
}

export function decreasePresenterFontSize() {
  presenterNotesFontSize.value = Math.max(0.5, presenterNotesFontSize.value - 0.1)
}

export const toggleOverview = useToggle(showOverview)
