import ExcelJS from 'exceljs'
import { defaultExcelStyles } from './styles'

export interface CellStyle {
  alignment?: 'left' | 'center' | 'right'
  bold?: boolean
  backgroundColor?: string
  textColor?: string
  fontSize?: number
}

export interface ColumnConfig<T> {
  field: keyof T | ((row: T, rowIndex: number) => unknown)
  header: string
  width?: number
  style?: CellStyle | ((row: T) => CellStyle)
}

export interface ExcelExportConfig<T> {
  title: string
  titleStyle?: CellStyle
  columns: ColumnConfig<T>[]
  data: T[]
  fileName: string
  headerStyle?: CellStyle
  bodyStyle?: CellStyle
}

const defaultTitleStyle: CellStyle = defaultExcelStyles.title

const defaultHeaderStyle: CellStyle = defaultExcelStyles.header

const defaultBodyStyle: CellStyle = {
  alignment: 'left',
}

const applyCellStyle = (cell: ExcelJS.Cell, style: CellStyle) => {
  if (style.bold) {
    cell.font = { ...cell.font, bold: true }
  }

  if (style.fontSize) {
    cell.font = { ...cell.font, size: style.fontSize }
  }

  if (style.textColor) {
    cell.font = { ...cell.font, color: { argb: style.textColor } }
  }

  if (style.alignment) {
    cell.alignment = {
      ...cell.alignment,
      horizontal: style.alignment,
      vertical: 'middle',
    }
  }

  if (style.backgroundColor) {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: style.backgroundColor },
    }
  }

  cell.border = {
    top: { style: 'thin', color: { argb: 'CCCCCC' } },
    left: { style: 'thin', color: { argb: 'CCCCCC' } },
    bottom: { style: 'thin', color: { argb: 'CCCCCC' } },
    right: { style: 'thin', color: { argb: 'CCCCCC' } },
  }
}

export const exportToExcel = async <T,>(
  config: ExcelExportConfig<T>,
): Promise<void> => {
  const {
    title,
    titleStyle = {},
    columns,
    data,
    fileName,
    headerStyle = {},
    bodyStyle = {},
  } = config

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Sheet 1')

  const titleCellStyle = { ...defaultTitleStyle, ...titleStyle }
  const headerCellStyle = { ...defaultHeaderStyle, ...headerStyle }
  const bodyCellStyle = { ...defaultBodyStyle, ...bodyStyle }

  const titleRow = worksheet.addRow([title])
  const titleCell = titleRow.getCell(1)
  worksheet.mergeCells(1, 1, 1, columns.length)
  applyCellStyle(titleCell, titleCellStyle)
  titleRow.height = 25

  const headerRow = worksheet.addRow(columns.map((col) => col.header))
  headerRow.eachCell((cell) => {
    applyCellStyle(cell, headerCellStyle)
  })
  headerRow.height = 20

  data.forEach((row, rowIndex) => {
    const rowData = columns.map((col) => {
      if (typeof col.field === 'function') {
        return col.field(row, rowIndex)
      }
      return row[col.field]
    })

    const excelRow = worksheet.addRow(rowData)

    excelRow.eachCell((cell, colNumber) => {
      const columnConfig = columns[colNumber - 1]
      let columnStyle = bodyCellStyle

      if (columnConfig?.style) {
        if (typeof columnConfig.style === 'function') {
          columnStyle = { ...bodyCellStyle, ...columnConfig.style(row) }
        } else {
          columnStyle = { ...bodyCellStyle, ...columnConfig.style }
        }
      }

      applyCellStyle(cell, columnStyle)
    })
  })

  columns.forEach((col, index) => {
    const column = worksheet.getColumn(index + 1)
    column.width = col.width || 15
  })

  worksheet.views = [
    {
      state: 'frozen',
      xSplit: 0,
      ySplit: 2,
      activeCell: 'A3',
    },
  ]

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${fileName}.xlsx`
  link.click()
  window.URL.revokeObjectURL(url)
}
