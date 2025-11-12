import { type TFunction } from 'i18next'
import {
  exportToExcel,
  EXCEL_STATUS_COLORS,
  type ColumnConfig,
} from '@/lib/excel'
import {
  status,
  categories,
  deviceTypes,
  LANDING_PAGE_CATEGORY_ID,
} from '../data/data'
import type { Component } from '../data/schema'
import type { GetComponentsRequest } from '../types'

const STATUS_COLOR_MAP: Record<string, string> = {
  green: EXCEL_STATUS_COLORS.green,
  gray: EXCEL_STATUS_COLORS.gray,
}

export const formatComponentsForExcel = (
  components: Component[],
  t: TFunction<'component-management', undefined>,
  params?: GetComponentsRequest
): Promise<void> => {
  const getStatusColor = (statusId: number) => {
    const statusOption = status.find((s) => s.value === String(statusId))
    return STATUS_COLOR_MAP[statusOption?.color || 'gray']
  }

  const buildTitle = () => {
    const titleParts = [t('excel.titlePrefix')]

    const searchPart = params?.search
      ? `${t('excel.searchPrefix')}: ${params.search}`
      : t('excel.allComponents')
    titleParts.push(searchPart)

    if (params?.category) {
      const categoryOption = categories.find((c) => c.value === params.category)
      const categoryPart = categoryOption
        ? `${t('excel.categoryPrefix')}: ${categoryOption.label}`
        : t('excel.allCategories')
      titleParts.push(categoryPart)
    } else {
      titleParts.push(t('excel.allCategories'))
    }

    if (params?.status) {
      const statusOption = status.find((s) => s.value === params.status)
      const statusPart = statusOption
        ? `${t('excel.statusPrefix')}: ${statusOption.label}`
        : t('excel.allStatus')
      titleParts.push(statusPart)
    } else {
      titleParts.push(t('excel.allStatus'))
    }

    if (params?.deviceIds) {
      const deviceIds = params.deviceIds.split(',').map((id) => id.trim())
      const deviceLabels = deviceIds
        .map((id) => deviceTypes.find((d) => d.value === id)?.label)
        .filter((label): label is string => !!label)

      const devicePart =
        deviceLabels.length > 0
          ? `${t('excel.devicePrefix')}: ${deviceLabels.join(', ')}`
          : t('excel.allDevices')
      titleParts.push(devicePart)
    } else if (params?.category === LANDING_PAGE_CATEGORY_ID) {
      titleParts.push(t('excel.allDevices'))
    }

    return titleParts.join(' - ')
  }

  const baseColumns: ColumnConfig<Component>[] = [
    {
      field: 'rowIdx',
      header: t('excel.rowNumber'),
      width: 10,
      style: { alignment: 'center' },
    },
    {
      field: 'componentCode',
      header: t('table.columns.code'),
      width: 20,
      style: { alignment: 'center' },
    },
    {
      field: 'componentName',
      header: t('table.columns.name'),
      width: 30,
    },
    {
      field: 'category',
      header: t('table.columns.category'),
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
  ]

  const deviceColumn: ColumnConfig<Component> = {
    field: (row: Component) => {
      const deviceLabel = deviceTypes.find(
        (d) => d.value === row.deviceId?.toString()
      )?.label
      return deviceLabel || '-'
    },
    header: t('table.columns.device'),
    width: 20,
    style: { alignment: 'center' },
  }

  const statusColumn: ColumnConfig<Component> = {
    field: (row: Component) => row.status,
    header: t('table.columns.status'),
    width: 15,
    style: (row: Component) => ({
      alignment: 'center',
      bold: true,
      textColor: getStatusColor(row.statusId),
    }),
  }

  const columns: ColumnConfig<Component>[] =
    params?.category === LANDING_PAGE_CATEGORY_ID
      ? [...baseColumns, deviceColumn, statusColumn]
      : [...baseColumns, statusColumn]

  return exportToExcel({
    title: buildTitle(),
    columns,
    data: components,
    fileName: `components_${new Date().toISOString().split('T')[0]}`,
  })
}
