import {
  BasicInfoSection,
  LinkConfigSection,
  ComponentSelectSection,
} from './form-sections'

export function GenerateLinkForm() {
  return (
    <div className='space-y-4'>
      <BasicInfoSection />
      <div className='grid gap-2 sm:gap-4 md:grid-cols-2'>
        <LinkConfigSection />
        <ComponentSelectSection />
      </div>
    </div>
  )
}