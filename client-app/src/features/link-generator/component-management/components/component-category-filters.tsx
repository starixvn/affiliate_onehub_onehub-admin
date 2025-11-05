import { getRouteApi } from '@tanstack/react-router'
import { Calendar, Users, Radio, Building2, Tag, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FilterCard } from '@/components/ui/filter-card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { useComponents } from './component-provider'

const route = getRouteApi('/iframe/link-generator/component-management/')

type ComponentCategoryFiltersProps = {
  selectedCategory: string | null
}

export function ComponentCategoryFilters({
  selectedCategory,
}: ComponentCategoryFiltersProps) {
  const { t } = useTranslation('component-management')
  const navigate = route.useNavigate()
  const search = route.useSearch()
  const { categorySummary } = useComponents()

  const handleCategoryClick = (category: string | null) => {
    navigate({
      search: {
        ...search,
        category: category ?? undefined,
        pageIndex: 1,
      },
    })
  }

  const categories = [
    {
      id: '1',
      title: t('categoryFilters.event.title'),
      count: `${categorySummary.event.total}/${categorySummary.event.active}/${categorySummary.event.inactive}`,
      icon: Calendar,
      variant: 'info' as const,
    },
    {
      id: '2',
      title: t('categoryFilters.group.title'),
      count: `${categorySummary.group.total}/${categorySummary.group.active}/${categorySummary.group.inactive}`,
      icon: Users,
      variant: 'success' as const,
    },
    {
      id: '3',
      title: t('categoryFilters.channel.title'),
      count: `${categorySummary.channel.total}/${categorySummary.channel.active}/${categorySummary.channel.inactive}`,
      icon: Radio,
      variant: 'warning' as const,
    },
    {
      id: '4',
      title: t('categoryFilters.agency.title'),
      count: `${categorySummary.agency.total}/${categorySummary.agency.active}/${categorySummary.agency.inactive}`,
      icon: Building2,
      variant: 'danger' as const,
    },
    {
      id: '5',
      title: t('categoryFilters.type.title'),
      count: `${categorySummary.type.total}/${categorySummary.type.active}/${categorySummary.type.inactive}`,
      icon: Tag,
      variant: 'secondary' as const,
    },
    {
      id: '6',
      title: t('categoryFilters.landingPage.title'),
      count: `${categorySummary.landingPage.total}/${categorySummary.landingPage.active}/${categorySummary.landingPage.inactive}`,
      icon: FileText,
      variant: 'rainbow' as const,
    },
  ]

  return (
    <div className='relative px-12'>
      <Carousel
        opts={{
          align: 'start',
          loop: false,
        }}
        className='w-full'
      >
        <CarouselContent className='-ml-4'>
          {categories.map((category) => (
            <CarouselItem
              key={category.id}
              className='basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5'
            >
              <FilterCard
                title={category.title}
                count={category.count}
                icon={category.icon}
                variant={category.variant}
                selected={selectedCategory === category.id}
                onClick={() => handleCategoryClick(category.id)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
