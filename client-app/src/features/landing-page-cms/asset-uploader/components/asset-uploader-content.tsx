import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Main } from '@/components/layout/main'
import type { AssetDetail } from '../data/schema'
import { AssetFilters } from './asset-filters'
import { AssetPrimaryButtons } from './asset-primary-buttons'
import { useAssetUploader } from './asset-uploader-provider'
import { AssetTable } from './table/asset-table'

export function AssetUploaderContent() {
  const { assets, bannerRootUrl, totalCount, isLoading, isError } = useAssetUploader()
  const [table, setTable] = useState<Table<AssetDetail> | null>(null)

  if (isLoading) {
    return (
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Asset Uploader
            </h2>
            <p className='text-muted-foreground'>
              Create and manage promotional pages, quickly and deploy marketing
              campaigns
            </p>
          </div>
        </div>
        <div className='flex items-center justify-center py-8'>
          <p className='text-muted-foreground'>Loading assets...</p>
        </div>
      </Main>
    )
  }

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Asset Uploader</h2>
          <p className='text-muted-foreground'>
            Create and manage promotional pages, quickly and deploy marketing
            campaigns
          </p>
        </div>
        <AssetPrimaryButtons />
      </div>

      <div className='flex flex-1 flex-col gap-4'>
        <AssetFilters table={table} />

        {isError ? (
          <div className='flex h-24 items-center justify-center'>
            <div className='text-destructive'>Failed to load assets</div>
          </div>
        ) : (
          <AssetTable
            data={assets}
            onTableReady={setTable}
            bannerRootUrl={bannerRootUrl}
            totalCount={totalCount}
          />
        )}
      </div>
    </Main>
  )
}
