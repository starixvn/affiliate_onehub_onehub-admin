import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  ArrowRight,
  ChevronRight,
  Laptop,
  Languages,
  Moon,
  Sun,
  UserCog,
  Bell,
  Monitor,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/context/language-provider'
import { useSearch } from '@/context/search-provider'
import { useTheme } from '@/context/theme-provider'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { sidebarData } from './layout/data/sidebar-data'
import { ScrollArea } from './ui/scroll-area'

export function CommandMenu() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setTheme } = useTheme()
  const { setLanguage } = useLanguage()
  const { open, setOpen } = useSearch()

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={t('search.placeholder')} />
      <CommandList>
        <ScrollArea type='hover' className='h-72 pe-1'>
          <CommandEmpty>{t('search.noResults')}</CommandEmpty>
          {sidebarData.navGroups.map((group) => {
            const groupTitle = group.titleKey ? t(group.titleKey) : group.title
            return (
              <CommandGroup key={group.titleKey} heading={groupTitle}>
                {group.items.map((navItem, i) => {
                  const navItemTitle = navItem.titleKey
                    ? t(navItem.titleKey)
                    : navItem.title

                  if (navItem.url)
                    return (
                      <CommandItem
                        key={`${navItem.url}-${i}`}
                        value={navItemTitle}
                        onSelect={() => {
                          runCommand(() => navigate({ to: navItem.url }))
                        }}
                      >
                        <div className='flex size-4 items-center justify-center'>
                          <ArrowRight className='text-muted-foreground/80 size-2' />
                        </div>
                        {navItemTitle}
                      </CommandItem>
                    )

                  return navItem.items?.map((subItem, i) => {
                    const subItemTitle = subItem.titleKey
                      ? t(subItem.titleKey)
                      : subItem.title
                    return (
                      <CommandItem
                        key={`${navItemTitle}-${subItem.url}-${i}`}
                        value={`${navItemTitle}-${subItemTitle}`}
                        onSelect={() => {
                          runCommand(() => navigate({ to: subItem.url }))
                        }}
                      >
                        <div className='flex size-4 items-center justify-center'>
                          <ArrowRight className='text-muted-foreground/80 size-2' />
                        </div>
                        {navItemTitle} <ChevronRight /> {subItemTitle}
                      </CommandItem>
                    )
                  })
                })}
              </CommandGroup>
            )
          })}
          <CommandSeparator />
          <CommandGroup heading={t('common.others')}>
            <CommandItem
              onSelect={() => runCommand(() => navigate({ to: '/profile' }))}
            >
              <UserCog />
              <span>{t('common.profile')}</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => navigate({ to: '/notifications' }))
              }
            >
              <Bell />
              <span>{t('common.notifications')}</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => navigate({ to: '/settings' }))}
            >
              <Monitor />
              <span>{t('common.settings')}</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={t('language.toggle')}>
            <CommandItem onSelect={() => runCommand(() => setLanguage('en'))}>
              <Languages />
              <span>{t('language.english')}</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setLanguage('zh'))}>
              <Languages />
              <span>{t('language.chinese')}</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={t('theme.toggle')}>
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
              <Sun />
              <span>{t('theme.light')}</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
              <Moon className='scale-90' />
              <span>{t('theme.dark')}</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
              <Laptop />
              <span>{t('theme.system')}</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}
