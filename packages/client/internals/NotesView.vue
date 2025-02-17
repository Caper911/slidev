<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { computed, ref, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { configs } from '../env'
import { sharedState } from '../state/shared'
import { fullscreen } from '../state'
import { total } from '../logic/nav'
import { rawRoutes } from '../routes'
import NoteDisplay from './NoteDisplay.vue'
import IconButton from './IconButton.vue'

const slideTitle = configs.titleTemplate.replace('%s', configs.title || 'Slidev')
useHead({
  title: `Notes - ${slideTitle}`,
})

const { isFullscreen, toggle: toggleFullscreen } = fullscreen

const scroller = ref<HTMLDivElement>()
const fontSize = useLocalStorage('slidev-notes-font-size', 18)
const pageNo = computed(() => sharedState.lastUpdate?.type === 'viewer' ? sharedState.viewerPage : sharedState.page)
const currentRoute = computed(() => rawRoutes.find(i => i.path === `${pageNo.value}`))

watch(pageNo, () => {
  scroller.value?.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
  window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
})

function increaseFontSize() {
  fontSize.value = fontSize.value + 1
}

function decreaseFontSize() {
  fontSize.value = fontSize.value - 1
}
</script>

<template>
  <div
    class="fixed top-0 left-0 h-2px bg-teal-500 transition-all duration-500"
    :style="{ width: `${(pageNo - 1) / total * 100}%` }"
  />
  <div class="h-full flex flex-col">
    <div
      ref="scroller"
      class="px-5 flex-auto h-full overflow-auto"
      :style="{ fontSize: `${fontSize}px` }"
    >
      <NoteDisplay
        :note="currentRoute?.meta?.slide?.note"
        :note-html="currentRoute?.meta?.slide?.noteHTML"
        :placeholder="`No notes for Slide ${pageNo}.`"
      />
    </div>
    <div class="flex-none border-t border-gray-400 border-opacity-20">
      <div class="flex gap-1 items-center px-6 py-3">
        <IconButton :title="isFullscreen ? 'Close fullscreen' : 'Enter fullscreen'" @click="toggleFullscreen">
          <carbon:minimize v-if="isFullscreen" />
          <carbon:maximize v-else />
        </IconButton>
        <IconButton title="Increase font size" @click="increaseFontSize">
          <carbon:zoom-in />
        </IconButton>
        <IconButton title="Decrease font size" @click="decreaseFontSize">
          <carbon:zoom-out />
        </IconButton>
        <div class="flex-auto" />
        <div class="p2 text-center">
          {{ pageNo }} / {{ total }}
        </div>
      </div>
    </div>
  </div>
</template>
