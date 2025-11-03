import { exportToExcel, EXCEL_STATUS_COLORS } from '@/lib/excel'
import { status } from '../data/data'
import type { Campaign } from '../data/schema'

export const formatCampaignsForExcel = (campaigns: Campaign[]) => {
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

  return exportToExcel({
    title: 'CAMPAIGN MANAGEMENT - All Campaigns',
    columns: [
      {
        field: 'rowIdx',
        header: '#',
        width: 10,
        style: { alignment: 'center' },
      },
      {
        field: 'campaignCode',
        header: 'Campaign Code',
        width: 20,
        style: { alignment: 'center' },
      },
      {
        field: 'campaignName',
        header: 'Campaign Name',
        width: 30,
      },
      {
        field: 'description',
        header: 'Campaign Description',
        width: 40,
      },
      {
        field: 'createdDate',
        header: 'Created Date',
        width: 20,
        style: { alignment: 'center' },
      },
      {
        field: 'creator',
        header: 'Created By',
        width: 20,
        style: { alignment: 'center' },
      },
      {
        field: 'updatedDate',
        header: 'Last Modified Date',
        width: 20,
        style: { alignment: 'center' },
      },
      {
        field: 'updatedBy',
        header: 'Last Modified By',
        width: 20,
        style: { alignment: 'center' },
      },
      {
        field: (row: Campaign) => row.status,
        header: 'Status',
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
