import { type TFunction } from 'i18next'
import { exportToExcel, EXCEL_STATUS_COLORS } from '@/lib/excel'
import { statuses } from '../data/data'
import type { LandingPage } from '../data/schema'
import type { GetLandingPagesRequest } from '../types'

export const formatLandingPagesForExcel = (
  landingPages: LandingPage[],
  t: TFunction<'page-management', undefined>,
  params?: GetLandingPagesRequest
) => {
  const getStatusColor = (statusId: number) => {
    const statusOption = statuses.find((s) => s.value === String(statusId))
    const colorMap: Record<string, string> = {
      green: EXCEL_STATUS_COLORS.green,
      orange: EXCEL_STATUS_COLORS.orange,
      gray: EXCEL_STATUS_COLORS.gray,
    }
    return colorMap[statusOption?.color || 'gray']
  }

  const buildTitle = () => {
    const titleParts = [t('excel.titlePrefix')]

    const searchPart = params?.search
      ? `${t('excel.searchPrefix')}: ${params.search}`
      : t('excel.allLandingPages')
    titleParts.push(searchPart)

    if (params?.statusIds) {
      const statusOption = statuses.find((s) => s.value === params.statusIds)
      const statusPart = statusOption
        ? `${t('excel.statusPrefix')}: ${statusOption.label}`
        : t('excel.allStatus')
      titleParts.push(statusPart)
    } else {
      titleParts.push(t('excel.allStatus'))
    }

    if (params?.countryCodes) {
      titleParts.push(`${t('excel.countryPrefix')}: ${params.countryCodes}`)
    }

    if (params?.languageCodes) {
      titleParts.push(`${t('excel.languagePrefix')}: ${params.languageCodes}`)
    }

    if (params?.fromDate && params?.toDate) {
      titleParts.push(
        `${t('excel.dateRangePrefix', 'Date Range')}: ${params.fromDate} - ${params.toDate}`
      )
    } else if (params?.fromDate) {
      titleParts.push(`${t('excel.fromDate', 'From')}: ${params.fromDate}`)
    } else if (params?.toDate) {
      titleParts.push(`${t('excel.toDate', 'To')}: ${params.toDate}`)
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
        field: 'lpCode',
        header: t('table.columns.lpCode'),
        width: 30,
        style: { alignment: 'center' },
      },
      {
        field: 'lpName',
        header: t('table.columns.lpName'),
        width: 40,
      },
      {
        field: 'campaignCode',
        header: t('table.columns.campaignCode'),
        width: 30,
        style: { alignment: 'center' },
      },
      {
        field: 'campaignName',
        header: t('table.columns.campaignName'),
        width: 40,
      },
      {
        field: 'countryName',
        header: t('table.columns.country'),
        width: 20,
        style: { alignment: 'center' },
      },
      {
        field: 'languageName',
        header: t('table.columns.language'),
        width: 20,
        style: { alignment: 'center' },
      },
      {
        field: 'createdDate',
        header: t('table.columns.createdDate'),
        width: 20,
        style: { alignment: 'center' },
      },
      {
        field: 'createdBy',
        header: t('table.columns.createdBy'),
        width: 20,
        style: { alignment: 'center' },
      },
      {
        field: (row: LandingPage) => {
          const date = row.modifiedDate
          const isValidDate =
            date && date !== '01/01/0001' && date !== '01/01/1970'
          return isValidDate ? date : '-'
        },
        header: t('table.columns.modifiedDate'),
        width: 20,
        style: { alignment: 'center' },
      },
      {
        field: (row: LandingPage) => row.modifiedBy || '-',
        header: t('table.columns.modifiedBy'),
        width: 20,
        style: { alignment: 'center' },
      },
      {
        field: 'click',
        header: t('table.columns.uniqueClick'),
        width: 15,
        style: { alignment: 'center' },
      },
      {
        field: 'registration',
        header: t('table.columns.registration'),
        width: 15,
        style: { alignment: 'center' },
      },
      {
        field: 'bonus',
        header: t('table.columns.bonusUser'),
        width: 15,
        style: { alignment: 'center' },
      },
      {
        field: 'ftd',
        header: t('table.columns.ftd'),
        width: 15,
        style: { alignment: 'center' },
      },
      {
        field: (row: LandingPage) => (row.avgFtd ?? 0).toFixed(2),
        header: t('table.columns.avgFtdAmount'),
        width: 18,
        style: { alignment: 'center' },
      },
      {
        field: (row: LandingPage) => row.status,
        header: t('table.columns.status'),
        width: 15,
        style: (row: LandingPage) => ({
          alignment: 'center',
          bold: true,
          textColor: getStatusColor(row.statusId),
        }),
      },
    ],
    data: landingPages,
    fileName: `landing_pages_${new Date().toISOString().split('T')[0]}`,
  })
}
