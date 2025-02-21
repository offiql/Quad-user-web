export default function HealthMetrics() {
    return (
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <span className="text-sm text-muted-foreground">Blood</span>
          <p className="mt-1 text-2xl font-semibold">AB+</p>
        </div>
        <div className="rounded-lg border p-4">
          <span className="text-sm text-muted-foreground">Height</span>
          <p className="mt-1 text-2xl font-semibold">186cm</p>
        </div>
        <div className="rounded-lg border p-4">
          <span className="text-sm text-muted-foreground">Weight</span>
          <p className="mt-1 text-2xl font-semibold">20kg</p>
        </div>
      </div>
    )
  }
  
  