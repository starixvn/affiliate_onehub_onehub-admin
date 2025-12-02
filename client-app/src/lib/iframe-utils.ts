import type { Direction } from '@/context/direction-provider'
import type { Language } from '@/context/language-provider'

export function isInIframe(): boolean {
  return window.self !== window.top
}

export function getRedirectUrl(): string {
  return isInIframe() ? window.top!.location.href : window.location.href
}

export type IframeMessageType =
  | 'THEME_CHANGE'
  | 'LANGUAGE_CHANGE'
  | 'DIRECTION_CHANGE'

export type IframeMessage =
  | { type: 'THEME_CHANGE'; theme: 'light' | 'dark' | 'system' }
  | { type: 'LANGUAGE_CHANGE'; language: Language }
  | { type: 'DIRECTION_CHANGE'; direction: Direction }

export const TRUSTED_IFRAME_ORIGINS = [
  '*.owmkt.com',
  '*.klc.nexdev.net',
  'localhost',
]

function matchesWhitelistPattern(origin: string, pattern: string): boolean {
  try {
    const url = new URL(origin)
    const hostname = url.hostname

    if (pattern === 'localhost') {
      return hostname === 'localhost' || hostname === '127.0.0.1'
    }

    if (pattern.startsWith('*.')) {
      const domain = pattern.slice(2)
      return hostname === domain || hostname.endsWith('.' + domain)
    }

    return hostname === pattern
  } catch {
    return false
  }
}

export function broadcastToIframes(message: IframeMessage) {
  const iframes = document.querySelectorAll('iframe')
  iframes.forEach((iframe) => {
    if (!iframe.contentWindow) return

    try {
      const iframeOrigin = new URL(iframe.src).origin
      iframe.contentWindow.postMessage(message, iframeOrigin)
    } catch (_) {
      iframe.contentWindow.postMessage(message, '*')
    }
  })
}

export function isValidIframeMessage(
  event: MessageEvent
): event is MessageEvent<IframeMessage> {
  const isWhitelisted = TRUSTED_IFRAME_ORIGINS.some((pattern) =>
    matchesWhitelistPattern(event.origin, pattern)
  )

  if (!isWhitelisted) {
    return false
  }

  const message = event.data
  if (!message || typeof message !== 'object' || !('type' in message)) {
    return false
  }

  const validTypes: IframeMessageType[] = [
    'THEME_CHANGE',
    'LANGUAGE_CHANGE',
    'DIRECTION_CHANGE',
  ]

  return validTypes.includes(message.type)
}
