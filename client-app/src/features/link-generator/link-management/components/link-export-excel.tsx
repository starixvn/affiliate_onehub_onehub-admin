import { type TFunction } from 'i18next'
import { exportToExcel, EXCEL_STATUS_COLORS } from '@/lib/excel'
import { statuses } from '../data/link'
import type { LinkInfo } from '../data/schema'
import type { LinkManagementRequest } from '../types'

export const formatLinksForExcel = (
    links: LinkInfo[],
    t: TFunction<'link-management', undefined>,
    params?: LinkManagementRequest
) => {
    const getStatusColor = (statusId: number) => {
        const statusOption = statuses.find((s) => s.value === String(statusId))
        const colorMap: Record<string, string> = {
            green: EXCEL_STATUS_COLORS.green,
            gray: EXCEL_STATUS_COLORS.gray,
        }
        return colorMap[statusOption?.color || 'gray']
    }

    const buildTitle = () => {
        const titleParts = [t('excel.titlePrefix')]

        const searchPart = params?.search
            ? `${t('excel.searchPrefix')}: ${params.search}`
            : t('excel.allLinks')
        titleParts.push(searchPart)

        if (params?.statusIds) {
            const statusOption = statuses.find((s) => s.value === String(params.statusIds))
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
                field: 'linkName',
                header: t('table.columns.linkName'),
                width: 30,
            },
            {
                field: 'domainName',
                header: t('table.columns.domainName'),
                width: 20,
                style: { alignment: 'center' },
            },
            {
                field: 'shortLink',
                header: t('table.columns.shortLink'),
                width: 40,
            },
            {
                field: 'campaignName',
                header: t('table.columns.campaignName'),
                width: 30,
            },
            {
                field: 'countryName',
                header: t('table.columns.countryName'),
                width: 20,
                style: { alignment: 'center' },
            },
            {
                field: 'channelName',
                header: t('table.columns.channelName'),
                width: 20,
                style: { alignment: 'center' },
            },
            {
                field: 'idCode',
                header: t('table.columns.idCode'),
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
                field: 'click',
                header: t('table.columns.click'),
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
                field: (row: LinkInfo) => row.avgFtdAmount.toFixed(2),
                header: t('table.columns.avgFtdAmount'),
                width: 20,
                style: { alignment: 'center' },
            },
            {
                field: (row: LinkInfo) => row.statusName,
                header: t('table.columns.status'),
                width: 15,
                style: (row: LinkInfo) => ({
                    alignment: 'center',
                    bold: true,
                    textColor: getStatusColor(row.statusId),
                }),
            },
        ],
        data: links,
        fileName: `links_${new Date().toISOString().split('T')[0]}`,
    })
}

