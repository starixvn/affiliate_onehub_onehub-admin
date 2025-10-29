import { Megaphone, LayoutTemplate, Link2 } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  navGroups: [
    {
      titleKey: 'nav.menu',
      items: [
        {
          titleKey: 'nav.campaignManagement',
          url: '/campaign-management',
          icon: Megaphone,
        },
        {
          titleKey: 'nav.landingPageCMS',
          icon: LayoutTemplate,
          items: [
            {
              titleKey: 'nav.pageManagement',
              url: '/landing-page-cms/page-management',
            },
            {
              titleKey: 'nav.pageBuilder',
              url: '/landing-page-cms/page-builder',
            },
            {
              titleKey: 'nav.assetUploader',
              url: '/landing-page-cms/asset-uploader',
            },
            {
              titleKey: 'nav.registerFormManagement',
              url: '/landing-page-cms/register-form-management',
            },
          ],
        },
        {
          titleKey: 'nav.linkGenerator',
          icon: Link2,
          items: [
            {
              titleKey: 'nav.generateLink',
              url: '/link-generator/generate-link',
            },
            {
              titleKey: 'nav.linkManagement',
              url: '/link-generator/link-management',
            },
            {
              titleKey: 'nav.componentManagement',
              url: '/link-generator/component-management',
            },
          ],
        },
      ],
    },
  ],
}
