import MenuAvailabilityManager from '@/components/shared/MenuAvailabilityManager'

export default function BaristaMenuStatusPage() {
  return (
    <div className="h-full overflow-y-auto">
      <MenuAvailabilityManager filterType="drink" />
    </div>
  )
}
