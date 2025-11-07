import { useState, useEffect } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Calendar, Users, Radio, Building2, Tag, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { FilterCard } from '@/components/ui/filter-card'
import { useComponents } from './component-provider'

const route = getRouteApi('/iframe/link-generator/component-management/')

type CategoryCountProps = {
  total: number
  active: number
  inactive: number
}

function CategoryCount({ total, active, inactive }: CategoryCountProps) {
  return (
    <div className='text-sm text-gray-700 dark:text-gray-300'>
      <span>Total</span>
      <span>/</span>
      <span>Active</span>
      <span>/</span>
      <span>Inactive</span>
      <span>: </span>
      <span>{total}</span>
      <span>/</span>
      <span>{active}</span>
      <span>/</span>
      <span>{inactive}</span>
    </div>
  )
}

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
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()

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
      count: (
        <CategoryCount
          total={categorySummary?.event.total ?? 0}
          active={categorySummary?.event.active ?? 0}
          inactive={categorySummary?.event.inactive ?? 0}
        />
      ),
      icon: Calendar,
      variant: 'info' as const,
    },
    {
      id: '2',
      title: t('categoryFilters.group.title'),
      count: (
        <CategoryCount
          total={categorySummary?.group.total ?? 0}
          active={categorySummary?.group.active ?? 0}
          inactive={categorySummary?.group.inactive ?? 0}
        />
      ),
      icon: Users,
      variant: 'success' as const,
    },
    {
      id: '3',
      title: t('categoryFilters.channel.title'),
      count: (
        <CategoryCount
          total={categorySummary?.channel.total ?? 0}
          active={categorySummary?.channel.active ?? 0}
          inactive={categorySummary?.channel.inactive ?? 0}
        />
      ),
      icon: Radio,
      variant: 'warning' as const,
    },
    {
      id: '4',
      title: t('categoryFilters.agency.title'),
      count: (
        <CategoryCount
          total={categorySummary?.agency.total ?? 0}
          active={categorySummary?.agency.active ?? 0}
          inactive={categorySummary?.agency.inactive ?? 0}
        />
      ),
      icon: Building2,
      variant: 'danger' as const,
    },
    {
      id: '5',
      title: t('categoryFilters.type.title'),
      count: (
        <CategoryCount
          total={categorySummary?.type.total ?? 0}
          active={categorySummary?.type.active ?? 0}
          inactive={categorySummary?.type.inactive ?? 0}
        />
      ),
      icon: Tag,
      variant: 'secondary' as const,
    },
    {
      id: '6',
      title: t('categoryFilters.landingPage.title'),
      count: (
        <CategoryCount
          total={categorySummary?.landingPage.total ?? 0}
          active={categorySummary?.landingPage.active ?? 0}
          inactive={categorySummary?.landingPage.inactive ?? 0}
        />
      ),
      icon: FileText,
      variant: 'purple' as const,
    },
  ]

  useEffect(() => {
    if (!carouselApi || !selectedCategory) return

    const selectedIndex = categories.findIndex(
      (category) => category.id === selectedCategory
    )

    if (selectedIndex !== -1) {
      carouselApi.scrollTo(selectedIndex)
    }
  }, [selectedCategory, carouselApi, categories])

  return (
    <div className='relative px-12'>
      <Carousel
        setApi={setCarouselApi}
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
