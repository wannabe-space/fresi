'use client'

import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from '@codesandbox/sandpack-react'
import { githubLight } from '@codesandbox/sandpack-themes'
import { useTheme } from 'next-themes'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '~/components/ui/resizable'
import { githubDark } from '~/lib/sandpack'

export function Sandbox() {
  const { resolvedTheme } = useTheme()

  return (
    <SandpackProvider
      // customSetup={{
      //   dependencies: {
      //     'react-markdown': 'latest',
      //   },
      // }}
      theme={resolvedTheme === 'dark' ? githubDark : githubLight}
      className="!h-full"
      template="react"
    >
      <SandpackLayout className="h-full !rounded-none !border-none">
        <ResizablePanelGroup
          direction="vertical"
        >
          <ResizablePanel className="bg-white dark:bg-zinc-900" collapsible minSize={20} defaultSize={50}>
            {/* Add menus */}
            <SandpackCodeEditor className="flex-1" />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel collapsible minSize={20} defaultSize={50}>
            <SandpackPreview className="!h-full" />
          </ResizablePanel>
        </ResizablePanelGroup>
      </SandpackLayout>
    </SandpackProvider>
  )
}
