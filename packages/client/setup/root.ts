/* __imports__ */
import { watch } from 'vue'
import { useHead } from '@unhead/vue'
import { nanoid } from 'nanoid'
import { configs } from '../env'
import { initSharedState, onPatch, patch } from '../state/shared'
import { initDrawingState } from '../state/drawings'
import { clicksContext, currentPage, getPath, isNotesViewer, isPresenter } from '../logic/nav'
import { router } from '../routes'
import { TRUST_ORIGINS } from '../constants'
import { skipTransition } from '../composables/hmr'

export default function setupRoot() {
  // @ts-expect-error injected in runtime
  // eslint-disable-next-line unused-imports/no-unused-vars
  const injection_arg = undefined

  /* __injections__ */

  const title = configs.titleTemplate.replace('%s', configs.title || 'Slidev')
  useHead({
    title,
    htmlAttrs: configs.htmlAttrs,
  })
  initSharedState(`${title} - shared`)
  initDrawingState(`${title} - drawings`)

  const id = `${location.origin}_${nanoid()}`

  // update shared state
  function updateSharedState() {
    if (isNotesViewer.value)
      return

    // we allow Presenter mode, or Viewer mode from trusted origins to update the shared state
    if (!isPresenter.value && !TRUST_ORIGINS.includes(location.host.split(':')[0]))
      return

    if (isPresenter.value) {
      patch('page', +currentPage.value)
      patch('clicks', clicksContext.value.current)
    }
    else {
      patch('viewerPage', +currentPage.value)
      patch('viewerClicks', clicksContext.value.current)
    }

    patch('lastUpdate', {
      id,
      type: isPresenter.value ? 'presenter' : 'viewer',
      time: new Date().getTime(),
    })
  }
  router.afterEach(updateSharedState)
  watch(clicksContext, updateSharedState)

  onPatch((state) => {
    const routePath = router.currentRoute.value.path
    if (!routePath.match(/^\/(\d+|presenter)\/?/))
      return
    if (state.lastUpdate?.type === 'presenter' && (+state.page !== +currentPage.value || +clicksContext.value.current !== +state.clicks)) {
      skipTransition.value = false
      router.replace({
        path: getPath(state.page),
        query: {
          ...router.currentRoute.value.query,
          clicks: state.clicks || 0,
        },
      })
    }
  })
}
