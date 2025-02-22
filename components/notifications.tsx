"use client"
import { RootState } from '@/store'
import { formatDistanceToNow } from 'date-fns'
import { Bell } from 'lucide-react'
import { useSelector } from 'react-redux'

export default function Notifications() {
  const notifications = useSelector((state: RootState) => state.notifications.notifications)

  return (
    <div className="py-6">
      <h3 className="mb-4 text-lg text-[#59748A] font-semibold">Notifications</h3>
      <div className="space-y-4">
        {notifications.slice(0, 5).map((notification, index) => (
          <div key={index} className="flex items-start gap-3 relative">
            <div className="relative rounded-full bg-purple-100 p-2">
              <Bell className="h-4 w-4 text-purple-600" />
              {!notification.read && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-blue-500 rounded-full"></span>
              )}
            </div>
            <div>
              <p className="font-medium">{notification.title}</p>
              <p className="font-medium text-sm">{notification.message}</p>
              <div className="flex gap-2 text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
