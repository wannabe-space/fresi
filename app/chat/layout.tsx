import { SidebarProvider } from './sidebar'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  )
}
