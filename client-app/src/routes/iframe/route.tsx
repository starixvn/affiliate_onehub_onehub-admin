import { createFileRoute, redirect } from '@tanstack/react-router'
import { tokenService } from '@/lib/auth/token-service'
import { DirectionProvider } from '@/context/direction-provider'
import { FontProvider } from '@/context/font-provider'
import { LanguageProvider } from '@/context/language-provider'
import { ThemeProvider } from '@/context/theme-provider'
import { IframeLayout } from '@/components/layout/iframe-layout'

function IframeRouteComponent() {
  return (
    <ThemeProvider>
      <FontProvider>
        <DirectionProvider>
          <LanguageProvider>
            <IframeLayout />
          </LanguageProvider>
        </DirectionProvider>
      </FontProvider>
    </ThemeProvider>
  )
}

export const Route = createFileRoute('/iframe')({
  beforeLoad: async ({ location }) => {
    const token = tokenService.getAccessToken()

    if (!token) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: IframeRouteComponent,
})
