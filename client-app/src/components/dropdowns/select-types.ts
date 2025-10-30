export interface SelectOption {
  value: string
  label: string
}

export interface SelectGroup {
  groupLabel: string
  options: SelectOption[]
}

export interface NestedSelectGroup {
  groupLabel: string
  groups?: SelectGroup[]
  options?: SelectOption[]
}

export type SelectOptions = SelectOption[] | SelectGroup[] | NestedSelectGroup[]

