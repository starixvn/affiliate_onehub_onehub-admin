import { type Row } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { type Component } from '../../data/schema'

const categoryColors: Record<number, string> = {
  1: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  2: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  3: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
  4: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  5: 'bg-gray-200 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
  6: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
}

interface ComponentCategoryCellProps {
  row: Row<Component>
}

export function ComponentCategoryCell({ row }: ComponentCategoryCellProps) {
  const categoryId = row.original.categoryId
  const category = row.original.category
  const colorClass = categoryColors[categoryId] || categoryColors[5]

  return (
    <Badge variant='outline' className={`${colorClass} text-sm`}>
      {category}
    </Badge>
  )
}
