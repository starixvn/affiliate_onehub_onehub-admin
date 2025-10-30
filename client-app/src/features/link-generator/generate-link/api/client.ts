import type {
  GetLinkGeneratorOptionsResponse,
  GenerateLinkRequest,
  GenerateLinkResponse,
} from '../types'
import { mockLinkGeneratorOptions } from '../data/mock-options'

export const linkGeneratorApi = {
  async getOptions(): Promise<GetLinkGeneratorOptionsResponse> {
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    return {
      errorCode: 0,
      errorMessage: '',
      result: mockLinkGeneratorOptions,
    }
  },

  async generateLink(
    _data: GenerateLinkRequest
  ): Promise<GenerateLinkResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    return {
      errorCode: 0,
      errorMessage: '',
      result: {
        fullLink: `https://example.com/track/${Date.now()}`,
        shortLink: `https://short.link/${Math.random().toString(36).substring(7)}`,
      },
    }
  },
}

