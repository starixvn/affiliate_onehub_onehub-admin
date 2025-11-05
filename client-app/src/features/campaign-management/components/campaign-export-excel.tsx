import { type TFunction } from 'i18next'
import { exportToExcel, EXCEL_STATUS_COLORS } from '@/lib/excel'
import { status } from '../data/data'
import type { Campaign } from '../data/schema'
import type { GetCampaignsRequest } from '../types'

export const formatCampaignsForExcel = (
  campaigns: Campaign[],
  t: TFunction<'campaign-management', undefined>,
  params?: GetCampaignsRequest
) => {
  const getStatusColor = (statusId: number) => {
    const statusOption = status.find((s) => s.value === String(statusId))
    const colorMap: Record<string, string> = {
      green: EXCEL_STATUS_COLORS.green,
      orange: EXCEL_STATUS_COLORS.orange,
      blue: EXCEL_STATUS_COLORS.blue,
      gray: EXCEL_STATUS_COLORS.gray,
    }
    return colorMap[statusOption?.color || 'gray']
  }

  const buildTitle = () => {
    const titleParts = [t('excel.titlePrefix')]

    const searchPart = params?.search
      ? `${t('excel.searchPrefix')}: ${params.search}`
      : t('excel.allCampaigns')
    titleParts.push(searchPart)

    if (params?.status) {
      const statusOption = status.find((s) => s.value === params.status)
      const statusPart = statusOption
        ? `${t('excel.statusPrefix')}: ${statusOption.label}`
        : t('excel.allStatus')
      titleParts.push(statusPart)
    } else {
      titleParts.push(t('excel.allStatus'))
    }

    return titleParts.join(' - ')
  }

  return exportToExcel({
    title: buildTitle(),
    columns: [
      {
        field: 'rowIdx',
        header: t('excel.rowNumber'),
        width: 10,
        style: { alignment: 'center' },
      },
      {
        field: 'campaignCode',
        header: t('table.columns.code'),
        width: 20,
        style: { alignment: 'center' },
      },
      {
        field: 'campaignName',
        header: t('table.columns.name'),
        width: 30,
      },
      {
        field: 'description',
        header: t('table.columns.description'),
        width: 40,
      },
      {
        field: 'createdDate',
        header: t('table.columns.createdDate'),
        width: 20,
        style: { alignment: 'center' },
      },
      {
        field: 'creator',
        header: t('table.columns.createdBy'),
        width: 20,
        style: { alignment: 'center' },
      },
      {
        field: 'updatedDate',
        header: t('table.columns.modifiedDate'),
        width: 20,
        style: { alignment: 'center' },
      },
      {
        field: 'updatedBy',
        header: t('table.columns.modifiedBy'),
        width: 20,
        style: { alignment: 'center' },
      },
      {
        field: (row: Campaign) => row.status,
        header: t('table.columns.status'),
        width: 15,
        style: (row: Campaign) => ({
          alignment: 'center',
          bold: true,
          textColor: getStatusColor(row.statusId),
        }),
      },
    ],
    data: campaigns,
    fileName: `campaigns_${new Date().toISOString().split('T')[0]}`,
  })
}
