import { Outlet } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'

type IframeLayoutProps = {
  children?: React.ReactNode
}

export function IframeLayout({ children }: IframeLayoutProps) {
  return (
    <>
      {children ?? <Outlet />}
      <Toaster duration={5000} />
    </>
  )
}
