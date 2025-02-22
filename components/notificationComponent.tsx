"use client"

import { Bell, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setNotifications, markAsRead, markAllAsRead } from "@/store/notificationSlice"
import { getpatientData } from "@/lib/getTokens"
import type { RootState } from "@/store"
import { backend_url } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { BsDot } from "react-icons/bs";

export default function NotificationsComponent() {
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()
  const notifications = useSelector((state: RootState) => state.notifications.notifications)

  const patient = getpatientData()

  useEffect(() => {
    if (!patient?._id) return

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${backend_url}/notifications/${patient._id}`)
        if (!res.ok) throw new Error("Failed to fetch notifications")

        const data = await res.json()
        dispatch(setNotifications(data))
      } catch (err) {
        console.error(err)
      }
    }

    fetchNotifications()
  }, [patient?._id, dispatch])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const res = await fetch(`${backend_url}/notifications/${notificationId}/read`, {
        method: "PATCH",
      })
      if (!res.ok) throw new Error("Failed to mark notification as read")

      dispatch(markAsRead(notificationId))
    } catch (err) {
      console.error(err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch(`${backend_url}/notifications/${patient._id}/read-all`, {
        method: "PATCH",
      })
      if (!res.ok) throw new Error("Failed to mark all notifications as read")

      dispatch(markAllAsRead())
    } catch (err) {
      console.error(err)
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative rounded-full bg-[#3B0764] text-white hover:text-white backdrop-blur-sm border-white/50 hover:bg-[#3B0764]/80"
            aria-label={`Notifications ${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          sideOffset={5}
          className="w-96 p-0 max-h-[500px] overflow-auto bg-white/90 backdrop-blur-md border-gray-500/20 shadow-lg"
        >
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="border-b border-gray-200 flex flex-row items-center justify-between">
              <CardTitle>Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Mark all as read
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {notifications.length === 0 ? (
                <p className="text-center text-gray-500">No notifications</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className="group p-4 rounded-lg hover:bg-gray-100 transition-all space-y-1"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-4 flex-1">
                        {!notification.read && <span className="h-2 w-2 mt-2 rounded-full bg-blue-500 shrink-0" />}
                        <div className="space-y-1">
                          <div className="flex items-center w-fit justify-between">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <BsDot className="text-gray-500" /> <p className="text-xs text-gray-500 pl-1">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                        </div>
                      </div>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  )
}

