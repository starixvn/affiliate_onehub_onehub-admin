import { useMemo } from 'react'
import { type Table } from '@tanstack/react-table'
import { Play, Square, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { useUpdateAssetsStatus } from '../../api/commands'
import type { AssetDetail } from '../../data/schema'

interface AssetBulkActionsProps {
  table: Table<AssetDetail>
  onDeleteClick: () => void
}

export function AssetBulkActions({
  table,
  onDeleteClick,
}: AssetBulkActionsProps) {
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const updateStatusMutation = useUpdateAssetsStatus()

  const { activeCount, inactiveCount } = useMemo(() => {
    return {
      activeCount: selectedRows.filter((row) => row.original.statusId !== 1)
        .length,
      inactiveCount: selectedRows.filter((row) => row.original.statusId !== 2)
        .length,
    }
  }, [selectedRows])

  const handleStatusChange = (statusId: number) => {
    const affectedAssets = selectedRows.filter(
      (row) => row.original.statusId !== statusId
    )

    const assetIds = affectedAssets.map((row) => row.original.mediaId.toString()).join(',')

    updateStatusMutation.mutate(
      { ids: assetIds, statusId },
      {
        onSuccess: (response) => {
          if (response.errorCode === 0) {
            table.resetRowSelection()
          }
        },
      }
    )
  }

  return (
    <BulkActionsToolbar
      table={table}
      entityName={`asset${selectedRows.length > 1 ? 's' : ''}`}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            disabled={activeCount === 0 || updateStatusMutation.isPending}
            onClick={() => handleStatusChange(1)}
            className='size-8'
            aria-label={`Change to Active: ${activeCount} assets`}
            title={`Change to Active: ${activeCount} assets`}
          >
            <Play />
            <span className='sr-only'>Change to Active</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Change to Active: {activeCount} assets</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            disabled={inactiveCount === 0 || updateStatusMutation.isPending}
            onClick={() => handleStatusChange(2)}
            className='size-8'
            aria-label={`Change to Inactive: ${inactiveCount} assets`}
            title={`Change to Inactive: ${inactiveCount} assets`}
          >
            <Square />
            <span className='sr-only'>Change to Inactive</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Change to Inactive: {inactiveCount} assets</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='destructive'
            size='icon'
            onClick={onDeleteClick}
            disabled={updateStatusMutation.isPending}
            className='size-8'
            aria-label='Delete selected assets'
            title='Delete selected assets'
          >
            <Trash2 />
            <span className='sr-only'>Delete selected assets</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete selected assets</p>
        </TooltipContent>
      </Tooltip>
    </BulkActionsToolbar>
  )
}
