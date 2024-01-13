import AppCardSkeleton from '@/components/notifications/AppExplorer/AppCardSkeleton'

export default function AppExplorerSkeleton() {
  return (
    <div className="AppExplorer__apps">
      <div className="AppExplorer__apps__column">
        <AppCardSkeleton />
        <AppCardSkeleton />
        <AppCardSkeleton />
        <AppCardSkeleton />
      </div>
      <div className="AppExplorer__apps__column">
        <AppCardSkeleton />
        <AppCardSkeleton />
        <AppCardSkeleton />
        <AppCardSkeleton />
      </div>
    </div>
  )
}
