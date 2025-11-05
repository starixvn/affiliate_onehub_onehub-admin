export const EXCEL_STATUS_COLORS = {
  green: '10B981',
  orange: 'F59E0B',
  blue: '3B82F6',
  gray: '6B7280',
} as const

export const EXCEL_THEME_COLORS = {
  TITLE_BG: 'CDD3D9',
  TITLE_TEXT: '333333',
  HEADER_BG: 'E0E0E0',
  HEADER_TEXT: '333333',
  BORDER: 'CCCCCC',
} as const

export const defaultExcelStyles = {
  title: {
    bold: true,
    alignment: 'center' as const,
    backgroundColor: EXCEL_THEME_COLORS.TITLE_BG,
    textColor: EXCEL_THEME_COLORS.TITLE_TEXT,
    fontSize: 14,
  },
  header: {
    bold: true,
    alignment: 'center' as const,
    backgroundColor: EXCEL_THEME_COLORS.HEADER_BG,
    textColor: EXCEL_THEME_COLORS.HEADER_TEXT,
    fontSize: 12,
  },
}
