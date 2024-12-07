'use client'

import { TooltipContent } from '@radix-ui/react-tooltip'
import { RiBox3Line } from '@remixicon/react'
import { useState } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '~/components/ui/resizable'
import { Tooltip, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'
import { cn } from '~/lib/ui'
import { Sandbox } from './sandbox'

export function SandboxWrapper({ className, children }: { className?: string, children: React.ReactNode }) {
  const [show, setShow] = useState(false)

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className={cn('!overflow-visible', className)}
    >
      <ResizablePanel className="relative !overflow-visible" minSize={40} defaultSize={50}>
        {children}
        {false && (
          <div className="fixed bottom-4 right-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <RiBox3Line onClick={() => setShow(!show)} className="size-8 p-1" />
                </TooltipTrigger>
                <TooltipContent side="left" sideOffset={10}>
                  Sandbox
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </ResizablePanel>
      {show && (
        <>
          <div className="absolute left-0 top-0 z-10 size-2 bg-red-500" />
          <ResizableHandle withHandle className="sticky top-0 z-10 h-screen" />
          <ResizablePanel
            minSize={30}
            defaultSize={50}
            collapsible
            className="sticky top-0 h-screen"
          >
            <div className="h-full">
              <Sandbox />
            </div>
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  )
}
