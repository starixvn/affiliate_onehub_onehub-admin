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
  event: MessageEvent,
  expectedOrigin: string
): event is MessageEvent<IframeMessage> {
  if (event.origin !== '*' && event.origin !== expectedOrigin) return false

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
