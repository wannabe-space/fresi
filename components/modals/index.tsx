'use client'

import { usePathname } from 'next/navigation'
import { createPushModal } from 'pushmodal'
import { useEffect } from 'react'
import { Confirm } from './confirm'
import { Remove } from './remove'
import { SignUp } from './sign-up'

const {
  pushModal,
  popModal,
  popAllModals,
  ModalProvider: PushModalProvider,
  useOnPushModal,
} = createPushModal({
  modals: {
    Remove,
    Confirm,
    SignUp,
  },
})

function ModalProvider() {
  const pathname = usePathname()

  useEffect(() => {
    popAllModals()
  }, [pathname])

  useEffect(() => {
    // const modalsMap = new Map<string, Parameters<typeof pushModal>[0]>([
    //   ['Contact', 'Contact'],
    // ])

    // // to disable
    // if (!modalsMap.get(undefined!))
    //   return

    // const modal = 'Contact'

    // if (!modal)
    //   return

    // const timeout = setTimeout(() => {
    //   pushModal(modal)
    // }, 500)

    // return () => {
    //   popModal(modal)
    //   clearTimeout(timeout)
    // }
  }, [])

  return <PushModalProvider />
}

export {
  ModalProvider,
  popAllModals,
  popModal,
  pushModal,
  useOnPushModal,
}
